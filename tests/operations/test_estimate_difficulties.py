
import pytest

from models.contest_entry import ContestEntry
from operations.estimate_difficulties import get_num_contests, is_nan_tuple


@pytest.mark.parametrize(("x", "expected"), [
    ([42, 42], False),
    ([42, None], True),
    ([None, None], True),
    ([None, 42], True)
])
def test_is_nan_tuple(x: tuple[float, float] | tuple[None, None], expected: bool):
    assert is_nan_tuple(x) == expected


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
