from bs4 import BeautifulSoup
from datetime import datetime
import re
import requests

from models.contest_info import ContestInfo


def update_contest_info():
    rating_regex = re.compile(r"(?P<min>\d+)?\s*~\s*(?P<max>\d+)?")

    contest_info = ContestInfo()

    response = requests.get("https://atcoder.jp/contests/archive")
    soup = BeautifulSoup(response.text, "html.parser")

    for tr in soup.select("tbody tr"):
        if tr.select_one("span[data-original-title='algorithm']") is None:
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
        contest_id = href[:(href.rfind("/") + 1)]
        if contest_info.has_contest(contest_id):
            continue

        rating_regex_result = rating_regex.search(rated_cell.get_text())
        rating: dict[str, int | None] = {}
        if rating_regex_result is not None:
            rating_min = rating_regex_result.group("min")
            rating["min"] = int(rating_min) if rating_min is not None else None
            rating_max = rating_regex_result.group("max")
            rating["max"] = int(rating_max) if rating_min is not None else None
        
        contest_info.add_item(contest_id, {
            "date": datetime.strptime(time.get_text(), "%Y-%m-%d(%a) %H:%M"),
            "rating": None if rating_regex_result is None else rating
        })

    contest_info.save()
