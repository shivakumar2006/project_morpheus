import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import joblib
import os

# Get absolute path of current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build correct path to CSV
csv_path = os.path.join(BASE_DIR, "..", "crop_recommendation", "Crop_recommendation.csv")

# Load dataset
data = pd.read_csv(csv_path)

# input and output separate
X = data.drop("label", axis=1)
y = data["label"]

# model create
model = RandomForestClassifier()

# train model
model.fit(X, y)

# save model
model_path = os.path.join(BASE_DIR, "..", "model.pkl")
joblib.dump(model, model_path)

print("Model trained successfully")