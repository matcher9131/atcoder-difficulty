from typing import TypedDict

class Problem(TypedDict):
    # display name
    n: str
    # discrimination, difficulty
    d: tuple[float, float] | None
