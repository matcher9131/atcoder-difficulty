from numpy import exp, log, sqrt

def inverse_adjustment_low_rating(rating: float) -> float:
    return 400.0 * (1 - log(400.0 / rating)) if rating < 400 else rating

def adjust_low_rating(rating: float) -> float:
    return 400.0 / exp((400.0 - rating) / 400.0)  if rating < 400 else rating

def get_raw_rating(rating: float, num_contests: int) -> float:
    rating = inverse_adjustment_low_rating(rating)
    adjustment = (sqrt(1.0 - 0.81 ** num_contests) / (1.0 - 0.9 ** num_contests) - 1.0) / (sqrt(19.0) - 1.0) * 1200.0
    return rating + adjustment