from typing import Literal, TypedDict, cast

from util.json_io import load_json


class ContestsNeedingHistory(TypedDict):
    abc: int
    arc: int
    agc: int


class ContestInfo(TypedDict):
    contestsNeedingHistory: ContestsNeedingHistory


def contest_needs_history(contest_name: str) -> bool:
    contests_needing_history = load_json("input/contest_info.json")["contestsNeedingHistory"]
    if contest_name.startswith("abc") or contest_name.startswith("arc") or contest_name.startswith("agc"):
        try:
            type = cast(Literal["abc", "arc", "agc"], contest_name[0:3])
            num = int(contest_name[3:], 10)
            return num <= contests_needing_history[type]
        except ValueError:
            return False
    else:
        # TODO: Implementation for non-regular contests
        return True
