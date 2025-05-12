from concurrent.futures import as_completed, ProcessPoolExecutor
from datetime import datetime
from numpy import isnan
import shutil

from functions.irt_2pl import estimate_problem_difficulty
from functions.rating import get_raw_rating
from models.contest import Contest, load_contest
from models.contest_info import ContestInfo
from models.player_histories import PlayerNumContestsDict, load_player_num_contests_dict
from models.problem import Problem
from util.json_io import load_json, save_json, enumerate_contest_ids

def is_nan_tuple(x: tuple[float, float] | tuple[None, None]) -> bool:
    for xi in x:
        if xi is None or isnan(xi):
            return True
    return False

def get_abilities_and_responses(
    contest: Contest,
    player_num_contests_dict: None | PlayerNumContestsDict,
    easy_problem_indices: list[int] = []
) -> tuple[list[float], list[list[int]], list[bool]]:
    abilities: list[float] = []
    responses: list[list[int]] = [[] for _ in range(len(contest["problems"]))]
    is_target_of_easy_problems: list[bool] = []
    for player in contest["players"]:
        if player["rating"] <= 0:
            continue
        num_contests: int | None
        if player_num_contests_dict is None:
            # "numContests" includes this contest, so rated player's value must be reduced by 1.
            num_contests = player["numContests"] - (1 if player["isRated"] else 0)
        else:
            num_contests_dict = player_num_contests_dict.get(player["name"])
            if num_contests_dict is None or len(num_contests_dict) == 0:
                continue
            num_contests = num_contests_dict.get(contest["name"])
        if num_contests is None:
            print(f"Entry not found: contest_name = {contest['name']}, player = {player['name']}")
            continue
        if num_contests <= 0:
            # Ignore newbies because their raw rating are all 1200 regardless their skills.
            # (and "numContests" can be -1 for rated and deleted players)
            continue
        abilities.append(get_raw_rating(player["rating"], num_contests))
        for problem_index in range(len(contest["problems"])):
            responses[problem_index].append(player["responses"][problem_index])
        # Exclude players who have no submissions to easy problems in estimating difficulties of easy problems
        is_target_of_easy_problems.append(any([player["responses"][easy_problem_index] != -1 for easy_problem_index in easy_problem_indices]))
    return abilities, responses, is_target_of_easy_problems


def estimate_contest_difficulties(contest: Contest, player_num_contests_dict: None | PlayerNumContestsDict, easy_problem_indices: list[int] = []) -> dict[str, Problem]:
    print(f"Estimating difficulties of {contest['name']}")
    result: dict[str, Problem] = {}
    abilities, responses, is_target_of_easy_problems = get_abilities_and_responses(contest, player_num_contests_dict, easy_problem_indices)
    for problem_index, (problem_id, problem_display_name) in enumerate(contest["problems"].items()):
        raw_difficulty_tuple = estimate_problem_difficulty(
            [ability for ability, is_target in zip(abilities, is_target_of_easy_problems) if is_target],
            [response for response, is_target in zip(responses[problem_index], is_target_of_easy_problems) if is_target]
        ) if problem_index in easy_problem_indices else estimate_problem_difficulty(abilities, responses[problem_index])
        difficulty_tuple = None if is_nan_tuple(raw_difficulty_tuple) or raw_difficulty_tuple[0] < 0 else (round(raw_difficulty_tuple[0], 3), int(round(raw_difficulty_tuple[1], 0)))
        result[problem_id] = { "n": problem_display_name, "d": difficulty_tuple }
    return result


def estimate_and_save_difficulties(contest_ids: list[str], forces_update: bool):
    output_filepath = "output/problems.json"
    problem_dict: dict[str, Problem] = load_json(output_filepath)
    contest_info = ContestInfo()

    if (not contest_ids):
        contest_ids = enumerate_contest_ids()
    
    player_num_contests_dict = load_player_num_contests_dict()

    needs_history_older_than_this = datetime.fromisoformat("2025-04-05T12:00:00.000Z")

    with ProcessPoolExecutor() as executor:
        futures = []

        for contest_id in contest_ids:
            try:
                contest: Contest = load_contest(contest_id)
                if (forces_update or any([problem_id not in problem_dict for problem_id in contest["problems"].keys()])):
                    contest_date = contest_info.get_contest_date(contest_id)
                    max_rating = contest_info.get_max_rating(contest_id)
                    futures.append(executor.submit(
                        estimate_contest_difficulties,
                        contest,
                        player_num_contests_dict if contest_date is None or contest_date < needs_history_older_than_this else None,
                        [0, 1] if max_rating is not None and max_rating < 2000 else []
                    ))
            except FileNotFoundError:
                print(f"Contest {contest_id} is not found.")
        
        try:
            for future in as_completed(futures):
                problem_dict.update(future.result())
        except KeyboardInterrupt:
            print("Stopping process...")
            executor.shutdown(wait=False)
        finally:
            save_json(problem_dict, output_filepath)
            shutil.copy2("output/problems.json", "../public/problems.json")    
