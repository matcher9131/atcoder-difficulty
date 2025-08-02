from base64 import b64encode
from bisect import bisect_left
from bitarray import bitarray
from bitarray.util import ba2base
from bs4 import BeautifulSoup # type: ignore
from datetime import datetime
from itertools import chain, combinations
from math import ceil
import numpy as np
from numpy.typing import NDArray
import os
import re
import requests
from time import sleep
from typing import Literal, TypedDict, cast

from contest_stats import ContestStats, ContestStatsItemByPerformance, ContestStatsItemByScore, ContestSummary
from performance import PlayerPerformance
from performance_db import PlayerPerformancesDB
from util.parsing import parse_start_or_raise
from util.rating import get_raw_rating
from util.requests_extension import get_with_retry


# Set this before run script
uses_db = True


class _TaskInfoItem(TypedDict):
    TaskName: str
    TaskScreenName: str


class _TaskResult(TypedDict):
    SubmissionID: int
    Score: int


class _PlayerResult(TypedDict):
    Count: int
    Score: int
    Elapsed: int


class _Player(TypedDict):
    Rank: int
    UserScreenName: str
    OldRating: int
    IsRated: bool
    Competitions: int
    TaskResults: dict[str, _TaskResult]
    TotalResult: _PlayerResult


class ContestJson_Inner(TypedDict):
    TaskInfo: list[_TaskInfoItem]
    StandingsData: list[_Player]


