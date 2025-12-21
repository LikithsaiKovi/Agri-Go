# 🌐 Multi-Language Support for AgriAI Chatbot

## Overview

The AgriAI chatbot now supports **6 languages** to serve farmers across India in their native languages!

## Supported Languages

| Language | Script | Code |
|----------|--------|------|
| English | Latin | `en` |
| తెలుగు (Telugu) | Telugu | `te` |
| हिंदी (Hindi) | Devanagari | `hi` |
| தமிழ் (Tamil) | Tamil | `ta` |
| ಕನ್ನಡ (Kannada) | Kannada | `kn` |
| मराठी (Marathi) | Devanagari | `mr` |

## How to Use

### For Users:

1. **Visit the chatbot section** on the AgriAI website
2. **Select your preferred language** from the dropdown menu (🌐 Choose Language)
3. **Type your question** in any language (the input placeholder will change to match your selection)
4. **Receive response** in your selected language with full agricultural expertise

### Example Usage:

**English:**
```
Q: What is the best fertilizer for wheat?
A: For wheat cultivation, NPK fertilizer with ratio 120:60:40 kg/hectare is recommended...
```

**Telugu (తెలుగు):**
```
Q: గోధుమకు ఉత్తమమైన ఎరువు ఏమిటి?
A: గోధుమ సాగుకు, NPK ఎరువు నిష్పత్తి 120:60:40 కిలోలు/హెక్టారు సిఫార్సు చేయబడింది...
```

**Hindi (हिंदी):**
```
Q: गेहूं के लिए सबसे अच्छा उर्वरक क्या है?
A: गेहूं की खेती के लिए, NPK उर्वरक अनुपात 120:60:40 किलो/हेक्टेयर की सिफारिश की जाती है...
```

## Features

✅ **Natural Language Processing** - Understands questions in all supported languages  
✅ **Complete Translation** - Entire response including numbers, units, and technical terms  
✅ **Professional Quality** - Maintains agricultural expertise across all languages  
✅ **ML Integration** - Crop yield predictions work in all languages  
✅ **Contextual Responses** - Tables, lists, and formatting preserved  

## Technical Implementation

### Frontend (`public/app.js` & `public/index.html`)

- Language dropdown selector with native script labels
- Dynamic placeholder text based on selected language
- Language parameter sent with each chatbot request

### Backend (`routes/chatbot.js`)

- Language-specific system prompts
- Groq API configured to respond in selected language
- Maintains same data quality across all languages

### Language Instructions

The system prompt is dynamically enhanced with language-specific instructions:

```javascript
languageInstructions = {
  'en': '',  // Default, no modification
  'te': 'Respond ENTIRELY in Telugu (తెలుగు)...',
  'hi': 'Respond ENTIRELY in Hindi (हिंदी)...',
  // ... etc
}
```

## API Changes

### Chatbot Endpoint

**POST** `/api/chatbot`

**Request Body:**
```json
{
  "message": "What yield from 10 hectares?",
  "language": "te",
  "history": []
}
```

**Response:**
```json
{
  "reply": "10 హెక్టార్ల నుండి దిగుబడి: 47 టన్నులు..."
}
```

## Benefits

1. **Accessibility** - Farmers can ask questions in their mother tongue
2. **Better Understanding** - Technical advice in familiar language
3. **Wider Reach** - Serves diverse Indian farming community
4. **Cultural Context** - Responses adapted to regional practices
5. **Confidence** - Users more comfortable with native language

## Future Enhancements

Potential additions:
- [ ] More regional languages (Bengali, Punjabi, Gujarati, Odia)
- [ ] Voice input in native languages
- [ ] Regional crop variety recommendations
- [ ] State-specific agricultural schemes information
- [ ] Dialect support for major languages

## Testing

To test multi-language support:

1. Start the application
```bash
npm start
```

2. Navigate to the chatbot section
3. Select Telugu (తెలుగు) from dropdown
4. Ask: "10 హెక్టార్ల నుండి గోధుమ దిగుబడి ఎంత?"
5. Verify response is in Telugu

## Language Coverage by State

| State | Primary Language | Supported |
|-------|-----------------|-----------|
| Telangana | Telugu | ✅ |
| Andhra Pradesh | Telugu | ✅ |
| Tamil Nadu | Tamil | ✅ |
| Karnataka | Kannada | ✅ |
| Maharashtra | Marathi | ✅ |
| North India | Hindi | ✅ |
| Others | English | ✅ |

## Notes

- The chatbot uses **Groq's Mixtral model** which has excellent multilingual capabilities
- All responses maintain the same **agricultural accuracy** across languages
- **ML yield predictions** integrate seamlessly in all languages
- **Technical units** (kg, hectares, °C, mm) are properly localized

---

**Version:** 1.2.0  
**Last Updated:** December 21, 2025  
**Status:** ✅ Production Ready
