from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)

# Enable CORS (allow frontend access)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "..", "model.pkl")
model = joblib.load(model_path)

@app.route("/")
def home():
    return jsonify({"message": "Crop Recommendation API Running"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    if "temperature" not in data:
        return jsonify({"error": "Temperature is mandatory"}), 400

    if len(data.keys()) < 3:
        return jsonify({
            "error": "Minimum 3 input values required including temperature"
        }), 400

    defaults = {
        "N": 50,
        "P": 50,
        "K": 50,
        "temperature": 25,
        "humidity": 60,
        "ph": 6.5,
        "rainfall": 100
    }

    for key in defaults:
        if key not in data:
            data[key] = defaults[key]

    try:
        input_data = np.array([[
            float(data["N"]),
            float(data["P"]),
            float(data["K"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        ]])

        probabilities = model.predict_proba(input_data)[0]
        classes = model.classes_

        crop_probs = list(zip(classes, probabilities))
        crop_probs.sort(key=lambda x: x[1], reverse=True)

        top_crops = crop_probs[:5]

        return jsonify({
            "success": True,
            "recommendations": [
                {
                    "crop": crop,
                    "confidence": round(float(prob) * 100, 2)
                }
                for crop, prob in top_crops
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)