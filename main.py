import json
import numpy as np
from scipy.optimize import minimize


contest_name = "abc396"

filepath = f"data/{contest_name}.json"
with open(filepath, "r", encoding="utf-8") as json_file:
    json_data = json.load(json_file)

# type JsonData = {
#     TaskInfo: Array<{ TaskScreenName: `${ContestName}_${ProblemIndex}`}>
#     StandingsData: Array<
#         OldRating: integer
#         TaskResults: {
#             `${ContestName}_${ProblemIndex}`: {
#                 SubmissionID: integer    // more than 0 for AC submission, 0 for otherwise
#             }
#         }
#     >
# }

problems = list(map(lambda element: element["TaskScreenName"], json_data["TaskInfo"]))
players = [player for player in json_data["StandingsData"] if player["OldRating"] != 0]
abilities = [player["OldRating"] for player in players]
responses = [
    [1 if problem in player["TaskResults"] and player["TaskResults"][problem]["SubmissionID"] > 0 else 0 for player in players] for problem in problems
]

def two_pl_model(ability, discrimination, difficulty):
    return 1.0 / (1.0 + np.exp(-discrimination * (ability - difficulty) / 400.0))

def sum_likelihood(abilities, responses, discrimination, difficulty):
    sum = 0.0
    for player_index, ability in enumerate(abilities):
        response = responses[player_index]
        probability = two_pl_model(ability, discrimination, difficulty)
        sum += np.log(probability) if response else np.log(1 - probability)
    return sum

def search_difficulty1(abilities, responses):
    discrimination = np.log(6)
    difficulties = []
    for problem_index in range(len(problems)):
        num_acs = sum(responses[problem_index])
        left = -1000
        right = 5000
        while right - left > 1:
            mid = (left + right) // 2
            expected_num_acs = 0
            for ability in abilities:
                expected_num_acs += two_pl_model(ability, discrimination, mid)
            if expected_num_acs < num_acs:
                right = mid
            else:
                left = mid
        difficulties.append(left)
    return difficulties

def search_difficulty2(abilities, responses, epsilon = 1e-8):
    discrimination = np.log(6)
    difficulties = []
    for problem_index in range(len(problems)):
        likelihood_memo = {}
        left = -1000
        right = 5000
        while True:
            c1 = (2 * left + right) / 3
            c2 = (left + 2 * right) / 3
            fc1 = likelihood_memo[c1] if c1 in likelihood_memo else sum_likelihood(abilities, responses[problem_index], discrimination, c1)
            likelihood_memo[c1] = fc1
            fc2 = likelihood_memo[c2] if c2 in likelihood_memo else sum_likelihood(abilities, responses[problem_index], discrimination, c2)
            likelihood_memo[c2] = fc2
            if fc1 < fc2:
                left = c1
            else:
                right = c2
            if (abs(fc1 - fc2) < epsilon):
                break
        difficulties.append(round((left + right) / 2))
    return difficulties



def search_difficulty3(abilities, responses):
    def two_pl_model2(scaled_ability, discrimination, scaled_difficulty):
        return 1.0 / (1.0 + np.exp(-discrimination * (scaled_ability - scaled_difficulty)))
    def likelihood(params, responses, abilities):
        discrimination, scaled_difficulty = params
        sum_likelihood = 0
        for response, scaled_ability in zip(responses, abilities):
            probability = two_pl_model2(scaled_ability, discrimination, scaled_difficulty)
            sum_likelihood += np.log(probability) if response else np.log(1 - probability)
        return -sum_likelihood

    _abilities = np.array(abilities)
    mean = np.mean(_abilities)
    std = np.std(_abilities)
    scaled_abilities = (_abilities - mean) / std
    difficulties = []
    for problem_index in range(len(problems)):
        result = minimize(
            likelihood,
            [1.0, 0.0],
            args=(responses[problem_index], scaled_abilities),
            method="L-BFGS-B"
        )

        if result.success:
            _, scaled_difficulty = result.x
            difficulties.append(int(scaled_difficulty * std + mean))
        else:
            difficulties.append("ERROR")
            print(result.message)
    return difficulties

print(search_difficulty1(abilities, responses))
# print(search_difficulty2(abilities, responses))
# print(search_difficulty3(abilities, responses))