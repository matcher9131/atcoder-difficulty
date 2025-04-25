
import pytest

from models.contest_info import ContestsNeedingHistory
from operations.estimate_difficulties import contest_needs_history


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