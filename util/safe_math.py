import math
import numpy as np

def safe_log(x: float) -> float:
    return np.log(x) if x >= math.ulp(0.0) else np.log(math.ulp(0.0))