class ContestJson:
    def __init__(self, id: str, json: ContestJson_Inner) -> None:
        self._id = id
        self._json = json
        # Members for cache
        self._player_performances = PlayerPerformance(
            self._id,
            [player["UserScreenName"] for player in self._json["StandingsData"]],
            PlayerPerformancesDB() if uses_db else None
        )
        self._properties_cache = cast(tuple[datetime, int | Literal["inf"], list[int]] | None, None)


    @staticmethod
    def from_contest_id(id: str) -> "ContestJson":
        """Access standings page of contest and get the JSON of standings data"""

        session = os.getenv("REVEL_SESSION")
        if session is None:
            raise ValueError("Session is none.")
        
        url = f"https://atcoder.jp/contests/{id}/standings/json"
        response = get_with_retry(url=url, cookies={ "REVEL_SESSION": session })
        sleep(1)
        if response.status_code != 200:
            response.raise_for_status()
        if "application/json" not in response.headers.get("Content-Type", ""):
            raise TypeError("Response is not a json.")
        
        return ContestJson(id, response.json())


    def _get_properties(self) -> tuple[datetime, int | Literal["inf"], list[int]]:
        if self._properties_cache is not None:
            return self._properties_cache
        
        response = get_with_retry(f"https://atcoder.jp/contests/{self._id}?lang=en")
        sleep(1)
        if response.status_code != 200:
            response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        time_node = soup.select_one(".contest-duration time")
        if time_node is None:
            raise ValueError("[get_contest_stats]: No match results for date regex.")
        # Somehow get different html than when accessing the page with browsers; Be cautious of the date format.
        date = datetime.strptime(time_node.text, "%Y-%m-%d %H:%M:%S%z")

        rating_all_text_node = soup.find(string="Rated Range: All")
        if rating_all_text_node is not None:
            max_rating = "inf"
        else:
            rating_regex = re.compile(r"Rated Range: (?P<min>\d+)?\s*-\s*(?P<max>\d+)?")
            rating_regex_text_node = soup.find(string=rating_regex)
            if rating_regex_text_node is None:
                raise ValueError("[get_contest_stats]: No match results for rating regex.")
            rating_regex_result = re.search(rating_regex, rating_regex_text_node.text)
            if rating_regex_result is None:
                raise ValueError("[get_contest_stats]: No match results for rating regex.")
            max_rating = int(rating_regex_result.group("max")) if rating_regex_result.group("max") is not None else "inf"

        scores: list[int] = []
        scores_table = next(
            (table for table in soup.select("table") if table.find("th", string="Score") is not None), 
            None
        )
        if scores_table is not None:
            try:
                scores = [parse_start_or_raise(td.get_text()) for td in scores_table.select("tbody tr td:nth-child(2)")]
            except ValueError:
                scores = []
        if not scores:
            # No valid score table on the page, so try to get problem scores by json
            problem_ids = [task_info_item["TaskScreenName"] for task_info_item in self._json["TaskInfo"]]
            scores = [0] * len(problem_ids)
            for i, problem_id in enumerate(problem_ids):
                for player in self._json["StandingsData"]:
                    if problem_id in player["TaskResults"]:
                        score = player["TaskResults"][problem_id]["Score"] // 100
                        if score > 0:
                            scores[i] = score
                            break
            if (any(score <= 0 for score in scores)):
                raise ValueError("[get_contest_stats]: Cannot get problem scores.")

        # Store cache
        self._properties_cache = (date, max_rating, scores)
        return self._properties_cache


    def get_easy_problem_indices(self) -> list[int]:
        _, max_rating, _ = self._get_properties()
        return [0, 1] if max_rating != "inf" and max_rating < 2000 else []


    def get_abilities_and_responses(self) -> tuple[list[float], list[list[int]], list[bool]]:
        inner_problem_ids = [element["TaskScreenName"] for element in self._json["TaskInfo"]]
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
            } for player in self._json["StandingsData"] if player["TotalResult"]["Count"] > 0
        ]
        if not players:
            raise ValueError("No players.")
        
        (_, max_rating, _) = self._get_properties()
        easy_problem_indices = [0, 1] if max_rating != "inf" and max_rating < 2000 else []

        abilities: list[float] = []
        responses: list[list[int]] = [[] for _ in range(len(self._json["TaskInfo"]))]
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
            for problem_index in range(len(self._json["TaskInfo"])):
                responses[problem_index].append(player["responses"][problem_index])
            # Exclude players who have no submissions to easy problems in estimating difficulties of easy problems
            is_target_of_easy_problems.append(any(
                [player["responses"][easy_problem_index] != -1 for easy_problem_index in easy_problem_indices]
            ))
        
        return abilities, responses, is_target_of_easy_problems


    def get_id_and_name_of_problems(self) -> list[tuple[str, str]]:
        return [
            (f"{self._id}/{task_info_item['TaskScreenName']}", task_info_item["TaskName"])
            for task_info_item in self._json["TaskInfo"]
        ]


    def _get_frequency_distribution(self) -> tuple[tuple[str, str], tuple[str, str]]:
        def compress(distribution: NDArray[np.uint16]) -> tuple[str, str]:
            bytes_buffer = list(distribution.tobytes())
            zero_indices = bitarray(int(ceil(len(bytes_buffer) / 6) * 6))
            zero_indices.setall(0)
            compressed_bytes: list[int] = []
            for i, val in enumerate(bytes_buffer):
                if val == 0:
                    zero_indices[i] = 1
                else:
                    compressed_bytes.append(val)
            return ba2base(64, zero_indices), b64encode(np.array(compressed_bytes, dtype=np.uint8).tobytes()).decode(encoding="utf-8")

        rated_distribution = np.zeros(200, dtype=np.uint16)
        unrated_distribution = np.zeros(200, dtype=np.uint16)
        for player in self._json["StandingsData"]:
            (rated_distribution if player["IsRated"] else unrated_distribution)[player["OldRating"] // 25] += 1
        return compress(rated_distribution), compress(unrated_distribution)


    def _get_is_rated(self, index: int) -> bool:
        return self._json["StandingsData"][index]["IsRated"]

    
    def _get_score(self, index: int) -> int:
        return self._json["StandingsData"][index]["TotalResult"]["Score"] // 100
    

    def _get_time(self, index: int) -> int:
        return self._json["StandingsData"][index]["TotalResult"]["Elapsed"] // int(1e9)
    

    def _get_rank(self, index: int) -> int:
        return self._json["StandingsData"][index]["Rank"]
    

    def _get_average_rank(self, index: int) -> float:
        rank = self._get_rank(index)
        count = 1
        for i in range(index - 1, -1, -1):
            if self._get_rank(i) == rank:
                count += 1
            else:
                break
        for i in range(index + 1, len(self._json["StandingsData"])):
            if self._get_rank(i) == rank:
                count += 1
            else:
                break
        return rank + (count - 1) / 2
    
    
    def _find_player_by_score_and_time(self, score: int, time: int) -> int:
        """Find the last player with the score and time given by binary search and return the index"""
        return bisect_left(
            [
                (-self._get_score(i), self._get_time(i))
                for i in range(len(self._json["StandingsData"]))
            ],
            (-score, time)
        )


    def _get_contest_stats_by_score(self, score: int) -> ContestStatsItemByScore | None:
        start_index = self._find_player_by_score_and_time(score, int(1e16)) - 1
        for i in range(start_index, -1, -1):
            if self._get_score(i) != score:
                # No rated player who gets the exact score
                return None
            if not self._get_is_rated(i):
                # Skip this player because unrated player's performance is always 0
                continue
            performance = self._player_performances[i]
            if performance is not None:
                return {
                    "r": self._get_rank(i),
                    "p": performance
                }
        return None
    

    def _get_contest_stats_by_performance(self, target_performance: int) -> ContestStatsItemByPerformance | None:
        index = self._player_performances.find(target_performance)
        if index is None:
            return None
        elif isinstance(index, int):
            return {
                "r": self._get_rank(index),
                "s": self._get_score(index),
                "t": self._get_time(index),
            }
        else:
            smaller_index, larger_index = index
            smaller_index_score = self._get_score(smaller_index)
            larger_index_score = self._get_score(larger_index)
            
            smaller_index_performance = self._player_performances[smaller_index]
            larger_index_performance = self._player_performances[larger_index]
            if smaller_index_performance is None or larger_index_performance is None:
                raise ValueError("Performance is None")
            
            if smaller_index_score == larger_index_score:
                # Get estimated time by dividing actual times internally by raito of performances
                smaller_index_time = self._get_time(smaller_index)
                larger_index_time = self._get_time(larger_index)
                a = smaller_index_performance - target_performance
                b = target_performance - larger_index_performance
                time = int((b * smaller_index_time + a * larger_index_time) / (a + b))
                rank = self._get_rank(self._find_player_by_score_and_time(smaller_index_score, time))
                return {
                    "r": rank,
                    "s": smaller_index_score,
                    "t": time
                }
            else:
                # Get estimated rank by dividing average rank internally by performance
                smaller_index_average_rank = self._get_average_rank(smaller_index)
                larger_index_average_rank = self._get_average_rank(larger_index)
                a = smaller_index_performance - target_performance
                b = target_performance - larger_index_performance
                rank = int((b * smaller_index_average_rank + a * larger_index_average_rank) / (a + b))
                target_index = bisect_left([player["Rank"] for player in self._json["StandingsData"]], rank)
                return {
                    "r": self._get_rank(target_index),
                    "s": self._get_score(target_index),
                    "t": self._get_time(target_index)
                }
    

    def get_contest_summary(self) -> ContestSummary:
        (date, max_rating, _) = self._get_properties()
        return {
            "d": date,
            "m": max_rating
        }
    

    def get_contest_stats(self) -> ContestStats:
        (_, max_rating, scores) = self._get_properties()
        
        rated_distribution, unrated_distribution = self._get_frequency_distribution()
        if rated_distribution[1] == "":
            # No stats about performances because there are no rated players
            return {
                "s": scores,
                "fr": rated_distribution,
                "fu": unrated_distribution,
                "ss": [],
                "sp": []
            }

        sum_scores = sorted(set([
            sum(subset)
            for subset in chain.from_iterable(
                combinations(scores, r) for r in range(len(scores) + 1)
            )
        ]))
        stats_by_score = [
            (sum_score, score_stat)
            for sum_score in sum_scores
            if (score_stat := self._get_contest_stats_by_score(sum_score)) is not None
        ]

        target_performances = (
            [2400, 2800, 3200, 3600, 4000] if max_rating == "inf"         # AGC
            else [400, 800, 1200, 1600, 2000, 2400] if max_rating < 2000  # ABC
            else [1600, 2000, 2400, 2800, 3200]                           # ARC
        )
        stats_by_performance = [
            (performance, performance_stat)
            for performance in target_performances
            if (performance_stat := self._get_contest_stats_by_performance(performance)) is not None
        ]

        return {
            "s": scores,
            "fr": rated_distribution,
            "fu": unrated_distribution,
            "ss": stats_by_score,
            "sp": stats_by_performance
        }


def get_new_contest_ids(existing_ids: list[str]) -> list[str]:
    """Access contest archive page and get new contest ids"""

    response = requests.get("https://atcoder.jp/contests/archive")
    sleep(1)
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
