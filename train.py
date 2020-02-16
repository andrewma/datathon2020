import pandas as pd
import numpy as np
import scipy
import sys
from scipy import optimize
from scipy.optimize import LinearConstraint
from scipy.optimize import Bounds

arglen = len(sys.argv)
if arglen != 6:
    print("Err")
    exit()

def f(x, m, p = 0.08):
    sum = 0
    for i in range(len(x)):
        sum += (1 - pow(np.e, -(x[i])/((p*m[i]))))*m[i]
    return -sum

def train(industry = 'Retail trade', budget = 10000000, iters = 50, numZips = 100, percentRev = 0.08):
    industry = industry.replace('_', ' ')
    B = budget
    cleaned_data = pd.read_csv('data/cleaned.csv')
    used_data = cleaned_data[cleaned_data["NAIC"] == industry].nlargest(numZips, 'EST_SALES')

    weights = used_data['EST_SALES'].values.tolist()
    weights = list(filter(lambda num: num != 0, weights))
    ones = [1 for i in range(len(weights))]
    lower = [0.1 for i in range(len(weights))]
    upper = [B for i in range(len(weights))]

    linear_constraint = LinearConstraint([ones], 0, B)
    bounds = Bounds(lower, upper, keep_feasible=True)

    result = scipy.optimize.minimize(method='SLSQP', fun=f, args=(weights, percentRev), x0=ones, constraints=(linear_constraint), options={'maxiter': iters, 'disp': True, 'eps': B*(1/100)}, bounds=(bounds))
    final_df = pd.DataFrame({"ZIP": used_data['ZIP'], "MONEY": result['x']})

    final_df.to_csv("data/heatmap_data.csv")


train(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5]))
