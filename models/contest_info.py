from typing import TypedDict
from util.json_io import load_json

class ContestsNeedingHistory(TypedDict):
    abc: int
    arc: int
    agc: int

class ContestInfo(TypedDict):
    contestsNeedingHistory: ContestsNeedingHistory

def load_contests_needing_history() -> ContestsNeedingHistory:
    return load_json("input/contest_info.json")["contestsNeedingHistory"]
