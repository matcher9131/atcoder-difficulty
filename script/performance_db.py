import sqlite3
from typing import Literal, cast


db_name = "player_performances.db"

class PlayerPerformancesDB():
    def __init__(self) -> None:
        self._conn = sqlite3.connect(db_name)
        # In memory
        self._deleted_players = cast(set[str], {})
    

    def __del__(self) -> None:
        self._conn.close()


    def set_deleted_player(self, player_name: str) -> None:
        self._deleted_players.add(player_name)

    
    def get_performance(self, player_name: str, contest_id: str) -> int | None | Literal["deleted"] | Literal["not_found"]:
        if player_name in self._deleted_players:
            return "deleted"
        
        cur = self._conn.cursor()
        try:
            cur.execute(
                """SELECT performance FROM player_performances WHERE player_name = ? AND contest_id = ?""",
                (player_name, contest_id)
            )
            result = cur.fetchone()
            return result[0] if result is not None else "not_found"
        finally:
            cur.close()


    def set_performances(self, player_name: str, performances: list[tuple[str, int | None]]) -> None:
        cur = self._conn.cursor()
        try:
            cur.executemany(
                """INSERT OR IGNORE INTO player_performances (player_name, contest_id, performance) VALUES (?, ?, ?)""",
                [(player_name, contest_id, performance) for contest_id, performance in performances]
            )
            self._conn.commit()
        finally:
            cur.close()
