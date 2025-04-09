from typing import TypedDict
from player import Player
from json_io import load_json
from util import get_raw_rating

class Contest(TypedDict):
    problems: list[str]
    players: list[Player]

def load_contest(contest_name: str) -> Contest:
    contest_json = load_json(f"input/{contest_name}.json")
    problems: list[str] = [element["TaskScreenName"] for element in contest_json["TaskInfo"]]
    players: list[Player] = [
        {
            "rating": get_raw_rating(player["OldRating"], player["Competitions"]),
            "isRated": player["IsRated"],
            "responses": [1 if problem in player["TaskResults"] and player["TaskResults"][problem]["SubmissionID"] > 0 else 0 for problem in problems] 
        } for player in contest_json["StandingsData"] if player["Competitions"] > 0 and player["OldRating"] > 0 and player["TotalResult"]["Count"] > 0
    ]
    return { "problems": problems, "players": players }

def get_abilities_and_responses(contest: Contest, excludes_unrated: bool = False) -> tuple[list[float], list[list[int]]]:
    abilities: list[float] = []
    responses: list[list[int]] = [[] for _ in contest["problems"]]
    for player in contest["players"]:
        if player["isRated"] or not excludes_unrated:
            abilities.append(player["rating"])
            for problem_index, response in enumerate(player["responses"]):
                responses[problem_index].append(response)
    return abilities, responses
