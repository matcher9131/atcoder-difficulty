import sqlite3

db_name = "player_performances.db"

class PlayerPerformancesDB():
    def __init__(self) -> None:
        self._conn = sqlite3.connect(db_name)
    

    def __del__(self) -> None:
        self._conn.close()

    
    def get_performance(self, player_name: str, contest_id: str) -> int | None:
        cur = self._conn.cursor()
        try:
            cur.execute(
                """SELECT performance FROM player_performances WHERE player_name = ? AND contest_id = ?""",
                (player_name, contest_id)
            )
            return cur.fetchone()
        finally:
            cur.close()


    def set_performances(self, player_name: str, performances: list[tuple[str, int]]) -> None:
        cur = self._conn.cursor()
        try:
            cur.execute(
                """INSERT OR IGNORE INTO player_performances (player_name, contest_id, performance) VALUES (?, ?, ?)""",
                [(player_name, contest_id, performance) for contest_id, performance in performances]
            )
        finally:
            cur.close()
