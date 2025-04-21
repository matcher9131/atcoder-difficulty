import sys
from operations.estimate_difficulties import estimate_difficulties
from operations.user_histories import save_user_histories
from util.login import login

if (len(sys.argv) == 1):
    print("This program should be called with commandline arguments. Call with '-h' to show details.")
    sys.exit(0)

mode = sys.argv[1]
if (mode == "-h"):
    print("You can select modes by the first of arguments:")
    print("'-h': Show help")
    print("'-d': Estimate difficulties. You can set options below by following arguments.")
    print("    '-f': Force update")
    print("'-u': Get user histories. You should give another argument to specify the contest. eg: '-u abc400'")
elif (mode == "-d"):
    forces_update = "-f" in sys.argv[1:]
    estimate_difficulties(forces_update)
elif (mode == "-u"):
    if (len(sys.argv) <= 2):
        print("Missing argument: contest_name")
        sys.exit(0)
    contest_name = sys.argv[2]
    session = login()
    save_user_histories(session, contest_name)
