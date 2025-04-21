import requests
import time
from models.contest import load_contest
from models.contest_entry import ContestEntry
from util.fetch import fetch
from util.json_io import load_json, save_json

is_cancelling = False

def _get_contest_name(contest_name: str) -> str:
    index = contest_name.find(".")
    return contest_name[:index] if index > -1 else contest_name

def get_user_history(session: requests.Session, user_name: str) -> list[ContestEntry]:
    url = f"https://atcoder.jp/users/{user_name}/history/json"
    json_data = fetch(session, url)
    if json_data is not None:
        return [
            {
                "contest": _get_contest_name(contest["ContestScreenName"]),
                "rating": contest["OldRating"]
            } for contest in json_data
        ]
    else:
        return []

def save_user_histories(session: requests.Session, contest_name: str) -> None:
    output_path = "output/histories.json"
    saved_histories: dict[str, list[ContestEntry]] = load_json(output_path)
    contest = load_contest(contest_name)
    try:
        for player in contest["players"]:
            player_name = player["name"]
            if (player_name in saved_histories and any(entry["contest"] == contest_name for entry in saved_histories[player_name])):
                continue
            print(f"Getting history of '{player_name}'")
            player_history = get_user_history(session, player_name)
            saved_histories[player_name] = player_history
            time.sleep(5)
    except KeyboardInterrupt:
        print("Stopping process...")
        save_json(saved_histories, output_path)
        return
    save_json(saved_histories, output_path)
