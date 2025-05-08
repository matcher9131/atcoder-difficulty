from typing import TypeAlias

from models.contest_entry import ContestEntry
from util.json_io import load_json

PlayerHistories: TypeAlias = dict[str, list[ContestEntry]]
PlayerNumContestsDict: TypeAlias = dict[str, dict[str, int]]

def load_player_histories() -> PlayerHistories:
    return load_json("output/histories.json")

def _get_num_contests_from_entries(entries: list[ContestEntry]) -> dict[str, int]:
    result = {}
    i = 0
    for entry in entries:
        result[entry["contest"]] = i
        if entry["isRated"]:
            i += 1
    return result

def load_player_num_contests_dict() -> PlayerNumContestsDict:
    return { playerName: _get_num_contests_from_entries(entries) for playerName, entries in load_player_histories().items() }
