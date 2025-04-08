import irt_1pl
import json_io

forces_update = True

output_filepath = "output/difficulties.json"
difficulty_dict = json_io.load_json(output_filepath)

contest_names = json_io.emuerate_contest_names()
for contest_name in contest_names:
    if forces_update or not contest_name in difficulty_dict:
        abilities, responses = json_io.get_data(contest_name)
        difficulties = irt_1pl.estimate(abilities, responses)
        difficulty_dict[contest_name] = difficulties

json_io.save_json(difficulty_dict, output_filepath, indent=4)
