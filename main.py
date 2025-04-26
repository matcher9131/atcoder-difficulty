import sys
from operations.estimate_difficulties import estimate_and_save_difficulties
from operations.player_histories import save_player_histories
from operations.all import run as run_all
from util.login import login

if (len(sys.argv) == 1):
    print("This program should be called with commandline arguments. Call with '-h' to show details.")
    sys.exit(0)

mode = sys.argv[1]
if (mode == "-h"):
    print("You can select modes below by arguments. '<>' means any string is acceptable, and '[]' means it is optional.")
    print("'-h' :")
    print("  Show help.")
    print("'-d <contests> [-f]' : ")
    print("  Estimate difficulties.")
    print("    <contests>: Contests to estimate. You can specify multiple contests by separating with commas.")
    print("         All contests are estimated if not given.")
    print("    -f: Force update.")
    print("'-p <contest>' :")
    print("  Get player histories. ")
    print("    <contest>: A contest in which you want to get the history of players who participated.")
    print("'-a <contest>': ")
    print("  Get and save contest json, then estimate difficulties. Also get player histories if needed.")
    print("    <contest>: A contest to estimate.")
elif mode == "-d":
    if len(sys.argv) == 2:
        estimate_and_save_difficulties([], False)
    elif len(sys.argv) == 3:
        if (sys.argv[2] == "-f"):
            estimate_and_save_difficulties([], True)
        else:
            estimate_and_save_difficulties(sys.argv[2].split(","), False)
    else:
        if (sys.argv[3] == "-f"):
            estimate_and_save_difficulties(sys.argv[2].split(","), True)
        else:
            print(f"Invalid argument: {sys.argv[3]}")
elif mode == "-p":
    if len(sys.argv) <= 2:
        print("Missing argument: contest_name")
        sys.exit(0)
    contest_name = sys.argv[2]
    session = login()
    save_player_histories(session, contest_name)
elif mode == "-a":
    if len(sys.argv) <= 2:
        print("Missing argument: contest_name")
        sys.exit(0)
    contest_name = sys.argv[2]
    session = login()
    run_all(session, contest_name)
else:
    print(f"Invalid argument: {sys.argv[1]}")
