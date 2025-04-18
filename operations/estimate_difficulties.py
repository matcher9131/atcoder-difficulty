from util.json_io import load_json, save_json, enumerate_contest_names
from models.contest import load_contest, get_abilities_and_responses
from functions.irt_1pl import estimate

def estimate_difficulties(forces_update: bool):
    output_filepath = "output/difficulties.json"
    difficulty_dict = load_json(output_filepath)

    contest_names = enumerate_contest_names()
    for contest_name in contest_names:
        if forces_update or not contest_name in difficulty_dict:
            contest = load_contest(contest_name)
            abilities, responses = get_abilities_and_responses(contest)
            difficulties = estimate(abilities, responses)
            difficulty_dict[contest_name] = difficulties

    save_json(difficulty_dict, output_filepath, indent=4)
