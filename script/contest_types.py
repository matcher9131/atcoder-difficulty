from typing import TypedDict

class TaskInfoItem(TypedDict):
    TaskName: str
    TaskScreenName: str


class TaskResult(TypedDict):
    SubmissionID: int


class PlayerResult(TypedDict):
    Count: int
    Score: int
    Elapsed: int


class Player(TypedDict):
    Rank: int
    UserScreenName: str
    OldRating: int
    IsRated: bool
    Competitions: int
    TaskResults: dict[str, TaskResult]
    TotalResult: PlayerResult


class ContestJson(TypedDict):
    TaskInfo: list[TaskInfoItem]
    StandingsData: list[Player]


class ContestStatsItem(TypedDict):
    # Rank
    r: int
    # Score
    s: int
    # Time
    t: int
    # Perfermance
    p: int
