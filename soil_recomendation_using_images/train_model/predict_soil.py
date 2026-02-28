import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "train_model", "soil_model.h5")

model = tf.keras.models.load_model(MODEL_PATH)

class_names = ['Black Soil', 'Cinder Soil', 'Laterite Soil', 'Peat Soil', 'Yellow Soil']

def predict_soil(img_path):

    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    prediction = model.predict(img_array)

    confidence = np.max(prediction)
    predicted_class = class_names[np.argmax(prediction)]

    if confidence < 0.75:
        return None, confidence

    return predicted_class, confidence