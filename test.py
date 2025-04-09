import json_io
from bisect import bisect_left

def get_easy_problem_stats():
    contest_name = "abc396"
    abilities, responses = json_io.get_data(contest_name)
    for problem_index in range(2):
        data = [[response, ability] for ability, response in zip(abilities, responses[problem_index])]
        data.sort()
        correct_begin_index = bisect_left(data, [1, 0])
        frequency_distribution = [[0] * 2 for _ in range(20)]
        for player_index, [_, ability] in enumerate(data):
            rank_index = ability // 25
            if rank_index < 20:
                frequency_distribution[rank_index][player_index >= correct_begin_index] += 1
        print(f"{contest_name}{'A' if problem_index == 0 else 'B'}:")
        print(" rate | incr | corr")
        print("======|======|======")
        for i, [num_incorrect, num_correct] in enumerate(frequency_distribution):
            print(f" {str(i * 25).rjust(4)} | {str(num_incorrect).rjust(4)} | {str(num_correct).rjust(4)}")

def no_competition():
    contest_json = json_io.load_json("input/abc396.json")
    no_comp = [player["Competitions"] for player in contest_json["StandingsData"] if player["OldRating"] == 0]
    print(no_comp)

def num_players():
    data_json = json_io.load_json("data/abc396.json")
    print(len(data_json["abilities"]))

# get_easy_problem_stats()
# no_competition()
num_players()
