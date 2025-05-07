from datetime import datetime
from typing import cast

from models.contest_entry import ContestEntry
from models.contest_info import load_contest_info
from util.json_io import load_json, save_json

contest_info = load_contest_info()
contests: list[str] = [
    contest_name
    for contest_name, _ in sorted([
        (contest_name, datetime.strptime(info["date"], "%Y-%m-%dT%H:%M:%S.%f%z"))
        for contest_name, info in contest_info.items()
    ], key = lambda x: x[1])
]

histories: dict[str, list[ContestEntry]] = {}
for contest_name in contests:
    print(f"Getting histories of {contest_name}")
    contest_json = load_json(f"input/contests/{contest_name}.json")
    for player in contest_json["StandingsData"]:
        name = player["UserScreenName"]
        is_rated = player["IsRated"]
        if name not in histories:
            histories[name] = []
        histories[name].append({ "contest": contest_name, "isRated": is_rated })
save_json(histories, "output/histories.json")

