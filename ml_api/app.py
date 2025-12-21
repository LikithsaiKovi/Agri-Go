from flask import Flask, request, jsonify
import numpy as np
import pickle

app = Flask(__name__)

# Dummy weather model (replace with real model loading)
try:
    with open('weather_model.pkl', 'rb') as f:
        weather_model = pickle.load(f)
except Exception:
    weather_model = None

# Image model removed - not needed for yield prediction

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
    # Image classification endpoint (requires PIL and TensorFlow - disabled for now)
    return jsonify({
        'success': False,
        'error': 'Image classification not available. Install tensorflow and pillow to enable.'
    }), 501

@app.route('/predict-yield', methods=['POST'])
def predict_yield():
    """
    Predict crop yield based on environmental and agricultural parameters.
    Expected JSON payload:
    {
        "crop": "wheat",
        "area": 10.5,  # in hectares
        "temperature": 25,  # celsius
        "rainfall": 800,  # mm
        "soil_type": "loamy",
        "fertilizer": 150,  # kg/hectare
        "irrigation": "drip"  # drip, sprinkler, flood
    }
    """
    try:
        data = request.json
        
        # Extract parameters with defaults
        crop = data.get('crop', 'wheat').lower()
        area = float(data.get('area', 1.0))
        temperature = float(data.get('temperature', 25))
        rainfall = float(data.get('rainfall', 600))
        soil_type = data.get('soil_type', 'loamy').lower()
        fertilizer = float(data.get('fertilizer', 100))
        irrigation = data.get('irrigation', 'drip').lower()
        
        # ML-based prediction logic (replace with actual trained model)
        # For now, using a sophisticated heuristic model based on agronomic principles
        
        # Base yields (tons/hectare) for different crops under optimal conditions
        base_yields = {
            'wheat': 4.5,
            'rice': 5.0,
            'maize': 6.0,
            'corn': 6.0,
            'soybean': 3.0,
            'cotton': 2.5,
            'sugarcane': 70.0,
            'potato': 25.0,
            'tomato': 40.0,
            'millet': 2.0,
            'barley': 4.0
        }
        
        base_yield = base_yields.get(crop, 3.5)
        
        # Temperature factor (optimal ranges vary by crop)
        temp_optimal = {'wheat': 22, 'rice': 28, 'maize': 25, 'corn': 25, 'soybean': 25}
        optimal_temp = temp_optimal.get(crop, 24)
        temp_factor = 1.0 - (abs(temperature - optimal_temp) / 30) * 0.3
        temp_factor = max(0.5, min(1.0, temp_factor))
        
        # Rainfall factor
        rainfall_optimal = {'wheat': 600, 'rice': 1200, 'maize': 700, 'corn': 700}
        optimal_rainfall = rainfall_optimal.get(crop, 700)
        rainfall_factor = 1.0 - (abs(rainfall - optimal_rainfall) / 1000) * 0.25
        rainfall_factor = max(0.6, min(1.1, rainfall_factor))
        
        # Soil type factor
        soil_factors = {
            'loamy': 1.0,
            'clay': 0.85,
            'sandy': 0.75,
            'silt': 0.9,
            'black': 0.95,
            'red': 0.8
        }
        soil_factor = soil_factors.get(soil_type, 0.85)
        
        # Fertilizer factor (diminishing returns)
        fertilizer_factor = 0.8 + (fertilizer / 200) * 0.25
        fertilizer_factor = min(1.15, fertilizer_factor)
        
        # Irrigation factor
        irrigation_factors = {
            'drip': 1.1,
            'sprinkler': 1.05,
            'flood': 0.9,
            'rainfed': 0.8
        }
        irrigation_factor = irrigation_factors.get(irrigation, 1.0)
        
        # Calculate yield per hectare
        yield_per_hectare = (base_yield * temp_factor * rainfall_factor * 
                            soil_factor * fertilizer_factor * irrigation_factor)
        
        # Add realistic variation (±5%)
        variation = np.random.uniform(-0.05, 0.05)
        yield_per_hectare *= (1 + variation)
        
        # Total yield
        total_yield = yield_per_hectare * area
        
        # Confidence score based on parameter quality
        confidence = (temp_factor * 0.3 + rainfall_factor * 0.3 + 
                     soil_factor * 0.2 + irrigation_factor * 0.2)
        confidence = min(0.95, confidence)
        
        # Generate recommendations
        recommendations = []
        if temp_factor < 0.8:
            if temperature > optimal_temp + 5:
                recommendations.append("Temperature is higher than optimal. Consider shade nets or adjust planting season.")
            else:
                recommendations.append("Temperature is lower than optimal. Consider greenhouse or delayed planting.")
        
        if rainfall_factor < 0.85:
            if rainfall < optimal_rainfall * 0.8:
                recommendations.append("Insufficient rainfall predicted. Increase irrigation frequency.")
            else:
                recommendations.append("Excess rainfall expected. Ensure proper drainage.")
        
        if fertilizer < 80:
            recommendations.append("Consider increasing fertilizer application for better yields.")
        elif fertilizer > 200:
            recommendations.append("Fertilizer usage is high. Monitor for nutrient burn and environmental impact.")
        
        if irrigation == 'flood':
            recommendations.append("Switch to drip irrigation to improve water efficiency by 30-40%.")
        
        # Risk factors
        risk_level = "Low"
        if temp_factor < 0.7 or rainfall_factor < 0.7:
            risk_level = "High"
        elif temp_factor < 0.85 or rainfall_factor < 0.85:
            risk_level = "Medium"
        
        return jsonify({
            'success': True,
            'crop': crop.title(),
            'area_hectares': round(area, 2),
            'yield_per_hectare': round(yield_per_hectare, 2),
            'total_yield_tons': round(total_yield, 2),
            'total_yield_kg': round(total_yield * 1000, 0),
            'confidence': round(confidence, 2),
            'risk_level': risk_level,
            'factors': {
                'temperature_impact': round(temp_factor * 100, 1),
                'rainfall_impact': round(rainfall_factor * 100, 1),
                'soil_impact': round(soil_factor * 100, 1),
                'fertilizer_impact': round(fertilizer_factor * 100, 1),
                'irrigation_impact': round(irrigation_factor * 100, 1)
            },
            'recommendations': recommendations if recommendations else ["Conditions are optimal. Maintain current practices."]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/')
def home():
    return 'ML API is running!'

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
