from base64 import b64encode
from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime
from os import listdir
import re
import shutil

from functions.rating import adjust_low_rating
from models.contest import Contest, load_contest
from models.contest_info import ContestInfo
from models.player_histories import PlayerNumContestsDict, load_player_num_contests_dict
from operations.estimate_difficulties import get_abilities_and_responses
from util.json_io import load_json, save_json    

frequency_step = 25
def create_contest_frequency_distributions(contest: Contest, player_num_contests_dict: None | PlayerNumContestsDict, easy_problem_indices: list[int] = []) -> dict[str, list[float]]:
    print(f"Getting frequency distribution of {contest['name']}")

    abilities, responses, is_target_of_easy_problems = get_abilities_and_responses(contest, player_num_contests_dict, easy_problem_indices)
    
    # apply low rating adjustment to make sure abilities are positive
    abilities = [adjust_low_rating(ability) for ability in abilities]

    max_rating = max(abilities) if abilities else 0
    frequency_length = int(max_rating / frequency_step) + 1
    # frequency_dict[problem_id][frequency_index][is_accepted] = frequency
    frequency_dict = { problem_id: [[0, 0] for _ in range(frequency_length)] for problem_id in contest["problems"].keys() }
    for player_index in range(len(abilities)):
        frequency_index = int(abilities[player_index] / frequency_step)
        if frequency_index < 0:
            print(f"Invalid ability = {abilities[player_index]}")
            continue
        for problem_index, problem_id in enumerate(contest["problems"].keys()):
            if problem_index in easy_problem_indices and not is_target_of_easy_problems[player_index]:
                continue
            frequency_dict[problem_id][frequency_index][0 if responses[problem_index][player_index] == 1 else 1] += 1
    
    return {
        problem_id: [
            accepted / (accepted + unaccepted)
            if accepted + unaccepted > 0 else 0
            for [accepted, unaccepted] in frequency_list
        ] for problem_id, frequency_list in frequency_dict.items()
    }


def load_compressed_frequency_distributions() -> dict[str, str]:
    result: dict[str, str] = {}
    for filename in listdir("output/distributions"):
        if re.match(r"^distribution\d+\.json$", filename) is None:
            continue
        distribution_dict: dict[str, str] = load_json(f"output/distributions/{filename}")
        result.update(distribution_dict)
    return result


def to_compressed_frequency_distribution(frequency_distribution: list[float]) -> str:
    return b64encode(bytes([
        100 if frequency >= 1
        else 0 if frequency <= 0
        else 99 if frequency > 0.99
        else 1 if frequency < 0.01
        else int(100 * frequency + 0.5)
        for frequency in frequency_distribution
    ])).decode("ascii")


def get_compressed_frequency_distributions(contest_ids: list[str], forces_update: bool) -> dict[str, str]:
    contest_info = ContestInfo()
    player_num_contests_dict = load_player_num_contests_dict()
    needs_history_older_than_this = datetime.fromisoformat("2025-04-05T12:00:00.000Z")
    compressed_frequency_distributions = load_compressed_frequency_distributions()

    with ProcessPoolExecutor() as executor:
        futures = []
        
        for contest_id in contest_ids:
            try:
                contest: Contest = load_contest(contest_id)
                if forces_update or any([problem_id not in compressed_frequency_distributions for problem_id in contest["problems"].keys()]):
                    contest_date = contest_info.get_contest_date(contest_id)
                    max_rating = contest_info.get_max_rating(contest_id)
                    futures.append(executor.submit(
                        create_contest_frequency_distributions,
                        contest,
                        player_num_contests_dict if contest_date is None or contest_date < needs_history_older_than_this else None,
                        [0, 1] if max_rating is not None and max_rating < 2000 else []
                    ))
            except FileNotFoundError:
                print(f"Contest {contest_id} is not found.")    
        
        for future in as_completed(futures):
            current_distribution: dict[str, list[float]] = future.result()
            compressed_current_distribution = {
                problem_id: to_compressed_frequency_distribution(distribution)
                for problem_id, distribution in current_distribution.items()
            }
            compressed_frequency_distributions.update(compressed_current_distribution)
        
        return compressed_frequency_distributions
       

def save_frequency_distributions(contest_ids: list[str], forces_update: bool):
    compressed_frequency_distributions = get_compressed_frequency_distributions(contest_ids, forces_update)
    # Convert distributions dict to a list in order to sort by alphabetical order
    ordered_compressed_frequency_distributions = sorted(
        [(problem_id, distribution) for problem_id, distribution in compressed_frequency_distributions.items()],
        key=lambda tuple: tuple[0].replace("/", "~")
    )
    # Split into chunks
    ordered_compressed_frequency_distributions_chunks = [
        ordered_compressed_frequency_distributions[i:i+1000]
        for i in range(0, len(ordered_compressed_frequency_distributions), 1000)
    ]
    # Save each and copy
    for i, chunk in enumerate(ordered_compressed_frequency_distributions_chunks):
        save_json(dict(chunk), f"output/distributions/distribution{i}.json")
        shutil.copy2(f"output/distributions/distribution{i}.json", f"../src/assets/distributions/distribution{i}.json")
    # Save chunk index file and copy
    chunkLastIds = [chunk[-1][0] for chunk in ordered_compressed_frequency_distributions_chunks]
    save_json(chunkLastIds, "output/distribution_chunk.json")
    shutil.copy2("output/distribution_chunk.json", f"../src/assets/distribution_chunk.json")
