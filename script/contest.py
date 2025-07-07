from bs4 import BeautifulSoup # type: ignore
from datetime import datetime
from itertools import chain, combinations
import re
import requests # type: ignore

from contest_json import ContestJson
from contest_stats import ContestStats


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


def get_contest_stats(contest_id: str, contest_json: ContestJson) -> ContestStats:
    response = requests.get(f"https://atcoder.jp/contests/{contest_id}?lang=en")
    if response.status_code != 200:
        response.raise_for_status()
    
    soup = BeautifulSoup(response.text, "html.parser")
    
    time_node = soup.select_one(".contest-duration time")
    if time_node is None:
        raise ValueError("[get_contest_stats]: No match results for date regex.")
    # Somehow get different html than when accessing the page with browsers; Be cautious of the date format.
    date = datetime.strptime(time_node.text, "%Y-%m-%d %H:%M:%S%z")

    rating_regex = re.compile(r"Rated Range: (?P<min>\d+)?\s*-\s*(?P<max>\d+)?")
    rating_regex_text_node = soup.find(string=rating_regex)
    if rating_regex_text_node is None:
        raise ValueError("[get_contest_stats]: No match results for rating regex.")
    rating_regex_result = re.search(rating_regex, rating_regex_text_node.text)
    if rating_regex_result is None:
        raise ValueError("[get_contest_stats]: No match results for rating regex.")
    
    max_rating = int(rating_regex_result.group("max")) if rating_regex_result.group("max") is not None else "inf"

    scores_table = next(
        (table for table in soup.select("table") if table.find("th", string="Score") is not None), 
        None
    )
    if scores_table is None:
        raise ValueError("[get_contest_stats]: Point values table is not found.")
    scores = [int(td.get_text()) for td in scores_table.select("tbody tr td:nth-child(2)")]

    sum_scores = sorted(set([
        sum(subset)
        for subset in chain.from_iterable(
            combinations(scores, r) for r in range(len(scores) + 1)
        )
    ]))

    player_performances = contest_json.create_player_performances(contest_id)

    stats_by_score = [
        (sum_score, contest_json.get_contest_stats_by_score(player_performances, sum_score))
        for sum_score in sum_scores
    ]

    target_performances = (
        [2400, 2800, 3200, 3600, 4000] if max_rating == "inf"         # AGC
        else [400, 800, 1200, 1600, 2000, 2400] if max_rating < 2000  # ABC
        else [1600, 2000, 2400, 2800, 3200]                           # ARC
    )
    stats_by_performance = [
        (performance, contest_json.get_contest_stats_by_performance(player_performances, performance))
        for performance in target_performances
    ]

    return {
        "d": date,
        "m": max_rating,
        "s": scores,
        "ss": stats_by_score,
        "sp": stats_by_performance
    }
