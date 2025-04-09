import matplotlib.pyplot as plt
import math
import numpy as np

x = np.linspace(0, 400, 100)
y = 400 / np.exp((400 - x) / 400)
y2 = x
plt.plot(x, y, "blue")
plt.plot(x, y2, "red")
plt.show()