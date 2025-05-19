from datetime import datetime
from typing import cast

from models.contest_entry import ContestEntry
from models.contest_info import ContestInfo
from util.json_io import load_json, save_json

contest_info = ContestInfo()
histories: dict[str, list[ContestEntry]] = {}
for contest_id in contest_info.enumerate_all_contests():
    print(f"Getting histories of {contest_id}")
    contest_json = load_json(f"input/contests/{contest_id}.json")
    for player in contest_json["StandingsData"]:
        name = player["UserScreenName"]
        is_rated = player["IsRated"]
        if name not in histories:
            histories[name] = []
        histories[name].append({ "contest": contest_id, "isRated": is_rated })
save_json(histories, "output/histories.json")
