import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score


# Sample training data for demand forecasting
data = {
    "current_stock": [20, 50, 100, 30, 80, 10, 60, 90, 25, 45, 70, 15],
    "avg_daily_sales": [5, 3, 1, 7, 2, 8, 4, 2, 6, 5, 3, 9],
    "days_remaining": [4, 16, 100, 4, 40, 1, 15, 45, 4, 9, 23, 2],
    "trend_percent": [20, 10, 0, 30, -5, 40, 15, -10, 25, 12, 5, 35],
    "target_30_day_demand": [170, 95, 30, 230, 55, 260, 135, 50, 200, 160, 90, 280],
}

df = pd.DataFrame(data)

X = df[
    [
        "current_stock",
        "avg_daily_sales",
        "days_remaining",
        "trend_percent",
    ]
]

y = df["target_30_day_demand"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(
    n_estimators=150,
    random_state=42,
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

joblib.dump(model, "model.pkl")

print("ML demand forecasting model trained successfully.")
print(f"MAE: {mae:.2f}")
print(f"R2 Score: {r2:.2f}")