from typing import TypedDict


class Player(TypedDict):
    name: str
    rating: float
    numContests: int
    isRated: bool
    # 1: accepted, 0: unaccepted, -1: no submissions
    responses: list[int]
