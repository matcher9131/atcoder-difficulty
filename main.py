import json

contest_name = "abc396"
filepath = "data/" + contest_name + ".json"

with open(contest_name, "r", encoding="utf-8") as json_file:
    json_data = json.load(json_file)

print(json_data["StandingsData"][0]["UserName"])