from typing import TypedDict

class Player(TypedDict):
    name: str
    rating: float
    isRated: bool
    responses: list[int]
