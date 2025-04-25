from typing import TypedDict
from util.json_io import load_json

class InvalidPlayerNumContests(TypedDict):
    abc: int
    arc: int
    agc: int

class ContestInfo(TypedDict):
    invalidPlayerNumContests: InvalidPlayerNumContests

def load_invalid_player_num_contests() -> InvalidPlayerNumContests:
    return load_json("input/contest_info.json")["validPlayerNumContests"]
