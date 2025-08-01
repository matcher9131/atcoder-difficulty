from datetime import datetime
from typing import Literal, TypedDict

from util.json_io import load_json, save_json


class ContestStatsItemByScore(TypedDict):
    # Rank
    r: int
    # Perfermance
    p: int


class ContestStatsItemByPerformance(TypedDict):
    # Rank
    r: int
    # Score
    s: int
    # Time
    t: int


class ContestSummary(TypedDict):
    # Date
    d: datetime
    # Max rating
    m: int | Literal["inf"]


class ContestStats(TypedDict):
    # Problem scores
    s: list[int]
    # Frequency distribution of rated players' rating ([0]: zero index bits compressed by base64, [1]: distribution of uint16[] compressed by base64)
    fr: tuple[str, str]
    # Frequency distribution of unrated players' rating ([0]: zero index bits compressed by base64, [1]: distribution of uint16[] compressed by base64)
    fu: tuple[str, str]
    # Stats by score
    ss: list[tuple[int, ContestStatsItemByScore]]
    # Stats by performance
    sp: list[tuple[int, ContestStatsItemByPerformance]]


# class ContestStatsFull(ContestSummary, ContestStats):
#     pass


class ContestJson(TypedDict):
    body: dict[str, ContestSummary]
    lastOfChunks: list[str]


items_per_chunk = 250
contest_json_path = "../src/assets/contest.json"
contest_stats_dir = "../src/assets/contest_stats"
def load_all_contest_stats() -> dict[str, ContestStats]:
    contest_json: ContestJson = load_json(contest_json_path)
    num_chunks = len(contest_json["lastOfChunks"]) + 1
    result: dict[str, ContestStats] = {}
    for i in range(num_chunks):
        stats_json: dict[str, ContestStats] = load_json(f"{contest_stats_dir}/contest_stat{i}.json")
        result |= stats_json
    return result


def save_all_contest_stats(contest_stats: dict[str, ContestStats], contest_summaries: dict[str, ContestSummary]):
    key_value_pairs = sorted([(contest_id, stats) for contest_id, stats in contest_stats.items()], key=lambda t: contest_summaries[t[0]]["d"])
    for i in range(0, len(key_value_pairs), 250):
        obj = { contest_id: stats for contest_id, stats in key_value_pairs[i:i+items_per_chunk] }
        save_json(obj, f"{contest_stats_dir}/contest_stat{i}.json")


def load_contest_summaries() -> dict[str, ContestSummary]:
    contest_json: ContestJson = load_json(contest_json_path)
    return contest_json["body"]


def save_contest_summaries(summaries: dict[str, ContestSummary]):
    key_value_pairs = sorted([(contest_id, summary) for contest_id, summary in summaries.items()], key=lambda t: t[1]["d"])
    last_of_chunks: list[str] = []
    for i in range(items_per_chunk - 1, len(key_value_pairs), items_per_chunk):
        last_of_chunks.append(key_value_pairs[i][0])
    json: ContestJson = {
        "body": summaries,
        "lastOfChunks": last_of_chunks
    }
    save_json(json, contest_json_path)