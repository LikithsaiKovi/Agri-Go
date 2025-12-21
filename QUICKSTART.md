# 🚀 Quick Start - Crop Yield Integration

## Fast Setup (3 Steps)

### 1️⃣ Install Dependencies
```bash
# Python packages (if not installed)
pip install flask numpy pandas pillow tensorflow

# Node packages (if not installed)
npm install
```

### 2️⃣ Start Services

**Option A: PowerShell (Windows)**
```powershell
# Terminal 1 - ML API
cd ml_api
python app.py

# Terminal 2 - Node Backend (new terminal)
cd ..
npm start
```

**Option B: Using VS Code**
1. Open integrated terminal
2. Split terminal (Ctrl+Shift+5)
3. Terminal 1: `cd ml_api && python app.py`
4. Terminal 2: `npm start`

### 3️⃣ Test It!

Open browser: `http://localhost:5050`

**Try these queries in the chatbot:**

```
✅ "What yield can I expect from 10 hectares of wheat?"

✅ "I have 15 hectares of rice with loamy soil, 28°C temperature, 
   1200mm rainfall, and drip irrigation. What's my production?"

✅ "Compare expected yield between maize and wheat for 20 hectares"

✅ "How much corn will I get from 12 hectares with sandy soil?"
```

## 🧪 Test Scripts

**Test ML API Only:**
```bash
python test_ml_api.py
```

**Test Full Integration:**
```bash
node test_integration.js
```

## 📊 Expected Output

When you ask: *"What yield from 10 hectares of wheat?"*

The chatbot will:
1. ✅ Detect it's a yield query
2. ✅ Extract parameters (crop: wheat, area: 10)
3. ✅ Call ML API
4. ✅ Get prediction (e.g., 45-50 tons)
5. ✅ Generate comprehensive AI response with:
   - Predicted yield numbers
   - Confidence score
   - Risk assessment
   - Factor analysis
   - Actionable recommendations

## 🔍 Verify Integration

**Check ML API is running:**
```bash
curl http://localhost:5000/predict-yield -X POST -H "Content-Type: application/json" -d "{\"crop\":\"wheat\",\"area\":10}"
```

Expected: JSON with prediction data

**Check Node Backend:**
```bash
curl http://localhost:5050/api/predict-yield -X POST -H "Content-Type: application/json" -d "{\"crop\":\"wheat\",\"area\":10}"
```

Expected: Same JSON (proxied from ML API)

## ⚠️ Troubleshooting

**"Connection refused" error:**
- Make sure ML API is running on port 5000
- Check no firewall blocking localhost connections

**"ML API is unavailable":**
- Verify Python Flask server started successfully
- Check `ML_API_URL` in `.env` file

**Chatbot not showing ML data:**
- Include yield keywords: "yield", "production", "harvest"
- Mention crop name in your query
- Check browser console for errors

## ✨ Features Enabled

After setup, your chatbot can:
- 🌾 Predict crop yields with ML accuracy
- 📊 Analyze 5 environmental factors
- 🎯 Provide confidence scores
- ⚠️ Assess risk levels
- 💡 Give actionable recommendations
- 📈 Compare different scenarios

## 📚 Documentation

- **Full Guide**: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Test Details**: [TEST_YIELD_INTEGRATION.md](TEST_YIELD_INTEGRATION.md)
- **API Docs**: Check Flask logs for endpoint details

## 🎉 Success Indicators

You'll know it's working when:
- ✅ ML API shows: `Running on http://127.0.0.1:5000`
- ✅ Node backend shows: `Server running on port 5050`
- ✅ Chatbot responds with specific yield numbers (not just generic advice)
- ✅ Response includes "Predicted Yield", "Confidence", "Risk Level"
- ✅ Console logs show: "🌾 Yield query detected, calling ML API..."

---

**Ready to go! 🚀**

Questions? Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed docs.
