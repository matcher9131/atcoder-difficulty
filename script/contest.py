from bs4 import BeautifulSoup
import os
import re
import requests
from typing import Literal, TypedDict

from player import Player


class Contest(TypedDict):
    name: str
    # ID, display name
    problems: dict[str, str]
    players: list[Player]


def get_new_contests_info(existing_ids: list[str]) -> list[tuple[str, int | Literal["inf"]]]:
    rating_regex = re.compile(r"(?P<min>\d+)?\s*-\s*(?P<max>\d+)?")

    response = requests.get("https://atcoder.jp/contests/archive")
    soup = BeautifulSoup(response.text, "html.parser")

    result: list[tuple[str, int | Literal["inf"]]] = []
    for tr in soup.select("tbody tr"):
        if tr.select_one("span[title='Algorithm']") is None:
            continue
        time = tr.select_one("time")
        if time is None:
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

        rating_regex_result = rating_regex.search(rated_cell.get_text())
        max_rating: int | None = None
        if rating_regex_result is not None and rating_regex_result.group("max") is not None:
            max_rating = int(rating_regex_result.group("max"))

        result.append((contest_id, max_rating or "inf"))

    return result


def get_contest_info(contest_id: str) -> tuple[str, int | Literal["inf"]] | None:
    response = requests.get(f"https://atcoder.jp/contests/{contest_id}")
    if response.status_code != 200:
        return None
    
    soup = BeautifulSoup(response.text, "html.parser")
    rating_regex = re.compile(r"(?P<min>\d+)?\s*-\s*(?P<max>\d+)?")
    rating_regex_result = next((re.search(rating_regex, span.get_text()) for span in soup.select("span") if re.match(rating_regex, span.get_text())), None)
    if rating_regex_result is None:
        return None
    
    max_rating = int(rating_regex_result.group("max")) if rating_regex_result.group("max") is not None else "inf"
    return (contest_id, max_rating)
    

def get_contest(contest_id: str) -> Contest:
    session = os.getenv("REVEL_SESSION")
    if session is None:
        raise ValueError("Session is none.")
    
    url = f"https://atcoder.jp/contests/{contest_id}/standings/json"
    response = requests.get(url=url, cookies={ "REVEL_SESSION": session })
    if response.status_code != 200:
        response.raise_for_status()
    # if response.headers["Content-Type"] != "application/json":
    #    raise TypeError("Response is not a json.")
    
    json = response.json()
    problems: dict[str, str] = { f"{contest_id}/{element['TaskScreenName']}": element["TaskName"] for element in json["TaskInfo"] }
    inner_problem_ids = [element["TaskScreenName"] for element in json["TaskInfo"]]
    players: list[Player] = [
        {
            "name": player["UserScreenName"],
            "rating": player["OldRating"],
            "numContests": player["Competitions"],
            "isRated": player["IsRated"],
            "responses": [
                -1 if inner_problem_id not in player["TaskResults"]
                else 1 if player["TaskResults"][inner_problem_id]["SubmissionID"] > 0
                else 0
                for inner_problem_id in inner_problem_ids
            ]
        } for player in json["StandingsData"] if player["TotalResult"]["Count"] > 0
    ]

    return { "name": contest_id, "problems": problems, "players": players }