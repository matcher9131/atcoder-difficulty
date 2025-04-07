import json

def load_json(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file)

def save_json(data, filepath, indent=None):
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(json.dumps(data, indent=indent))

def get_data(contest_name):
    filepath = f"data/{contest_name}.json"
    json_data = load_json(filepath)
    if "abilities" in json_data and "responses" in json_data:
        return json_data["abilities"], json_data["responses"]
    else:
        raise ValueError("Invalid JSON")