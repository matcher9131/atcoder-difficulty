from scipy.optimize import minimize
from json_io import get_data
import numpy as np

def irt_2pl(ability, discrimination, difficulty):
    return 1.0 / (1.0 + np.exp(-discrimination * (ability - difficulty)))

def neg_log_likelihood(params, responses, abilities):
    discrimination, difficulty = params
    likelihood = 0.0
    for ability, response in zip(abilities, responses):
        probability = irt_2pl(ability, discrimination, difficulty)
        likelihood += np.log(probability) if response else np.log(1 - probability)
    return -likelihood

def estimate(abilities, responses):
    results = []
    mean = np.mean(abilities)
    stddev = np.std(abilities)
    scaled_abilities = (abilities - mean) / stddev
    for problem_responses in responses:
        minimize_result = minimize(
            neg_log_likelihood,
            [np.log(6), 0.0],
            args=(problem_responses, scaled_abilities),
            method='Nelder-Mead'
        )
        if minimize_result.success:
            discrimination, difficulty = minimize_result.x
            results.append([float(discrimination), float(difficulty * stddev + mean)])
        else:
            results.append([f"ERROR: {minimize_result.message}"])
    return results

contest_name = "abc396"
abilities, responses = get_data(contest_name)
print(estimate(abilities, responses))