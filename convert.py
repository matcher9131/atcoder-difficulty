import os
import glob
from json_io import load_json, save_json

def contest_json_to_data(contest_json) -> tuple[list[float], list[list[float]]]:
    problems = [element["TaskScreenName"] for element in contest_json["TaskInfo"]]
    players = [player for player in contest_json["StandingsData"] if player["OldRating"] != 0]
    abilities = [player["OldRating"] for player in players]
    responses = [
        [1 if problem in player["TaskResults"] and player["TaskResults"][problem]["SubmissionID"] > 0 else 0 for player in players] for problem in problems
    ]
    return abilities, responses

contest_files = glob.glob("input/*.json")

for contest_filepath in contest_files:
    contest_name = os.path.splitext(os.path.basename(contest_filepath))[0]
    data_filepath = f"data/{contest_name}.json"
    if not os.path.isfile(data_filepath):
        contest_json = load_json(contest_filepath)
        abilities, responses = contest_json_to_data(contest_json)
        save_json({ "abilities": abilities, "responses": responses }, data_filepath)
