import json
import glob
import os

def load_json(filepath: str):
    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file)

def save_json(data, filepath: str, indent: int | None = None) -> None:
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(json.dumps(data, indent=indent))

def enumerate_contest_names() -> list[str]:
    filepaths = glob.glob("./input/*.json")
    return [os.path.splitext(os.path.basename(filepath))[0] for filepath in filepaths]