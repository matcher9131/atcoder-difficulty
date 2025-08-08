import re


def parse_start_or_raise(s: str) -> int:
    match_result = re.match(r"^(\d+)", s)
    if match_result is None:
        raise ValueError(f"'{s}' does not start with digits.")
    return int(match_result.group(1))
