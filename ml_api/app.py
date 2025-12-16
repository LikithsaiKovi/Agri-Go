from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from PIL import Image
import io
import tensorflow as tf
import pickle

app = Flask(__name__)

# Dummy weather model (replace with real model loading)
try:
    with open('weather_model.pkl', 'rb') as f:
        weather_model = pickle.load(f)
except Exception:
    weather_model = None

# Dummy image model (replace with real model loading)
try:
    image_model = tf.keras.models.load_model('image_model.h5')
except Exception:
    image_model = None

@app.route('/predict-weather', methods=['POST'])
def predict_weather():
    data = request.json
    temp = float(data.get('temperature', 25))
    humidity = float(data.get('humidity', 80))
    pressure = float(data.get('pressure', 1012))
    features = np.array([[temp, humidity, pressure]])
    if weather_model:
        prediction = weather_model.predict(features)
        forecast = float(prediction[0])
    else:
        forecast = 0.5

    # Add simple logic for description and advice
    if temp > 30 and humidity < 50:
        desc = "Hot and Dry"
        advice = "Irrigate crops and provide shade for livestock."
    elif humidity > 80:
        desc = "Humid, Possible Rain"
        advice = "Monitor for fungal diseases and drainage."
    elif temp < 15:
        desc = "Cool Weather"
        advice = "Protect sensitive crops from cold."
    else:
        desc = "Mild Weather"
        advice = "Good conditions for most crops."

    return jsonify({
        'forecast': forecast,
        'description': desc,
        'advice': advice,
        'temperature': temp,
        'humidity': humidity,
        'pressure': pressure
    })

@app.route('/classify-image', methods=['POST'])
def classify_image():
    # Expects an image file in the POST request
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    img = Image.open(file.stream).resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    if image_model:
        preds = image_model.predict(img_array)
        class_idx = int(np.argmax(preds))
        confidence = float(np.max(preds))
        return jsonify({'class': class_idx, 'confidence': confidence})
    else:
        # Dummy response
        return jsonify({'class': 0, 'confidence': 0.5})

@app.route('/')
def home():
    return 'ML API is running!'

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
