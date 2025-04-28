import pytest

from models.contest_info import contest_needs_history


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
    assert contest_needs_history(contest_name) == expected
