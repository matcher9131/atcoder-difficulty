from numpy import log, sqrt

def get_raw_rating(rating: int, num_contests: int) -> float:
    if rating < 400:
        rating = 400 * (1 - log(400 / rating))
    adjustment = (sqrt(1.0 - 0.81 ** num_contests) / (1.0 - 0.9 ** num_contests) - 1.0) / (sqrt(19.0) - 1.0) * 1200.0
    return rating + adjustment