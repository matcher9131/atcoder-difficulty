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
    
    
    def find(self, performance: int) -> int | None:
        """Find the player with performance given by binary search and return the index of the player"""

        n = len(self._player_names)
        left = 0
        right = n - 1
        # Index of players with the smallest performance greater than the performance given 
        ceiling_index = None

        while left <= right:
            mid = (left + right) // 2

            # Adjust mid
            if self[mid] is None:
                current_left = mid - 1
                current_right = mid + 1
                while left <= current_left or current_right <= right:
                    if left <= current_left and self[current_left] is not None:
                        mid = current_left
                        break
                    if current_right <= right and self[current_right] is not None:
                        mid = current_right
                        break
                    current_left -= 1
                    current_right += 1
            
            current_performance = self[mid]
            if current_performance is None:
                # All null for [low, high]
                return None
            if current_performance == performance:
                return mid
            elif current_performance < performance:
                right = mid - 1
                if ceiling_index is None:
                    ceiling_index = mid
                else:
                    ceiling_performance = self[ceiling_index]
                    if ceiling_performance is None:
                        raise ValueError("Invalid state: ceiling_performance is None")
                    if current_performance < ceiling_performance:
                        ceiling_index = mid
            else:
                left = mid + 1
        # end while left <= right

        return ceiling_index

    