import requests

from models.contest_info import contest_needs_history
from operations.estimate_difficulties import estimate_and_save_difficulties
from operations.player_histories import save_player_histories
from util.fetch import fetch
from util.json_io import save_json

def save_contest_json(session: requests.Session, contest_name: str):
    url = f"https://atcoder.jp/contests/{contest_name}/standings/json"
    json_data = fetch(session, url)
    if json_data is None:
        raise Exception("Failed getting contest json.")
    filepath = f"input/contests/{contest_name}.json"
    save_json(json_data, filepath)

# forces_update = True
def run(session: requests.Session, contest_name: str):
    save_contest_json(session, contest_name)
    if contest_needs_history(contest_name):
        print("Start getting player histories...")
        save_player_histories(session, contest_name)
    estimate_and_save_difficulties([contest_name], True)
