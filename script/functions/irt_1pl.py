import numpy as np
from util.rating import adjust_low_rating

_discrimination = np.log(6) / 400.0

def irt_1pl(ability: float, difficulty: int) -> float:
    return 1.0 / (1.0 + np.exp(-_discrimination * (ability - difficulty)))

def estimate(abilities: list[float], responses: list[list[int]]) -> list[int]:
    difficulties = []
    for problem_index, problem_responses in enumerate(responses):
        num_acs = sum(problem_responses)
        left = -1000
        right = 5000
        while right - left > 1:
            mid = (left + right) // 2
            expected_num_acs = 0.0
            for ability in abilities:
                expected_num_acs += irt_1pl(ability, mid)
            if expected_num_acs < num_acs:
                right = mid
            else:
                left = mid
        difficulty = int(adjust_low_rating(left))
        difficulties.append(difficulty)
    return difficulties