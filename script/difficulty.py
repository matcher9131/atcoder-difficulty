from scipy.optimize import minimize
import numpy as np

from contest_json import ContestJson
from problem import Problem
from util.irt_2pl import neg_log_likelihood
from util.rating import adjust_low_rating


def is_nan_tuple(x: tuple[float, float] | tuple[None, None]) -> bool:
    for xi in x:
        if xi is None or np.isnan(xi):
            return True
    return False


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


def estimate_contest_difficulties(contest_id: str, contest_json: ContestJson, easy_problem_indices: list[int] = []) -> dict[str, Problem]:
    print(f"Estimating difficulties of {contest_id}")
    result: dict[str, Problem] = {}
    abilities, responses, is_target_of_easy_problems = contest_json.get_abilities_and_responses()
    for problem_index, (problem_id, problem_title) in enumerate(contest_json.get_id_and_name_of_problems()):
        raw_difficulty_tuple = estimate_problem_difficulty(
            [ability for ability, is_target in zip(abilities, is_target_of_easy_problems) if is_target],
            [response for response, is_target in zip(responses[problem_index], is_target_of_easy_problems) if is_target]
        ) if problem_index in easy_problem_indices else estimate_problem_difficulty(abilities, responses[problem_index])
        difficulty_tuple = None if is_nan_tuple(raw_difficulty_tuple) or raw_difficulty_tuple[0] <= 0 else (round(raw_difficulty_tuple[0], 3), int(round(raw_difficulty_tuple[1], 0)))
        result[problem_id] = { "n": problem_title, "d": difficulty_tuple }
    return result
