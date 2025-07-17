import sqlite3
from typing import Literal, cast


db_name = "player_performances.db"

class PlayerPerformancesDB():
    def __init__(self) -> None:
        self._conn = sqlite3.connect(db_name)
    

    def __del__(self) -> None:
        self._conn.close()

    
    def set_deleted_player(self, player_name: str):
        cur = self._conn.cursor()
        try:
            cur.execute("""INSERT OR IGNORE INTO deleted_players VALUES(?)""", (player_name,))
            self._conn.commit()
        finally:
            cur.close()

    
    def get_performance(self, player_name: str, contest_id: str) -> int | None | Literal["deleted"] | Literal["not_found"]:
        cur = self._conn.cursor()
        try:
            cur.execute("""SELECT 1 FROM deleted_players WHERE name = ?""", (player_name,))
            deleted_result = cur.fetchone()
            if deleted_result is not None:
                return "deleted"

            cur.execute("""SELECT 1 FROM players WHERE name = ?""", (player_name,))
            exists_result = cur.fetchone()
            if exists_result is None:
                return "not_found"

            cur.execute(
                """SELECT performance FROM player_performances WHERE player_name = ? AND contest_id = ?""",
                (player_name, contest_id)
            )
            result = cur.fetchone()
            if result is None:
                raise ValueError(f"Player {player_name} did participate in the contest {contest_id}, but not found in history.")
            return result[0]
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
