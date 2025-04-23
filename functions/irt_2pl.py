import numpy as np
import numpy.typing as npt
from scipy.optimize import minimize
from functions.rating import adjust_low_rating

def irt_2pl(ability: float, discrimination: float, difficulty: float) -> float:
    return 1.0 / (1.0 + np.exp(-discrimination * (ability - difficulty)))

def neg_log_likelihood(params: tuple[float, float], responses: list[float], abilities: list[float]) -> float:
    discrimination, difficulty = params
    likelihood = 0.0
    for ability, response in zip(abilities, responses):
        probability = irt_2pl(ability, discrimination, difficulty)
        likelihood += np.log(probability) if response else np.log(1 - probability)
    return -likelihood

def estimate(abilities: list[float], responses: list[list[int]]) -> list[tuple[float, float]]:
    results = []
    mean = np.mean(abilities)
    stddev = np.std(abilities)
    scaled_abilities = (np.array(abilities) - mean) / stddev
    for problem_responses in responses:
        minimize_result = minimize(
            neg_log_likelihood,
            [np.log(6), 0.0],
            args=(problem_responses, scaled_abilities),
            method='Nelder-Mead'
        )
        if minimize_result.success:
            discrimination, difficulty = minimize_result.x
            results.append((float(discrimination), adjust_low_rating(float(difficulty * stddev + mean))))
        else:
            print(f"ERROR: {minimize_result.message}")
            results.append((float("nan"), float("nan")))
    return results
