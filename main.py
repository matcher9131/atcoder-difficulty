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
abilities = np.array([player["OldRating"] for player in json_data["StandingsData"]])
responses = np.zeros((len(abilities), len(problems)))
for player_index, player in enumerate(json_data["StandingsData"]):
    for problem_index, problem in enumerate(problems):
        if problem in player["TaskResults"] and player["TaskResults"][problem]["SubmissionID"] > 0:
            responses[player_index][problem_index] = 1

discrimination = 1.5

def two_pl_model(ability, discrimination, difficulty):
    return 1.0 / (1.0 + np.exp(-discrimination * (ability - difficulty) / 400))

def search_difficulty(abilities, responses, discrimination, max_iterations = 1000):
    difficulties = []
    for problem_index in range(len(responses[0])):
        left = -1000
        right = 5000
        while right - left > 1:
            mid = (left + right) // 2
            sum_likelihood = 0.0
            for player_index, ability in enumerate(abilities):
                response = responses[player_index][problem_index]
                probability = two_pl_model(ability, discrimination, mid)
                sum_likelihood += response * np.log(probability) + (1 - response) * np.log(1 - probability)
            # sum_likelihoodと0の比較ではなくsum_likelihoodの極大値を探したい
            # 三分探索ならいけるかも？
            if sum_likelihood > 0.0:
                right = mid
            else:
                left = mid
        difficulties.append(mid)
    return difficulties

difficulties = search_difficulty(abilities, responses, discrimination)
print(difficulties)
