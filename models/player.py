from typing import TypedDict

class Player(TypedDict):
    rating: float
    isRated: bool
    responses: list[int]
