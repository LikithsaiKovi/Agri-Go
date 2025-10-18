## Features
- Weather prediction and crop recommendation using ML
- AI-powered chatbot (Grok cloud)
- Newsletter subscription
- Success stories and educational content

## Prerequisites
- Node.js (v16+ recommended)
- Python 3.8+
- MongoDB Atlas account (or local MongoDB)
- Grok Cloud API key

## Setup Instructions

### 1. Clone the Repository
```
git clone https://github.com/LikithsaiKovi/Agri-AI.git
cd Agri-AI
```

### 2. Install Node.js Dependencies
```
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with the following (fill in your values):
```
MONGODB_URI=your-mongodb-url
PORT=5050
GROK_API_KEY=your-grok-api-key
```

### 4. Set Up the ML API (Python)
```
cd ml_api
pip install -r requirements.txt
python app.py
```
- The ML API will run on `http://127.0.0.1:5050` by default.

### 5. Start the Node.js Backend
In a new terminal, from the project root:
```
node server.js
```
- The backend will run on `http://localhost:5050` by default.

### 6. Access the Website
Open your browser and go to:
```
http://localhost:5050
```

## Usage
- Use the weather prediction form to get crop recommendations.
- Chat with the AgriAI bot for farming advice.
- Subscribe to the newsletter for updates.

## Notes
- Make sure both the Node.js server and the ML API are running.
- Place crop images in `public/images/` as described in the code for best results.
- For production, use environment variables securely and consider deploying on cloud platforms.

## Troubleshooting
- If you see connection errors, check that both servers are running and ports match the code.
- For MongoDB issues, verify your URI and network access.
- For OpenAI errors, check your API key and usage limits.
