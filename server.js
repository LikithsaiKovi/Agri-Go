

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route to connect to ML API for weather prediction
app.post('/get-weather', async (req, res) => {
  try {
    const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:5000';
    const response = await axios.post(`${ML_API_URL}/predict-weather`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('ML API error:', err.message);
    // Fallback: Return mock prediction if ML API is unavailable
    const { temperature = 25, humidity = 80, pressure = 1012 } = req.body;
    let desc, advice;
    
    if (temperature > 30 && humidity < 50) {
      desc = "Hot and Dry";
      advice = "Irrigate crops and provide shade for livestock.";
    } else if (humidity > 80) {
      desc = "Humid, Possible Rain";
      advice = "Monitor for fungal diseases and drainage.";
    } else if (temperature < 15) {
      desc = "Cool Weather";
      advice = "Protect sensitive crops from cold.";
    } else {
      desc = "Mild Weather";
      advice = "Good conditions for most crops.";
    }
    
    res.json({
      forecast: 0.5,
      description: desc,
      advice: advice
    });
  }
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Routes
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/recommend-crop', require('./routes/crop'));
app.use('/api/iot-data', require('./routes/iot'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/chatbot', require('./routes/chatbot'));

const path = require('path');

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Server start
const PORT = process.env.PORT || 5050;
app.get('/test', (req, res) => {
  res.send('Test route working ✅');
});
app.get('/', (req, res) => {
  res.send('✅ AgriAI Backend is Running');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
