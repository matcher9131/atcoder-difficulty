from bs4 import BeautifulSoup # type: ignore
from datetime import datetime
import os
import re
import requests # type: ignore
import sys

from models.contest import Contest
from models.player import Player
from util.json_io import load_json, save_json


def get_new_contests(existing_ids: list[str]) -> list[tuple[str, int | str]]:
    rating_regex = re.compile(r"(?P<min>\d+)?\s*-\s*(?P<max>\d+)?")

    response = requests.get("https://atcoder.jp/contests/archive")
    soup = BeautifulSoup(response.text, "html.parser")

    contests: list[tuple[str, int | str]] = []
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
        if rating_regex_result is not None:
            max_rating = int(rating_regex_result.group("max"))

        contests.append((contest_id, max_rating or "inf"))

    return contests


def get_contest(contest_id: str) -> Contest:
    session = os.getenv("REVEL_SESSION")
    if session is None:
        raise ValueError("Session is none.")
    
    url = f"https://atcoder.jp/contests/{contest_id}/standings/json"
    response = requests.get(url=url, cookies={ "REVEL_SESSION": session })
    if response.status_code != 200:
        response.raise_for_status()
    if response.headers["Content-Type"] != "application/json":
        raise TypeError("Response is not a json.")
    
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


contests_json_path = "../src/assets/contests.json"

def run():
    contests_json: list[tuple[str, int | str]] = load_json(contests_json_path)
    existing_ids = [id for id, _ in contests_json]

    new_contests = get_new_contests(existing_ids)
    if len(new_contests) == 0:
        return
    

    for contest_id, max_rating in new_contests:
        try:
            contest = get_contest(contest_id)
            # 
        except Exception as e:
            print(f"Failed get contest {contest_id}, message: {str(e)}", file=sys.stderr)

    save_json(new_contests + contests_json, contests_json_path)


if __name__ == "__main__":
    run()
