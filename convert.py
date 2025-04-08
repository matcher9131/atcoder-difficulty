import os
import glob
from json_io import load_json, save_json
from numpy import sqrt, isnan

def get_rating_adjustment(num_competitions: int) -> float:
    r = (sqrt(1.0 - (0.9 ** (2 * num_competitions))) / (1.0 - 0.9 ** num_competitions) - 1.0) / (sqrt(19) - 1.0) * 1200.0
    if (isnan(r)):
        print(f"Invalid num_competitions = {num_competitions}")
        return 0
    return r

def contest_json_to_data(contest_json) -> tuple[list[float], list[list[float]]]:
    problems = [element["TaskScreenName"] for element in contest_json["TaskInfo"]]
    players = [player for player in contest_json["StandingsData"] if player["Competitions"] > 0 and player["OldRating"] > 0 and player["TotalResult"]["Count"] > 0]
    abilities = [player["OldRating"] + get_rating_adjustment(player["Competitions"]) for player in players]
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
