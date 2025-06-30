import requests # type: ignore

from contest_types import ContestJson
from history_types import HistoryItem


class PlayerPerformance:
    """A Class to get player's performance in the contest and cache it"""

    def __init__(self, contest_id: str, contest_json: ContestJson) -> None:
        self._id = contest_id
        self._player_names = [player["UserScreenName"] for player in contest_json["StandingsData"]]
        # None: Deleted user, -1: Not visited yet
        self._performances: list[int | None] = [-1] * len(self._player_names)
    
    def __getitem__(self, i: int) -> int | None:
        if self._performances[i] != -1:
            return self._performances[i]
        
        player_name = self._player_names[i]
        response = requests.get(f"https://atcoder.jp/users/{player_name}/history/json")
        if response.status_code != 200:
            print(f"User {player_name} is not found")
            self._performances[i] = None
        else:
            histories: list[HistoryItem] = response.json()
            item = next((history for history in histories if history["ContestScreenName"] == self._id + ".contest.atcoder.jp"), None)
            if item is None or not item["IsRated"]:
                self._performances[i] = None
            else:
                self._performances[i] = item["Performance"]
        
        return self._performances[i]
    