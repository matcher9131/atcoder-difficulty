import sys

from operations.estimate_difficulties import estimate_and_save_difficulties


if (len(sys.argv) == 1):
    print("This program should be called with commandline arguments. Call with '-h' to show details.")
    sys.exit(0)

if sys.argv[1] == "-h":
    print("Usage: python main.py <contest> [-f]")
    print("Options:")
    print("  <contest>  A contest to estimate")
    print("  -f         Force update (optional)")
else:
    forces_update = "-f" in sys.argv[1:]
    contest_name = next((arg for arg in sys.argv[1:] if arg != "-f"), None)
    if (contest_name is None):
        print("Missing argument: contest")
        sys.exit(0)
    estimate_and_save_difficulties([contest_name], forces_update)
