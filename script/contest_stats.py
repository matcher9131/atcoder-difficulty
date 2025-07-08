from datetime import datetime
from typing import Literal, TypedDict

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


class ContestStats(TypedDict):
    # Date
    d: datetime
    # Max rating
    m: int | Literal["inf"]
    # Problem scores
    s: list[int]
    # Frequency distribution of rated players' rating ([0]: rating begin, [1]: distribution of uint16[] compressed by base64)
    fr: tuple[int, str]
    # Frequency distribution of unrated players' rating ([0]: rating begin, [1]: distribution of uint16[] compressed by base64)
    fu: tuple[int, str]
    # Stats by score
    ss: list[tuple[int, ContestStatsItemByScore | None]]
    # Stats by performance
    sp: list[tuple[int, ContestStatsItemByPerformance | None]]
