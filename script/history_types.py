from typing import TypedDict


class HistoryItem(TypedDict):
    IsRated: bool
    OldRating: int
    Performance: int
    ContestScreenName: str
