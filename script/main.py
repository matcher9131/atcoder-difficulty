import sys

from contest_json import ContestJson, get_new_contest_ids
from contest_stats import ContestSummary, load_all_contest_stats, load_contest_summaries, save_all_contest_stats, save_contest_summaries
from difficulty import estimate_contest_difficulties
from distribution import create_compressed_frequency_distributions, load_all_distributions, save_all_distributions
from problem import Problem
from util.json_io import load_json, save_json


contests_json_path = "../src/assets/contests.json"
problems_json_path = "../src/assets/problems.json"
def run(contest_ids: list[str]):
    contest_summaries: dict[str, ContestSummary] = load_contest_summaries()
    existing_ids = [id for id, _ in contest_summaries]

    new_contest_ids = [id for id in contest_ids if id not in existing_ids] if contest_ids else get_new_contest_ids(existing_ids)
    if len(new_contest_ids) == 0:
        print("No new contests")
        return

    problems_json: dict[str, Problem] = load_json(problems_json_path)
    distribution_json = load_all_distributions()
    contest_stats_json = load_all_contest_stats()
    for contest_id in new_contest_ids:
        try:
            contest_json = ContestJson.from_contest_id(contest_id)

            contest_summary = contest_json.get_contest_summary()
            contest_summaries[contest_id] = contest_summary

            contest_stats = contest_json.get_contest_stats()
            contest_stats_json[contest_id] = contest_stats

            difficulties = estimate_contest_difficulties(contest_id, contest_json)
            problems_json |= difficulties

            distributions = create_compressed_frequency_distributions(contest_id, contest_json)
            distribution_json |= distributions
        except Exception as e:
            print(f"Failed get contest {contest_id}, message: {str(e)}", file=sys.stderr)

    save_contest_summaries(contest_summaries)
    save_all_contest_stats(contest_stats_json, contest_summaries)
    save_json(problems_json, problems_json_path)
    save_all_distributions(distribution_json)


if __name__ == "__main__":
    contest_ids = sys.argv[1:]
    run(contest_ids)
