from functions.irt_1pl import estimate
from functions.rating import get_raw_rating
from models.contest import Contest, load_contest
from models.contest_entry import ContestEntry
from util.json_io import load_json, save_json, enumerate_contest_names

def get_contests_with_invalid_player_num_contest() -> list[str]:
    contest_info = load_json("input/contest_info.json")
    return contest_info["invalidPlayerNumContests"]

def get_num_contests(entries: list[ContestEntry], contest_name: str) -> int | None:
    i = 0
    for entry in entries:
        if entry["contest"] == contest_name:
            return i
        if entry["isRated"]:
            i += 1
    return None

def get_abilities_and_responses(contest: Contest, user_histories: None | dict[str, list[ContestEntry]], excludes_unrated: bool = False):
    abilities: list[float] = []
    responses: list[list[int]] = [[] for _ in contest["problems"]]
    for player in contest["players"]:
        if player["isRated"] or not excludes_unrated:
            if player["rating"] <= 0:
                continue
            num_contests = player["numContests"] - 1 if user_histories is None else get_num_contests(user_histories.get(player["name"]) or [], contest["name"])
            if num_contests is None:
                print(f"Entry not found: contest_name = {contest['name']}, player = {player['name']}")
                continue
            # Ignore newbies because their raw rating are all 1200 regardless their skills.
            if num_contests <= 0:
                continue
            abilities.append(get_raw_rating(player["rating"], num_contests))
            for problem_index, response in enumerate(player["responses"]):
                responses[problem_index].append(response)
    return abilities, responses

def estimate_difficulties(contest_names: list[str], forces_update: bool):
    output_filepath = "output/difficulties.json"
    difficulty_dict = load_json(output_filepath)

    contests_with_invalid_player_num_contest = get_contests_with_invalid_player_num_contest()
    user_histories = load_json("output/user_histories.json")

    if (len(contest_names) == 0):
        contest_names = enumerate_contest_names()
    for contest_name in contest_names:
        if forces_update or not contest_name in difficulty_dict:
            try:
                contest = load_contest(contest_name)
                abilities, responses = get_abilities_and_responses(contest, user_histories if contest_name in contests_with_invalid_player_num_contest else None)
                difficulties = estimate(abilities, responses)
                difficulty_dict[contest_name] = difficulties
            except FileNotFoundError:
                print(f"Contest {contest_name} is not found.")

    save_json(difficulty_dict, output_filepath, indent=4)
