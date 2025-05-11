from datetime import datetime
from typing import TypedDict

from util.json_io import load_json


class ContestInfoItem(TypedDict):
    date: datetime
    rating: dict[str, int | None] | None

class ContestInfo:
    def __init__(self):
        items: dict[str, ContestInfoItem] = load_json("input/contest_info.json", converts_date_field=True)
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
