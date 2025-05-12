import sys

from operations.estimate_difficulties import estimate_and_save_difficulties
from util.json_io import enumerate_contest_ids

if __name__ == "__main__":
    if (len(sys.argv) == 1):
        print("This program should be called with commandline arguments. Call with '-h' to show details.")
        sys.exit(0)

    if sys.argv[1] == "-h":
        print("Usage:")
        print("  python main.py <contest> [-f]")
        print("  python main.py -a [-f]")
        print("Options:")
        print("  <contest>  A contest to estimate")
        print("  -a         Estimates all the contest")
        print("  -f         Forces update (optional)")
    else:
        forces_update = "-f" in sys.argv[1:]
        estimates_all = "-a" in sys.argv[1:]
        contest_name = next((arg for arg in sys.argv[1:] if arg != "-f" and arg != "-a"), None)
        if estimates_all:
            estimate_and_save_difficulties(enumerate_contest_ids(), forces_update)
        elif contest_name is None:
            print("Missing argument: contest")
            sys.exit(0)
        else:
            estimate_and_save_difficulties([contest_name], forces_update)
