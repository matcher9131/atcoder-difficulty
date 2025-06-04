from datetime import datetime
from typing import Literal, TypedDict

from util.json_io import load_json, save_json


class ContestInfoItem(TypedDict):
    date: datetime
    rating: dict[str, int | None] | None

class ContestInfo:
    _filepath = "input/contest_info.json"

    def __init__(self):
        items: dict[str, ContestInfoItem] = load_json(ContestInfo._filepath, converts_date_field=True)
        self._items = items
    
    def get_contest_date(self, contest_id) -> datetime | None:
        contest = self._items.get(contest_id)
        return contest["date"] if contest is not None else None
    
    def get_max_rating(self, contest_id) -> int | None:
        contest = self._items.get(contest_id)
        return None if contest is None or contest["rating"] is None else contest["rating"].get("max")
    
    def get_min_rating(self, contest_id) -> int | None:
        contest = self._items.get(contest_id)
        return None if contest is None or contest["rating"] is None else contest["rating"].get("min")
    
    def has_contest(self, contest_id: str) -> bool:
        return contest_id in self._items

    def add_item(self, contest_id: str, item: ContestInfoItem):
        if not self.has_contest(contest_id):
            self._items[contest_id] = item

    def save(self):
        save_json(self._items, ContestInfo._filepath)

    def get_all_contest_max_ratings(self) -> list[tuple[str, int | Literal["inf"]]]:
        results: list[tuple[str, int | Literal["inf"]]] = [
            (
                contest_id,
                "inf" if contest_info_item["rating"] is None
                else "inf" if contest_info_item["rating"]["max"] is None
                else contest_info_item["rating"]["max"]
            ) for contest_id, contest_info_item in self._items.items()
        ]
        results.sort(reverse=True, key=lambda item: self._items[item[0]]["date"])
        return results

    def enumerate_all_contests(self) -> list[str]:
        return [contest_id for contest_id, _ in sorted(self._items.items(), key=lambda item: item[1]["date"])]