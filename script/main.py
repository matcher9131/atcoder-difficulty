from bs4 import BeautifulSoup # type: ignore
from datetime import datetime
import os
import re
import requests # type: ignore

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


contests_json_path = "../src/assets/contests.json"

def run():
    contests_json: list[tuple[str, int | str]] = load_json(contests_json_path)
    existing_ids = [id for id, _ in contests_json]

    new_contests = get_new_contests(existing_ids)
    if (len(new_contests) == 0):
        return
    save_json(new_contests + contests_json, contests_json_path) 


    session = os.getenv("REVEL_SESSION")


if __name__ == "__main__":
    run()
