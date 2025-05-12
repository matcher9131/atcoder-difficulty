import shutil

from models.contest_info import ContestInfo
from util.json_io import save_json


def create_contests_json():
    contest_info = ContestInfo()
    save_json(contest_info.get_all_contest_max_ratings(), "output/contests.json")
    shutil.copy2("output/contests.json", "../public/contests.json")
