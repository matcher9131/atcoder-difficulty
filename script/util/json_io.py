from datetime import datetime
import json


def parse_datetime(s: str) -> datetime | str:
    try:
        return datetime.fromisoformat(s)
    except ValueError:
        return s


def parse_datetime_recursively(obj):
    if isinstance(obj, dict):
        return { key: parse_datetime_recursively(value) for key, value in obj.items() }
    elif isinstance(obj, list):
        return [parse_datetime_recursively(item) for item in obj]
    elif isinstance(obj, str):
        return parse_datetime(obj)
    else:
        return obj


def load_json(filepath: str, converts_date_field: bool=True):
    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file, object_hook=parse_datetime_recursively if converts_date_field else None)


def save_json(data, filepath: str, indent: int | None = None) -> None:
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(json.dumps(data, indent=indent, ensure_ascii=False, default=encode_datetime))


def encode_datetime(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return str(obj)