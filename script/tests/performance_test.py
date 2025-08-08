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
        ("quux", None),
        ("corge", 2100),
        ("grault", 1700),
        ("garply", 1100),
        ("waldo", 1100),
    ]

@pytest.mark.parametrize("target_parameter, expected", [
    (1700, 6),
    (3200, None),
    (1500, (6, 7)),
    (1000, None),
    (2200, (2, 5)),
    (1100, 7)
])
def test_find(players, target_parameter, expected):
    with patch.object(PlayerPerformance, "__getitem__", side_effect=lambda i: players[i][1]):
        performance = PlayerPerformance("foo", [player_name for player_name, _ in players])
        result = performance.find(target_parameter)
        assert result == expected
    