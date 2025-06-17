from base64 import b64encode

from functions.rating import adjust_low_rating
from models.contest import Contest
from models.player_histories import PlayerNumContestsDict
from operations.estimate_difficulties import get_abilities_and_responses
from util.json_io import load_json, save_json


def to_compressed_frequency_distribution(frequency_distribution: list[float]) -> str:
    return b64encode(bytes([
        100 if frequency >= 1
        else 0 if frequency <= 0
        else 99 if frequency > 0.99
        else 1 if frequency < 0.01
        else int(100 * frequency + 0.5)
        for frequency in frequency_distribution
    ])).decode("ascii")


distribution_step = 25
def create_compressed_frequency_distributions(contest: Contest, player_num_contests_dict: None | PlayerNumContestsDict, easy_problem_indices: list[int] = []) -> dict[str, str]:
    print(f"Getting frequency distribution of {contest['name']}")

    abilities, responses, is_target_of_easy_problems = get_abilities_and_responses(contest, player_num_contests_dict, easy_problem_indices)
    
    # apply low rating adjustment to make sure abilities are positive
    abilities = [adjust_low_rating(ability) for ability in abilities]

    max_rating = max(abilities) if abilities else 0
    distribution_length = int(max_rating / distribution_step) + 1
    # distribution_dict[problem_id][frequency_index][is_accepted] = frequency
    distribution_dict = { problem_id: [[0, 0] for _ in range(distribution_length)] for problem_id in contest["problems"].keys() }
    for player_index in range(len(abilities)):
        frequency_index = int(abilities[player_index] / distribution_step)
        if frequency_index < 0:
            print(f"Invalid ability = {abilities[player_index]}")
            continue
        for problem_index, problem_id in enumerate(contest["problems"].keys()):
            if problem_index in easy_problem_indices and not is_target_of_easy_problems[player_index]:
                continue
            distribution_dict[problem_id][frequency_index][0 if responses[problem_index][player_index] == 1 else 1] += 1
    
    return {
        problem_id: to_compressed_frequency_distribution([
            accepted / (accepted + unaccepted)
            if accepted + unaccepted > 0 else 0
            for [accepted, unaccepted] in distribution
        ]) for problem_id, distribution in distribution_dict.items()
    }


def get_distribution_path(index: int) -> str:
    return f"../src/assets/distributions/distribution{index}.json"


distribution_chunk_path = "../src/assets/distribution_chunk.json"
def load_all_distributions() -> dict[str, str]:
    distribution_chunk_json: list[str] = load_json(distribution_chunk_path)
    num_files = len(distribution_chunk_json)
    result: dict[str, str] = {}
    for i in range(num_files):
        distribution_json: dict[str, str] = load_json(get_distribution_path(i))
        result |= distribution_json
    return result


items_per_chunk = 1000
def save_all_distributions(distributions: dict[str, str]):
    # Convert distributions dict to a list in order to sort by alphabetical order
    ordered_distributions = sorted(
        [(problem_id, distribution) for problem_id, distribution in distributions.items()],
        key=lambda tuple: tuple[0].replace("/", "~")
    )
    # Split into chunks
    ordered_distributions_chunks = [
        ordered_distributions[i:i+items_per_chunk]
        for i in range(0, len(ordered_distributions), items_per_chunk)
    ]
    # Save each
    for i, chunk in enumerate(ordered_distributions_chunks):
        save_json(dict(chunk), get_distribution_path(i))
    # Save chunk index file and copy
    chunkLastIds = [chunk[-1][0] for chunk in ordered_distributions_chunks]
    save_json(chunkLastIds, distribution_chunk_path)
