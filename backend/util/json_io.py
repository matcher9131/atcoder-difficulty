from datetime import datetime
import json
import glob
import os

def load_json(filepath: str, converts_date_field: bool=False):
    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file, object_hook=convert_date_field)

def save_json(data, filepath: str, indent: int | None = None) -> None:
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(json.dumps(data, indent=indent, ensure_ascii=False))

def enumerate_contest_ids() -> list[str]:
    filepaths = glob.glob("./input/contests/*.json")
    return [os.path.splitext(os.path.basename(filepath))[0] for filepath in filepaths]

def convert_date_field(obj):
    if "date" in obj:
        obj["date"] = datetime.fromisoformat(obj["date"])
    return obj