from typing import TypedDict
from models.player import Player
from util.json_io import load_json

class Contest(TypedDict):
    name: str
    # ID, display name
    problems: dict[str, str]
    players: list[Player]

def load_contest(contest_id: str) -> Contest:
    contest_json = load_json(f"input/contests/{contest_id}.json")
    problems: dict[str, str] = { f"{contest_id}/{element['TaskScreenName']}": element["TaskName"] for element in contest_json["TaskInfo"] }
    inner_problem_ids = [element["TaskScreenName"] for element in contest_json["TaskInfo"]]
    players: list[Player] = [
        {
            "name": player["UserScreenName"],
            "rating": player["OldRating"],
            "numContests": player["Competitions"],
            "isRated": player["IsRated"],
            "responses": [
                -1 if inner_problem_id not in player["TaskResults"]
                else 1 if player["TaskResults"][inner_problem_id]["SubmissionID"] > 0
                else -1
                for inner_problem_id in inner_problem_ids
            ]
        } for player in contest_json["StandingsData"] if player["TotalResult"]["Count"] > 0
    ]
    return { "name": contest_id, "problems": problems, "players": players }
