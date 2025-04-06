import os
import glob
import json
import numpy as np

contest_name = "abc400"

def two_pl_model(ability, discrimination, difficulty):
    return 1.0 / (1.0 + np.exp(-discrimination * (ability - difficulty)))

def search_difficulty(abilities, responses):
    discrimination = np.log(6) / 400.0
    difficulties = []
    for problem_index in range(len(responses)):
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

def get_difficulty(contest_json_data):
    problems = [element["TaskScreenName"] for element in contest_json_data["TaskInfo"]]
    players = [player for player in contest_json_data["StandingsData"] if player["OldRating"] != 0]
    abilities = [player["OldRating"] for player in players]
    responses = [
        [1 if problem in player["TaskResults"] and player["TaskResults"][problem]["SubmissionID"] > 0 else 0 for player in players] for problem in problems
    ]
    return search_difficulty(abilities, responses)


output_filepath = "output/difficulties.json"
with open(output_filepath, "r", encoding="utf-8") as output_file:
    difficulties_json_data = json.load(output_file)

files = glob.glob("./data/*.json")
for filepath in files:
    contest_name = os.path.splitext(os.path.basename(filepath))[0]
    if not contest_name in difficulties_json_data:
        with open(filepath, "r", encoding="utf-8") as json_file:
            json_data = json.load(json_file)
        difficulties = get_difficulty(json_data)
        difficulties_json_data[contest_name] = difficulties

with open(output_filepath, "w", encoding="utf-8") as output_file:
    output_file.write(json.dumps(difficulties_json_data, indent=4))
            
