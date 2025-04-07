import numpy as np

_discrimination = np.log(6) / 400.0

def irt_1pl(ability, difficulty):
    return 1.0 / (1.0 + np.exp(-_discrimination * (ability - difficulty)))

def estimate(abilities, responses):
    difficulties = []
    for problem_index in range(len(responses)):
        num_acs = sum(responses[problem_index])
        left = -1000
        right = 5000
        while right - left > 1:
            mid = (left + right) // 2
            expected_num_acs = 0
            for ability in abilities:
                expected_num_acs += irt_1pl(ability, mid)
            if expected_num_acs < num_acs:
                right = mid
            else:
                left = mid
        difficulties.append(left)
    return difficulties