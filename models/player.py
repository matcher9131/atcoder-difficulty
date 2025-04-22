from typing import TypedDict

class Player(TypedDict):
    name: str
    rating: float
    numContests: int
    isRated: bool
    responses: list[int]
