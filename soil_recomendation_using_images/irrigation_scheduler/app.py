from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from irrigation_scheduler.agent import crop_irrigation_agent

app = Flask(__name__)

# ✅ Enable CORS for frontend (Vite runs on 5173)
CORS(app, origins=["http://localhost:5173"])

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def home():
    return "🌱 Crop Irrigation AI Agent is Running!"


@app.route("/predict", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    result = crop_irrigation_agent(filepath)

    return jsonify({
        "success": True,
        "data": result
    })


if __name__ == "__main__":
    app.run(debug=True, port=5001)