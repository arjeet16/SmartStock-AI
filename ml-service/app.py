from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "SmartStock ML Forecast Service Running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        features = np.array([[
            float(data.get("current_stock", 0)),
            float(data.get("avg_daily_sales", 0)),
            float(data.get("days_remaining", 0)),
            float(data.get("trend_percent", 0)),
        ]])

        prediction = model.predict(features)[0]

        return jsonify({
            "success": True,
            "predicted_30_day_demand": round(float(prediction))
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/metrics", methods=["GET"])
def metrics():
    try:
        with open("model_metrics.json", "r") as file:
            metrics_data = json.load(file)

        return jsonify({
            "success": True,
            "metrics": metrics_data
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(port=7000, debug=True)