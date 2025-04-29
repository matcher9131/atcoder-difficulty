import numpy as np
from scipy.optimize import minimize
from functions.rating import adjust_low_rating
from util.safe_math import safe_log

def irt_2pl(ability: float, discrimination: float, difficulty: float) -> float:
    return 1.0 / (1.0 + np.exp(-discrimination * (ability - difficulty)))

def neg_log_likelihood(params: tuple[float, float], responses: list[float], abilities: list[float]) -> float:
    discrimination, difficulty = params
    likelihood = 0.0
    for ability, response in zip(abilities, responses):
        probability = irt_2pl(ability, discrimination, difficulty)
        likelihood += safe_log(probability) if response == 1 else safe_log(1 - probability)
    return -likelihood

def estimate_problem_difficulty(abilities: list[float], responses: list[int]) -> tuple[float, float]:
    mean = np.mean(abilities)
    stddev = np.std(abilities)
    scaled_abilities = (np.array(abilities) - mean) / stddev
    minimize_result = minimize(
        neg_log_likelihood,
        [np.log(6), 0.0],
        args=(responses, scaled_abilities),
        method='Nelder-Mead'
    )
    if minimize_result.success:
        discrimination, difficulty = minimize_result.x
        return (float(discrimination), adjust_low_rating(float(difficulty * stddev + mean)))
    else:
        print(f"ERROR: {minimize_result.message}")
        return (float("nan"), float("nan"))
