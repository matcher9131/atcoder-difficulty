from bs4 import BeautifulSoup # type: ignore
import os
import re
import requests # type: ignore
from typing import Any, Literal, TypedDict

from contest_types import ContestJson
from util.rating import get_raw_rating


def get_new_contest_ids(existing_ids: list[str]) -> list[str]:
    """Access contest archive page and get new contest ids"""

    response = requests.get("https://atcoder.jp/contests/archive")
    soup = BeautifulSoup(response.text, "html.parser")

    result: list[str] = []
    for tr in soup.select("tbody tr"):
        if tr.select_one("span[title='Algorithm']") is None:
            continue
        anchor = tr.select_one("td:nth-of-type(2) a")
        if anchor is None:
            continue
        rated_cell = tr.select_one("td:nth-of-type(4)")
        if rated_cell is None or rated_cell.get_text() == "-":
            continue

        href = str(anchor["href"])
        contest_id = href[(href.rfind("/") + 1):]
        if contest_id in existing_ids:
            continue

        result.append(contest_id)

    return result


def get_contest_json(contest_id: str) -> ContestJson:
    """Access standings page of contest and get the JSON of standings data"""

    session = os.getenv("REVEL_SESSION")
    if session is None:
        raise ValueError("Session is none.")
    
    url = f"https://atcoder.jp/contests/{contest_id}/standings/json"
    response = requests.get(url=url, cookies={ "REVEL_SESSION": session })
    if response.status_code != 200:
        response.raise_for_status()
    if "application/json" not in response.headers.get("Content-Type", ""):
        raise TypeError("Response is not a json.")
    
    return response.json()


def get_contest_stats(contest_id: str, contest_json: ContestJson):
    response = requests.get(f"https://atcoder.jp/contests/{contest_id}?lang=en")
    if response.status_code != 200:
        response.raise_for_status()
    
    html = response.text
    
    rating_regex = re.compile(r"Rated Range: (?P<min>\d+)?\s*-\s*(?P<max>\d+)?")
    rating_regex_result = re.search(rating_regex, html)
    if rating_regex_result is None:
        raise ValueError("[get_contest_stats]: No match results for rating regex.")
    
    max_rating = int(rating_regex_result.group("max")) if rating_regex_result.group("max") is not None else "inf"

    soup = BeautifulSoup(html, "html.parser")
    th = soup.find("th", string="Score")
    if th is None:
        raise ValueError("[get_contest_stats]: Point values table is not found.")
    scores_table = th.find_parent("table")
    if scores_table is None:
        raise ValueError("[get_contest_stats]: Point values table is not found.")
    scores = [int(td.get_text()) for td in scores_table.select("tbody tr td:nth-child(2)")]

    # TODO: Enumerate all the possible scores
    # TODO: Find the last user to reach the score, and access the user's page and get performance value

    raise NotImplementedError()


def get_abilities_and_responses(
    contest_id: str, 
    contest_json: ContestJson, 
    easy_problem_indices: list[int]
) -> tuple[list[float], list[list[int]], list[bool]]:
    inner_problem_ids = [element["TaskScreenName"] for element in contest_json["TaskInfo"]]
    players = [
        {
            "rating": player["OldRating"],
            "numContests": player["Competitions"],
            "isRated": player["IsRated"],
            "responses": [
                -1 if inner_problem_id not in player["TaskResults"]
                else 1 if player["TaskResults"][inner_problem_id]["SubmissionID"] > 0
                else 0
                for inner_problem_id in inner_problem_ids
            ]
        } for player in contest_json["StandingsData"] if player["TotalResult"]["Count"] > 0
    ]
    if not players:
        raise ValueError("No players.")
    
    abilities: list[float] = []
    responses: list[list[int]] = [[] for _ in range(len(contest_json["TaskInfo"]))]
    is_target_of_easy_problems: list[bool] = []
    for player in players:
        if player["rating"] <= 0:
            continue
        # "numContests" includes this contest, so rated player's value must be reduced by 1.
        num_contests = player["numContests"] - (1 if player["isRated"] else 0)
        if num_contests <= 0:
            # Ignore newbies because their raw rating are all 1200 regardless their skills.
            # (and "num_contests" can be -1 for rated and deleted players)
            continue
        abilities.append(get_raw_rating(player["rating"], num_contests))
        for problem_index in range(len(contest_json["TaskInfo"])):
            responses[problem_index].append(player["responses"][problem_index])
        # Exclude players who have no submissions to easy problems in estimating difficulties of easy problems
        is_target_of_easy_problems.append(any(
            [player["responses"][easy_problem_index] != -1 for easy_problem_index in easy_problem_indices]
        ))
    return abilities, responses, is_target_of_easy_problems
