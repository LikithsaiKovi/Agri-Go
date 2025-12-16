# 🌾 Agri-AI: Smart Agricultural Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://agrigo.in)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)

> An AI-powered agricultural platform providing real-time crop insights, weather predictions, and intelligent farming recommendations to empower farmers with data-driven decision-making.

## 🎯 Problem Statement

Modern agriculture faces critical challenges:
- ❌ Lack of real-time, data-driven crop recommendations
- ❌ Limited access to expert agricultural advice for small-scale farmers
- ❌ Poor weather prediction leading to crop failures
- ❌ Insufficient IoT integration for precision farming

## ✨ Our Solution

**Agri-AI** is a comprehensive smart farming platform that leverages:
- 🤖 **AI-Powered Chatbot** - 24/7 expert agricultural advice using Groq LLM
- 🌤️ **Weather Prediction** - ML-based forecasting for informed planting decisions
- 🌱 **Crop Recommendation System** - Soil & climate analysis for optimal crop selection
- 📊 **IoT Dashboard** - Real-time monitoring of temperature, humidity, and soil moisture
- 📰 **Knowledge Base** - Educational resources and farming best practices

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (HTML/CSS/JS)                    │
│              - Responsive UI with Dark/Light Mode                │
│              - Real-time Charts & Data Visualization             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Node.js Backend (Express.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Chatbot API │  │  Crop Rec.   │  │  Weather Forecast  │   │
│  │  (Groq LLM)  │  │    Logic     │  │     Module         │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   IoT Data   │  │  Newsletter  │                            │
│  │  Management  │  │   Service    │                            │
│  └──────────────┘  └──────────────┘                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌─────────────────┐   ┌──────────────┐
│   MongoDB    │   │   Python ML API │   │  Groq Cloud  │
│    Atlas     │   │   (Flask/TF)    │   │   LLM API    │
│              │   │                 │   │              │
│ - User Data  │   │ - Weather Model │   │ - GPT Model  │
│ - IoT Logs   │   │ - Crop Predict. │   │ - Chat Logic │
│ - Newsletter │   │ - Image Recog.  │   │              │
└──────────────┘   └─────────────────┘   └──────────────┘
```

---

## 🚀 Key Features

### 1. 🤖 AI Agricultural Assistant
- **Real-time Expert Advice**: Powered by Groq's Mixtral-8x7B LLM
- **Context-Aware Responses**: Understands farming terminology and regional practices
- **Instant Solutions**: Get answers on pest control, soil management, irrigation, etc.

### 2. 🌦️ Smart Weather Forecasting
- **ML-Based Predictions**: TensorFlow models for accurate weather forecasts
- **Risk Alerts**: Early warnings for adverse weather conditions
- **Planning Support**: Data-driven planting and harvesting schedules

### 3. 🌾 Intelligent Crop Recommendations
- **Soil Analysis**: pH, moisture, and nutrient-based suggestions
- **Climate Matching**: Region-specific crop suitability assessment
- **Yield Optimization**: Recommendations for maximum productivity

### 4. 📊 IoT Monitoring Dashboard
- **Real-Time Sensors**: Temperature, humidity, soil moisture tracking
- **Historical Trends**: Visualize data patterns over time
- **Automated Alerts**: Notifications for critical thresholds

### 5. 📰 Knowledge Hub
- **Educational Resources**: Articles, guides, and best practices
- **Success Stories**: Learn from other farmers' experiences
- **Newsletter**: Stay updated with latest agricultural tech trends

---

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3** - Responsive design with custom animations
- **Vanilla JavaScript** - No framework overhead, optimized performance
- **Chart.js** - Real-time data visualization
- **Markdown-it** - Rich text rendering for chatbot responses

### Backend
- **Node.js + Express.js** - RESTful API architecture
- **MongoDB Atlas** - Cloud database for scalability
- **Mongoose** - ODM for elegant data modeling
- **Axios** - HTTP client for external API calls

### ML & AI
- **Python 3.9 + Flask** - Microservice for ML predictions
- **TensorFlow** - Deep learning models for weather/crop analysis
- **Groq Cloud API** - Ultra-fast LLM inference (Mixtral-8x7B)
- **Gunicorn** - Production-ready WSGI server

### DevOps
- **Railway** - Cloud deployment platform
- **Docker** - Containerization for ML API
- **Git/GitHub** - Version control and CI/CD

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB Atlas account
- Groq API key ([Get one free](https://console.groq.com))

### 1. Clone Repository
```bash
git clone https://github.com/LikithsaiKovi/Agri-AI.git
cd Agri-AI
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root:
```env
MONGODB_URI=your-mongodb-url
PORT=8080
GROK_API_KEY=your-groq-api-key
GROQ_API_URL=https://api.groq.com/openai/v1
MODEL_NAME=mixtral-8x7b-32768
ML_API_URL=http://localhost:5000
```

### 4. Set Up the ML API (Optional)
```bash
cd ml_api
pip install -r requirements.txt
python app.py
```
- The ML API will run on `http://127.0.0.1:5000` by default.

### 5. Start the Node.js Backend
```bash
npm start
```
- The backend will run on `http://localhost:8080` by default.

### 6. Access the Website
Open your browser and go to:
```
http://localhost:8080
```

---

## 🌐 Live Deployment

**Production URL**: [https://agrigo.in](https://agrigo.in)

### Deployment Architecture (Railway)

**Main Backend:**
- URL: `https://agrigo.in`
- Server: Node.js on Railway
- Database: MongoDB Atlas

**ML API:**
- URL: `https://endearing-spontaneity-production.up.railway.app/`
- Server: Docker container on Railway
- Runtime: Python 3.9 + Gunicorn

### Environment Variables (Production)
```env
MONGODB_URI=mongodb+srv://Agriculture:****@agribackend.vic1app.mongodb.net/
GROK_API_KEY=gsk_****
GROQ_API_URL=https://api.groq.com/openai/v1
MODEL_NAME=openai/gpt-oss-20b
ML_API_URL=https://endearing-spontaneity-production.up.railway.app/
PORT=8080
```

---

## 📊 Project Impact

### Metrics
- ⚡ **<1s Response Time** - Ultra-fast AI chatbot responses via Groq
- 🌍 **24/7 Availability** - Always-on agricultural assistance
- 📈 **Scalable Architecture** - Cloud-native design for growth
- 💰 **Cost-Effective** - Free tier APIs for sustainable operation

### Target Users
1. **Small-scale Farmers** - Access to expert advice without consultants
2. **Agritech Startups** - API integration for farming applications
3. **Agricultural Students** - Learning platform with real-time data
4. **Research Institutes** - Data collection and analysis tools

---

## 🔧 API Endpoints

### Chatbot
```http
POST /api/chatbot
Content-Type: application/json

{
  "message": "What's the best fertilizer for rice crops?"
}
```

### Crop Recommendation
```http
POST /api/recommend-crop
Content-Type: application/json

{
  "soil": "loamy",
  "climate": "tropical"
}
```

### IoT Data
```http
GET /api/iot-data

Response: {
  "temperature": 28.5,
  "humidity": 65.2,
  "soilMoisture": 42.8
}
```

### Newsletter
```http
POST /api/newsletter
Content-Type: application/json

{
  "email": "farmer@example.com"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Integration with government agricultural APIs
- [ ] Drone imagery analysis for crop health
- [ ] Marketplace for direct farmer-to-consumer sales
- [ ] Blockchain-based supply chain tracking

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for farmers worldwide 🌾

</div>
