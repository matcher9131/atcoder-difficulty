import numpy as np
import json

contest_name = "abc396"

filepath = "data/" + contest_name + ".json"
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
players = [player for player in json_data["StandingsData"]]
abilities = [player["OldRating"] for player in players]
responses = [
    [1 if problem in player["TaskResults"] and player["TaskResults"][problem]["SubmissionID"] else 0 for player in players] for problem in problems
]

discrimination = 1.7

def two_pl_model(ability, discrimination, difficulty):
    return 1.0 / (1.0 + np.exp(-discrimination * (ability - difficulty) / 400))

def sum_likelihood(abilities, responses, discrimination, difficulty):
    sum = 0.0
    for player_index, ability in enumerate(abilities):
        response = responses[player_index]
        probability = two_pl_model(ability, discrimination, difficulty)
        sum += np.log(probability) if response else np.log(1 - probability)
    return sum

def search_difficulty(abilities, responses, discrimination, epsilon = 1e-8):
    difficulties = []
    for problem_index in range(len(problems)):
        #
        print("problem_index = ", problem_index)
        #
        likelihood_memo = {}
        left = -1000.0
        right = 5000.0
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
        difficulties.append((left + right) / 2)
    return difficulties

difficulties = search_difficulty(abilities, responses, discrimination)
print(difficulties)
