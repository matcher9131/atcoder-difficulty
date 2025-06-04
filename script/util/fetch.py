import requests # type: ignore
import json

def fetch(session: requests.Session, url: str):
    response = session.get(url)
    if (response.status_code == 200):
        try:
            return response.json()
        except json.JSONDecodeError as ex:
            print(f"Failed decoding {url} to json: {ex}")
            return None
    else:
        print(f"Request failed. url = {url}")
        return None
