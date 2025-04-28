from datetime import datetime
from typing import cast

from models.contest_entry import ContestEntry
from util.json_io import load_json, save_json


contests: list[str] = [
    contest_name
    for contest_name, _ in sorted([
        (cast(str, contest_name), datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f%z"))
        for contest_name, date_str in load_json("input/contest_date.json").items()
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

