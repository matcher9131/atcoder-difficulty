from typing import TypedDict

from util.json_io import load_json


class ContestInfoItem(TypedDict):
    date: str
    rating: dict[str, int]

def load_contest_info() -> dict[str, ContestInfoItem]:
    return load_json("input/contest_info.json")
