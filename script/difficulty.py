from scipy.optimize import minimize
import numpy as np

from contest import Contest
from problem import Problem
from util.irt_2pl import neg_log_likelihood
from util.rating import adjust_low_rating, get_raw_rating


def is_nan_tuple(x: tuple[float, float] | tuple[None, None]) -> bool:
    for xi in x:
        if xi is None or np.isnan(xi):
            return True
    return False


def get_abilities_and_responses(
    contest: Contest,
    easy_problem_indices: list[int] = []
) -> tuple[list[float], list[list[int]], list[bool]]:
    abilities: list[float] = []
    responses: list[list[int]] = [[] for _ in range(len(contest["problems"]))]
    is_target_of_easy_problems: list[bool] = []
    for player in contest["players"]:
        if player["rating"] <= 0:
            continue
        # "numContests" includes this contest, so rated player's value must be reduced by 1.
        num_contests = player["numContests"] - (1 if player["isRated"] else 0)
        if num_contests <= 0:
            # Ignore newbies because their raw rating are all 1200 regardless their skills.
            # (and "num_contests" can be -1 for rated and deleted players)
            continue
        abilities.append(get_raw_rating(player["rating"], num_contests))
        for problem_index in range(len(contest["problems"])):
            responses[problem_index].append(player["responses"][problem_index])
        # Exclude players who have no submissions to easy problems in estimating difficulties of easy problems
        is_target_of_easy_problems.append(any([player["responses"][easy_problem_index] != -1 for easy_problem_index in easy_problem_indices]))
    return abilities, responses, is_target_of_easy_problems


def estimate_problem_difficulty(abilities: list[float], responses: list[int]) -> tuple[float, float]:
    mean = np.mean(abilities)
    # Fix stddev for solve probability
    # stddev = np.std(abilities)
    stddev = 600.0
    scaled_abilities = (np.array(abilities) - mean) / stddev
    minimize_result = minimize(
        neg_log_likelihood,
        [np.log(6), 0.0],
        args=(responses, scaled_abilities),
        method='Nelder-Mead',
        options={"maxiter": 1000}
    )
    if minimize_result.success:
        discrimination, difficulty = minimize_result.x
        return (float(discrimination), adjust_low_rating(float(difficulty * stddev + mean)))
    else:
        print(f"ERROR: {minimize_result.message}")
        return (float("nan"), float("nan"))


def estimate_contest_difficulties(contest: Contest, easy_problem_indices: list[int] = []) -> dict[str, Problem]:
    print(f"Estimating difficulties of {contest['name']}")
    result: dict[str, Problem] = {}
    abilities, responses, is_target_of_easy_problems = get_abilities_and_responses(contest, easy_problem_indices)
    for problem_index, (problem_id, problem_display_name) in enumerate(contest["problems"].items()):
        raw_difficulty_tuple = estimate_problem_difficulty(
            [ability for ability, is_target in zip(abilities, is_target_of_easy_problems) if is_target],
            [response for response, is_target in zip(responses[problem_index], is_target_of_easy_problems) if is_target]
        ) if problem_index in easy_problem_indices else estimate_problem_difficulty(abilities, responses[problem_index])
        difficulty_tuple = None if is_nan_tuple(raw_difficulty_tuple) or raw_difficulty_tuple[0] <= 0 else (round(raw_difficulty_tuple[0], 3), int(round(raw_difficulty_tuple[1], 0)))
        result[problem_id] = { "n": problem_display_name, "d": difficulty_tuple }
    return result
