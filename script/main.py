import sys

from contest_json import ContestJson, get_new_contest_ids
from contest_stats import ContestStats
from difficulty import estimate_contest_difficulties
from distribution import create_compressed_frequency_distributions, load_all_distributions, save_all_distributions
from problem import Problem
from util.json_io import load_json, save_json


contests_json_path = "../src/assets/contests.json"
problems_json_path = "../src/assets/problems.json"
def run(contest_ids: list[str]):
    contests_json: list[tuple[str, ContestStats]] = load_json(contests_json_path)
    existing_ids = [id for id, _ in contests_json]

    new_contest_ids = [id for id in contest_ids if id not in existing_ids] if contest_ids else get_new_contest_ids(existing_ids)
    if len(new_contest_ids) == 0:
        print("No new contests")
        return

    problems_json: dict[str, Problem] = load_json(problems_json_path)
    distribution_json = load_all_distributions()
    for contest_id in new_contest_ids:
        try:
            contest_json = ContestJson.from_contest_id(contest_id)
            contest_stats = contest_json.get_contest_stats(contest_id)
            easy_problem_indices = [0, 1] if isinstance(contest_stats["m"], int) and contest_stats["m"] < 2000 else []
            difficulties = estimate_contest_difficulties(contest_id, contest_json, easy_problem_indices)
            distributions = create_compressed_frequency_distributions(contest_id, contest_json, easy_problem_indices)
            contests_json.append((contest_id, contest_stats))
            problems_json |= difficulties
            distribution_json |= distributions
        except Exception as e:
            print(f"Failed get contest {contest_id}, message: {str(e)}", file=sys.stderr)

    contests_json.sort(key=lambda tuple: tuple[1]["d"], reverse=True)
    save_json(contests_json, contests_json_path)
    save_json(problems_json, problems_json_path)
    save_all_distributions(distribution_json)


if __name__ == "__main__":
    contest_ids = sys.argv[1:]
    run(contest_ids)
