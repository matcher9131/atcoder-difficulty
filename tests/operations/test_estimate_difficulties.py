
import pytest

from models.contest_entry import ContestEntry
from models.contest_info import ContestsNeedingHistory
from operations.estimate_difficulties import contest_needs_history, get_num_contests


@pytest.mark.parametrize(("contest_name", "expected"), [
    ("abc400", False),
    ("abc399", True),
    ("abc001", True),
    ("arc197", False),
    ("arc196", True),
    ("agc072", False),
    ("agc071", True),
    ("foo", True)
])
def test_contest_needs_history(contest_name: str, expected: bool):
    contests_needing_history: ContestsNeedingHistory = { "abc": 399, "arc": 196, "agc": 71 }
    assert contest_needs_history(contests_needing_history, contest_name) == expected

@pytest.mark.parametrize(("contest_name", "expected"), [
    ("abc001", 0),
    ("abc002", 0),
    ("abc003", 1),
    ("abc004", 1),
    ("abc005", 1),
    ("abc006", 2),
    ("abc007", 3),
])
def test_get_num_contests(contest_name: str, expected: bool):
    entries: list[ContestEntry] = [
        { "contest": "abc001", "isRated": False },
        { "contest": "abc002", "isRated": True },
        { "contest": "abc003", "isRated": False },
        { "contest": "abc004", "isRated": False },
        { "contest": "abc005", "isRated": True },
        { "contest": "abc006", "isRated": True },
        { "contest": "abc007", "isRated": False },
    ]
    assert get_num_contests(entries, contest_name) == expected
