from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime

from functions.rating import adjust_low_rating
from models.contest import Contest, load_contest
from models.contest_info import ContestInfo
from models.player_histories import PlayerNumContestsDict, load_player_num_contests_dict
from operations.estimate_difficulties import get_abilities_and_responses
from util.json_io import load_json, save_json    

# returns [contest_id, frequency_dict]
def create_contest_frequency_distributions(contest: Contest, player_num_contests_dict: None | PlayerNumContestsDict, easy_problem_indices: list[int] = []) -> tuple[str, dict[str, list[float]]]:
    print(f"Getting frequency distribution of {contest['name']}")
    frequency_step = 25

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
    
    return (
        contest["name"],
        {
            problem_id: [
                round(accepted / (accepted + unaccepted) * 100, 1)
                if accepted + unaccepted > 0 else 0
                for [accepted, unaccepted] in frequency_list
            ] for problem_id, frequency_list in frequency_dict.items()
        }
    )
    
def save_frequency_distributions(contest_ids: list[str]):
    contest_info = ContestInfo()
    all_contest_ids = contest_info.enumerate_all_contests()
    player_num_contests_dict = load_player_num_contests_dict()
    needs_history_older_than_this = datetime.fromisoformat("2025-04-05T12:00:00.000Z")
    files: list[dict[str, list[float]]] = [load_json(f"output/frequency/frequency{i}.json") for i in [0, 1, 2, 3]]

    with ProcessPoolExecutor() as executor:
        futures = []

        try:
            for contest_id in contest_ids:
                contest: Contest = load_contest(contest_id)
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
    
        try:
            for future in as_completed(futures):
                contest_id: str
                frequency_dict: dict[str, list[float]]
                contest_id, frequency_dict = future.result()
                contest_index = all_contest_ids.index(contest_id)
                file_index = int(contest_index / 200)
                files[file_index].update(frequency_dict)
        except KeyboardInterrupt:
            print("Stopping process...")
            executor.shutdown(wait=False)
        finally:
            for file_index, file in enumerate(files):
                save_json(file, f"output/frequency/frequency{file_index}.json")
            # copy
