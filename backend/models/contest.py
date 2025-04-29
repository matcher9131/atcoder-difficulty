from typing import TypedDict
from models.player import Player
from util.json_io import load_json

class Contest(TypedDict):
    name: str
    # ID, display name
    problems: dict[str, str]
    players: list[Player]

def load_contest(contest_name: str) -> Contest:
    contest_json = load_json(f"input/contests/{contest_name}.json")
    problems: dict[str, str] = { element["TaskScreenName"]: element["TaskName"] for element in contest_json["TaskInfo"] }
    players: list[Player] = [
        {
            "name": player["UserScreenName"],
            "rating": player["OldRating"],
            "numContests": player["Competitions"],
            "isRated": player["IsRated"],
            "responses": [
                -1 if problem not in player["TaskResults"]
                else 1 if player["TaskResults"][problem]["SubmissionID"] > 0
                else -1
                for problem in problems
            ]
        } for player in contest_json["StandingsData"] if player["TotalResult"]["Count"] > 0
    ]
    return { "name": contest_name, "problems": problems, "players": players }
