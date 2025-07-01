from bisect import bisect_left
from bs4 import BeautifulSoup # type: ignore
from itertools import chain, combinations
import os
import re
import requests # type: ignore

from contest_types import ContestJson, ContestStatsItemByPerformance, ContestStatsItemByScore
from performance import PlayerPerformance
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


def _find_last_player(contest_json: ContestJson, score: int) -> int:
    """Find the last player with the score given and return the index of the player"""

    return bisect_left([
        (-player["TotalResult"]["Score"], player["TotalResult"]["Elapsed"]) for player in contest_json["StandingsData"]
    ], (-score + 1, 0)) - 1


def _get_contest_stats_by_score(contest_json: ContestJson, player_performance: PlayerPerformance, score: int) -> ContestStatsItemByScore | None:
    index = _find_last_player(contest_json, score)
    while True:
        if index < 0:
            return None
        if contest_json["StandingsData"][index]["TotalResult"]["Score"] != score:
            # No rated player who gets the score given
            return None
        performance = player_performance[index]
        if performance is not None:
            return {
                "r": contest_json["StandingsData"][index]["Rank"],
                "p": performance
            }
        index -= 1


def _get_contest_stats_by_performance(contest_json: ContestJson, performances: PlayerPerformance, target_performance: int) -> ContestStatsItemByPerformance | None:
    index = performances.find(target_performance)
    return {
        "r": contest_json["StandingsData"][index]["Rank"],
        "s": contest_json["StandingsData"][index]["TotalResult"]["Score"],
        "t": contest_json["StandingsData"][index]["TotalResult"]["Elapsed"] // int(1e9),
    } if index is not None else None


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

    player_performances = PlayerPerformance(contest_id, [player["UserScreenName"] for player in contest_json["StandingsData"]])

    soup = BeautifulSoup(html, "html.parser")
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

    stats_by_score = [
        (sum_score, _get_contest_stats_by_score(contest_json, player_performances, sum_score))
        for sum_score in sum_scores
    ]

    # TODO: Change target performances by contest types
    target_performances = [400, 800, 1200, 1600, 2000, 2400, 2800]
    stats_by_performance = [
        (performance, _get_contest_stats_by_performance(contest_json, player_performances, performance))
        for performance in target_performances
    ]

    return {
        "m": max_rating,
        "s": scores,
        "ss": stats_by_score,
        "sp": stats_by_performance
    }


def get_abilities_and_responses(
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
