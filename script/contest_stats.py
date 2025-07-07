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
    # Stats by score
    ss: list[tuple[int, ContestStatsItemByScore | None]]
    # Stats by performance
    sp: list[tuple[int, ContestStatsItemByPerformance | None]]
