import sys

from contest import get_contest, get_contest_info, get_new_contests_info
from difficulty import estimate_contest_difficulties
from distribution import create_compressed_frequency_distributions, load_all_distributions, save_all_distributions
from problem import Problem
from util.json_io import load_json, save_json


contests_json_path = "../src/assets/contests.json"
problems_json_path = "../src/assets/problems.json"
def run(contest_ids: list[str]):
    contests_json: list[tuple[str, int | str]] = load_json(contests_json_path)
    existing_ids = [id for id, _ in contests_json]

    new_contests_info = [get_contest_info(contest_id) for contest_id in contest_ids] if contest_ids else get_new_contests_info(existing_ids)
    new_contests_info = [contest_info for contest_info in new_contests_info if contest_info is not None]
    if len(new_contests_info) == 0:
        print("No new contests")
        return

    problems_json: dict[str, Problem] = load_json(problems_json_path)
    distribution_json = load_all_distributions()
    for contest_id, max_rating in new_contests_info:
        try:
            contest = get_contest(contest_id)
            easy_problem_indices = [0, 1] if isinstance(max_rating, int) and max_rating < 2000 else []
            difficulties = estimate_contest_difficulties(contest, easy_problem_indices)
            problems_json |= difficulties
            distributions = create_compressed_frequency_distributions(contest, easy_problem_indices)
            distribution_json |= distributions
        except Exception as e:
            print(f"Failed get contest {contest_id}, message: {str(e)}", file=sys.stderr)

    save_json(problems_json, problems_json_path)
    save_all_distributions(distribution_json)
    save_json(new_contests_info + contests_json, contests_json_path)


if __name__ == "__main__":
    contest_ids = sys.argv[1:]
    run(contest_ids)
