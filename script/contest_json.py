from bisect import bisect_left
import os
import requests # type: ignore
from typing import TypedDict

from contest_stats import ContestStatsItemByPerformance, ContestStatsItemByScore
from performance import PlayerPerformance
from performance_db import PlayerPerformancesDB
from util.rating import get_raw_rating


# Set this before run script
uses_db = False


class _TaskInfoItem(TypedDict):
    TaskName: str
    TaskScreenName: str


class _TaskResult(TypedDict):
    SubmissionID: int


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
    def __init__(self, json: ContestJson_Inner) -> None:
        self._json = json


    @staticmethod
    def from_contest_id(id: str) -> "ContestJson":
        """Access standings page of contest and get the JSON of standings data"""

        session = os.getenv("REVEL_SESSION")
        if session is None:
            raise ValueError("Session is none.")
        
        url = f"https://atcoder.jp/contests/{id}/standings/json"
        response = requests.get(url=url, cookies={ "REVEL_SESSION": session })
        if response.status_code != 200:
            response.raise_for_status()
        if "application/json" not in response.headers.get("Content-Type", ""):
            raise TypeError("Response is not a json.")
        
        return ContestJson(response.json())


    def get_id_and_name_of_problems(self, contest_id: str) -> list[tuple[str, str]]:
        return [
            (f"{contest_id}/{task_info_item['TaskScreenName']}", task_info_item["TaskName"])
            for task_info_item in self._json["TaskInfo"]
        ]


    def create_player_performances(self, contest_id: str) -> PlayerPerformance:
        return PlayerPerformance(contest_id, [player["UserScreenName"] for player in self._json["StandingsData"]], PlayerPerformancesDB() if uses_db else None)

    
    def _get_score(self, index: int) -> int:
        return self._json["StandingsData"][index]["TotalResult"]["Score"]
    

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
                (-player["TotalResult"]["Score"], player["TotalResult"]["Elapsed"])
                for player in self._json["StandingsData"]
            ],
            (-score, time)
        )
    

    def get_contest_stats_by_score(self, performances: PlayerPerformance, score: int) -> ContestStatsItemByScore | None:
        index = self._find_player_by_score_and_time(score, int(1e16))
        if index >= len(self._json["StandingsData"]):
            return None
        while True:
            # Decrement index and find rated player with the score given
            if index < 0 or self._get_score(index) != score:
                # No rated player who gets the exact score
                return None
            performance = performances[index]
            if performance is not None:
                return {
                    "r": self._get_rank(index),
                    "p": performance
                }
            index -= 1
    

    def get_contest_stats_by_performance(self, performances: PlayerPerformance, target_performance: int) -> ContestStatsItemByPerformance | None:
        index = performances.find(target_performance)
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
            
            smaller_index_performance = performances[smaller_index]
            larger_index_performance = performances[larger_index]
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
    
    
    def get_abilities_and_responses(self, easy_problem_indices: list[int]) -> tuple[list[float], list[list[int]], list[bool]]:
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
