from numpy import isnan
from functions.irt_2pl import estimate_problem_difficulty
from functions.rating import get_raw_rating
from models.contest import Contest, load_contest
from models.contest_entry import ContestEntry
from models.estimation_settings import contest_needs_history
from models.problem import Problem
from util.json_io import load_json, save_json, enumerate_contest_names

def is_nan_tuple(x: tuple[float, float] | tuple[None, None]) -> bool:
    for xi in x:
        if xi is None or isnan(xi):
            return True
    return False


def get_num_contests(entries: list[ContestEntry], contest_name: str) -> int:
    i = 0
    for entry in entries:
        if entry["contest"] == contest_name:
            return i
        if entry["isRated"]:
            i += 1
    return -1


def get_abilities_and_responses(
    contest: Contest,
    player_histories: None | dict[str, list[ContestEntry]],
    easy_problem_indices: list[int] = []
) -> tuple[list[float], list[list[int]], list[bool]]:
    abilities: list[float] = []
    responses: list[list[int]] = [[] for _ in range(len(contest["problems"]))]
    is_target_of_easy_problems: list[bool] = []
    for player in contest["players"]:
        if player["rating"] <= 0:
            continue
        if player_histories is None:
            # "numContests" includes this contest, so rated player's value must be reduced by 1.
            num_contests = player["numContests"] - (1 if player["isRated"] else 0)
            if num_contests == -1:
                # "numContests" can be -1 for rated and deleted players
                continue
        else:
            history = player_histories.get(player["name"])
            if history is None or len(history) == 0:
                continue
            num_contests = get_num_contests(history, contest["name"])
            if num_contests == -1:
                print(f"Entry not found: contest_name = {contest['name']}, player = {player['name']}")
                continue
        if num_contests == 0:
            # Ignore newbies because their raw rating are all 1200 regardless their skills.
            continue
        abilities.append(get_raw_rating(player["rating"], num_contests))
        for problem_index in range(len(contest["problems"])):
            responses[problem_index].append(player["responses"][problem_index])
        # Exclude players who have no submissions to easy problems in estimating difficulties in easy problem
        is_target_of_easy_problems.append(any([player["responses"][easy_problem_index] != -1 for easy_problem_index in easy_problem_indices]))
    return abilities, responses, is_target_of_easy_problems


def estimate_contest_difficulties(contest: Contest, player_histories: None | dict[str, list[ContestEntry]], easy_problem_indices: list[int] = []) -> list[tuple[float, float]]:
    result = []
    abilities, responses, is_target_of_easy_problems = get_abilities_and_responses(contest, player_histories, easy_problem_indices)
    for problem_index in range(len(contest["problems"])):
        if problem_index in easy_problem_indices:
            result.append(estimate_problem_difficulty(
                [ability for ability, is_target in zip(abilities, is_target_of_easy_problems) if is_target],
                [response for response, is_target in zip(responses[problem_index], is_target_of_easy_problems) if is_target]
            ))
        else:
            result.append(estimate_problem_difficulty(abilities, responses[problem_index]))
    return result


def estimate_and_save_difficulties(contest_names: list[str], forces_update: bool):
    output_filepath = "output/problems.json"
    problem_dict: dict[str, Problem] = load_json(output_filepath)

    player_histories = load_json("output/histories.json")

    if (not contest_names):
        contest_names = enumerate_contest_names()

    try:
        for contest_name in contest_names:
            try:
                contest: Contest = load_contest(contest_name)
                if (not forces_update and all(problem_id in problem_dict for problem_id in contest["problems"])):
                    continue
                print(f"Estimating difficulties of {contest_name}")
                raw_difficulties = estimate_contest_difficulties(
                    contest,
                    player_histories if contest_needs_history(contest_name) else None,
                    [0, 1] if contest_name.startswith("abc") else []
                )
                difficulties = [None if is_nan_tuple(difficulty_tuple) else difficulty_tuple for difficulty_tuple in raw_difficulties]
                for problem_id, difficulty_tuple in zip(contest["problems"], difficulties):
                    problem_dict[problem_id] = { "n": contest["problems"][problem_id], "d": difficulty_tuple }
            except FileNotFoundError:
                print(f"Contest {contest_name} is not found.")
    except KeyboardInterrupt:
        print(f"Stopping process...")
    finally:
        save_json(problem_dict, output_filepath)
