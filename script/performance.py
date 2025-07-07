from performance_db import PlayerPerformancesDB
import requests # type: ignore
from time import sleep

from history_types import HistoryItem


def contest_screen_name_to_contest_id(screen_name: str) -> str:
    index = screen_name.rfind(".contest.atcoder.jp")
    return screen_name[:index] if index >= 0 else screen_name


class PlayerPerformance:
    """A Class to get player's performance in the contest and cache it"""

    def __init__(self, contest_id: str, player_names: list[str], db: PlayerPerformancesDB | None) -> None:
        self._id = contest_id
        self._player_names = player_names
        self._db = db
        print("Using PlayerPerformancesDB" if db else "Not using PlayerPerformancesDB")
        # None: Unrated or deleted user, -1: Not visited yet
        self._performances: list[int | None] = [-1] * len(player_names)
    

    def __getitem__(self, i: int) -> int | None:
        if self._performances[i] != -1:
            return self._performances[i]
        
        player_name = self._player_names[i]

        performance_in_db = self._db.get_performance(player_name, self._id) if self._db else None
        if performance_in_db:
            self._performances[i] = performance_in_db if performance_in_db > 0 else None
        else:
            # Get player's performances from AtCoder's user page
            response = requests.get(f"https://atcoder.jp/users/{player_name}/history/json")
            sleep(3)
            if response.status_code != 200:
                print(f"User {player_name} is not found")
                if self._db:
                    self._db.set_deleted_player(player_name)
                self._performances[i] = None
            else:
                histories: list[HistoryItem] = response.json()
                if self._db:
                    self._db.set_performances(
                        player_name,
                        [(contest_screen_name_to_contest_id(history["ContestScreenName"]), history["Performance"]) for history in histories]
                    )
                item = next((history for history in histories if history["ContestScreenName"] == self._id + ".contest.atcoder.jp"), None)
                if item is None or not item["IsRated"]:
                    self._performances[i] = None
                else:
                    self._performances[i] = item["Performance"]
            
        return self._performances[i]
    
    
    def find(self, performance: int) -> int | tuple[int, int] | None:
        """Find the player with performance given by binary search and return the index of the player
        Args:
            performance (int): Performance value to find
        Return:
            One of the following
            - An index of the player with the exact performance
            - A tuple of indices of the players ranked just above and below
            - `None`
        """

        n = len(self._player_names)
        left = 0
        right = n - 1
        # Index of players ranked just above or below 
        sup_index = None
        inf_index = None

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
                return (sup_index, inf_index) if sup_index is not None and inf_index is not None else None
            if current_performance == performance:
                return mid
            elif current_performance < performance:
                right = mid - 1
                if inf_index is None:
                    inf_index = mid
                else:
                    inf_performance = self[inf_index]
                    if inf_performance is None:
                        raise ValueError("Invalid state: inf_performance is None")
                    if inf_performance < current_performance:
                        inf_index = mid
            else:
                left = mid + 1
                if sup_index is None:
                    sup_index = mid
                else:
                    sup_performance = self[sup_index]
                    if sup_performance is None:
                        raise ValueError("Invalid state: sup_performance is None")
                    if current_performance < sup_performance:
                        sup_index = mid
        # end while left <= right

        return (sup_index, inf_index) if sup_index is not None and inf_index is not None else None

    