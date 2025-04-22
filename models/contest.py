from typing import TypedDict
from models.player import Player
from util.json_io import load_json

class Contest(TypedDict):
    name: str
    problems: list[str]
    players: list[Player]

def load_contest(contest_name: str) -> Contest:
    contest_json = load_json(f"input/contests/{contest_name}.json")
    problems: list[str] = [element["TaskScreenName"] for element in contest_json["TaskInfo"]]
    players: list[Player] = [
        {
            "name": player["UserScreenName"],
            "rating": player["OldRating"],
            "numContests": player["Competitions"],
            "isRated": player["IsRated"],
            "responses": [1 if problem in player["TaskResults"] and player["TaskResults"][problem]["SubmissionID"] > 0 else 0 for problem in problems] 
        } for player in contest_json["StandingsData"] if player["TotalResult"]["Count"] > 0
    ]
    return { "name": contest_name, "problems": problems, "players": players }
