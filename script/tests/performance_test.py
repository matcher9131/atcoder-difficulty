import pytest
from unittest.mock import patch

from performance import PlayerPerformance


@pytest.fixture
def players() -> list[tuple[str, int | None]]:
    return [
        ("foo", None),
        ("bar", 2800),
        ("baz", 2300),
        ("qux", None),
        ("quux", 2100),
        ("corge", None),
        ("grault", 1700),
        ("garply", 1400),
        ("waldo", None),
        ("fred", None)
    ]

@pytest.mark.parametrize("target_parameter, expected", [
    (1400, 7),
    (3200, None),
    (1500, 6),
    (1000, None)
])
def test_find(players, target_parameter, expected):
    with patch.object(PlayerPerformance, "__getitem__", side_effect=lambda i: players[i][1]):
        performance = PlayerPerformance("foo", [player_name for player_name, _ in players])
        result = performance.find(target_parameter)
        assert result == expected
    