import sys

from operations.create_contests_json import create_contests_json
from operations.create_frequency_distributions import save_frequency_distributions
from operations.estimate_difficulties import estimate_and_save_difficulties
from operations.update_contest_info import update_contest_info
from util.json_io import enumerate_contest_ids

if __name__ == "__main__":
    if (len(sys.argv) == 1):
        print("This program should be called with commandline arguments. Call with '-h' to show details.")
        sys.exit(0)

    if sys.argv[1] == "-h":
        print("Usage:")
        print("  python main.py -d [-f] [<contest> ...]")
        print("    Estimate difficulty of problems.")
        print("      Options:")
        print("        -f         Forces update")
        print("        <contest>  Contests to estimate. You can give multiple contests by separating them by space.")
        print("                   Estimate all the contests if not given.")
        print("  python main.py -c")
        print("    Get contest info from AtCoder and create 'contests.json'")
        print("  python main.py -f [<contest> ...]")
        print("    Get frequency distributions of responses.")
        print("      Options:")
        print("        <contest>  Contests. You can give multiple contests by separating them by space.")
        print("                   Get of all the contests if not given.")
    elif sys.argv[1] == "-d":
        forces_update = "-f" in sys.argv[2:]
        contest_ids = [contest_id for contest_id in sys.argv[2:] if contest_id != "-f"]
        if contest_ids:
            estimate_and_save_difficulties(contest_ids, forces_update)
        else:
            estimate_and_save_difficulties(enumerate_contest_ids(), forces_update)
    elif sys.argv[1] == "-c":
        update_contest_info()
        create_contests_json()
    elif sys.argv[1] == "-f":
        contest_ids = [contest_id for contest_id in sys.argv[2:]]
        save_frequency_distributions(contest_ids if contest_ids else enumerate_contest_ids())
