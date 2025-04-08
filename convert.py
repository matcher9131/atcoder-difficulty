import os
import glob
from json_io import load_json, save_json
from numpy import sqrt, log

# player["Competitions"]がその時点での参加回数ではなくデータ取得時点での参加回数になってしまうため使えない
def get_true_rating(rating: float, num_competitions: int) -> float:
    if rating < 400:
       rating = 400 * (1 - log(400 / rating))
    adjustment = (sqrt(1.0 - 0.81 ** num_competitions) / (1.0 - 0.9 ** num_competitions) - 1.0) / (sqrt(19.0) - 1.0) * 1200.0
    return rating + adjustment

def contest_json_to_data(contest_json) -> tuple[list[float], list[list[float]]]:
    problems = [element["TaskScreenName"] for element in contest_json["TaskInfo"]]
    players = [player for player in contest_json["StandingsData"] if player["Competitions"] > 0 and player["OldRating"] > 0 and player["TotalResult"]["Count"] > 0]
    # abilities = [get_true_rating(player["OldRating"], player["Competitions"]) for player in players]
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
