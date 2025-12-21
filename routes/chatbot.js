const express = require('express');
const router = express.Router();
const axios = require('axios');

// ML API URL
const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:5000';

// Use Groq as default provider (much faster and cheaper than OpenAI)
const MODEL_NAME = process.env.MODEL_NAME || 'mixtral-8x7b-32768';
const GROQ_API_KEY = process.env.GROK_API_KEY || process.env.GROQ_API_KEY; // Support both env var names
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1';

// Function to detect if user is asking about crop yield prediction
function detectYieldQuery(message) {
  const yieldKeywords = [
    'yield', 'production', 'harvest', 'how much will i get', 'how much can i produce',
    'expected output', 'crop output', 'ton', 'kg', 'quintals', 'estimate',
    'predict my yield', 'production estimate', 'how much will grow'
  ];
  
  const messageLower = message.toLowerCase();
  return yieldKeywords.some(keyword => messageLower.includes(keyword));
}

// Function to extract yield parameters from user message
function extractYieldParams(message) {
  const params = {};
  const messageLower = message.toLowerCase();
  
  // Extract crop type
  const crops = ['wheat', 'rice', 'maize', 'corn', 'soybean', 'cotton', 'sugarcane', 'potato', 'tomato', 'millet', 'barley'];
  for (const crop of crops) {
    if (messageLower.includes(crop)) {
      params.crop = crop;
      break;
    }
  }
  
  // Extract area (hectares or acres)
  const areaMatch = messageLower.match(/(\d+\.?\d*)\s*(hectare|hectares|acre|acres|ha)/i);
  if (areaMatch) {
    let area = parseFloat(areaMatch[1]);
    if (areaMatch[2].toLowerCase().includes('acre')) {
      area = area * 0.404686; // Convert acres to hectares
    }
    params.area = area;
  }
  
  // Extract temperature
  const tempMatch = messageLower.match(/(\d+\.?\d*)\s*(°c|celsius|degrees)/i);
  if (tempMatch) {
    params.temperature = parseFloat(tempMatch[1]);
  }
  
  // Extract rainfall
  const rainfallMatch = messageLower.match(/(\d+)\s*mm/i);
  if (rainfallMatch) {
    params.rainfall = parseFloat(rainfallMatch[1]);
  }
  
  // Extract soil type
  const soilTypes = ['loamy', 'clay', 'sandy', 'silt', 'black', 'red'];
  for (const soil of soilTypes) {
    if (messageLower.includes(soil)) {
      params.soil_type = soil;
      break;
    }
  }
  
  // Extract irrigation type
  const irrigationTypes = ['drip', 'sprinkler', 'flood', 'rainfed'];
  for (const irrigation of irrigationTypes) {
    if (messageLower.includes(irrigation)) {
      params.irrigation = irrigation;
      break;
    }
  }
  
  return params;
}

// Function to call ML API for yield prediction
async function getPrediction(params) {
  try {
    const response = await axios.post(`${ML_API_URL}/predict-yield`, params, {
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('ML API error:', error.message);
    return null;
  }
}

// Function to format response with clean table structure
function formatResponse(text) {
  if (!text) return text;
  
  let formatted = text.replace(/\*\*/g, '').replace(/##/g, '');

  // Process tables
  const tableRegex = /\|(.*\|)+\n(\|[-\s|]+\n)?(\|.*\|(\n|$))+/g;
  const tables = formatted.match(tableRegex) || [];
  
  tables.forEach(table => {
    const rows = table.trim().split('\n');
    const processedRows = [];
    
    // Calculate maximum width for each column
    const maxWidths = [];
    rows.forEach(row => {
      const cells = row.split('|').filter(cell => cell.trim());
      cells.forEach((cell, i) => {
        maxWidths[i] = Math.max(maxWidths[i] || 0, cell.trim().length);
      });
    });
    
    // Process each row
    rows.forEach((row, rowIndex) => {
      if (!row.trim()) return;
      
      const cells = row.split('|').filter(cell => cell.trim());
      const processedCells = cells.map((cell, i) => cell.trim().padEnd(maxWidths[i]));
      const processedRow = '| ' + processedCells.join(' | ') + ' |';
      
      // Add separator after header
      if (rowIndex === 0) {
        processedRows.push(processedRow);
        const separator = '|' + maxWidths.map(w => '-'.repeat(w + 2)).join('|') + '|';
        processedRows.push(separator);
      } else {
        processedRows.push(processedRow);
      }
    });
    
    formatted = formatted.replace(table, processedRows.join('\n') + '\n\n');
  });

  // Format lists with proper markdown
  formatted = formatted.replace(/^[-*•]\s*/gm, '* ');
  formatted = formatted.replace(/^(\d+)\.\s*/gm, '$1. ');

  // Bold important terms
  formatted = formatted.replace(/\b(Temperature|Water Needs|Days to Harvest|Soil Type|pH|Growing Season)\b/g, '**$1**');
  
  // Format value ranges and units
  formatted = formatted.replace(/(\d+)[-–](\d+)(°C|mm|days)/g, '`$1-$2$3`');
  formatted = formatted.replace(/(\d+)(°C|mm|days)/g, '`$1$3`');

  // Add proper spacing
  formatted = formatted.split('\n\n').map(section => {
    if (section.startsWith('## ')) {
      // Section headers
      return '\n' + section;
    } else if (section.includes('|')) {
      // Tables
      return section;
    } else if (section.match(/^[*\d]/m)) {
      // Lists
      return section;
    }
    return section;
  }).join('\n\n');

  // Clean up
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  formatted = formatted.trim();

  return formatted;
}

const systemPrompt = `You are an **Agricultural Expert Assistant** designed to support farmers, agripreneurs, and researchers with accurate, context-based agricultural advice.

Follow these strict guidelines:

1. **Response Format**
   - **Crop-specific questions:** Include growing conditions, soil type, pH, ideal temperature, rainfall/irrigation, and sowing–harvest duration.
   - **Problem-solving questions:** Provide a step-by-step diagnosis and action plan (use bullet points).
   - **General knowledge or conceptual questions:** Give concise, factual explanations with key points.
   - **Comparative data:** Use a markdown table only when comparing crops, methods, or conditions.
   - **Format dynamically:** Match your structure to the question type (e.g., bullet points for actions, paragraph for explanation).

2. **Content Guidelines**
   - Give **precise, scientifically valid information** (include numbers where possible — °C, mm/week, pH, days to maturity).
   - Provide **actionable recommendations**, not just definitions.
   - When relevant, mention underlying **agronomic principles** (e.g., nitrogen fixation, evapotranspiration, pest life cycles).
   - Avoid generic text — each answer must be **directly relevant** to the question asked.

3. **Data Formatting Rules**
   - Highlight key terms with **bold**.
   - Use backticks for all numeric values, units, or ranges.
   - Always specify measurement units clearly and consistently.
   - Keep the response visually clean with logical spacing.

4. **Tone & Focus**
   - Be clear, confident, and concise.
   - Write as a **professional agronomist**, not a chatbot.
   - Focus on **what the user can do now** rather than generic theory.

5. **Response Behavior**
   - Always answer exactly what the user asked — no off-topic elaboration.
   - Do not repeat or restate the question.
   - Adapt structure and detail depth automatically based on the user's intent.

Your goal: Deliver **high-impact, data-driven, and field-practical agricultural advice** that can be immediately applied by a farmer or agritech user.`;

// Language-specific instructions
const languageInstructions = {
  'en': '',
  'te': '\n\n**IMPORTANT: Respond ENTIRELY in Telugu (తెలుగు). Use Telugu script for all text including numbers, units, and technical terms. Maintain the same professional quality and formatting.**',
  'hi': '\n\n**IMPORTANT: Respond ENTIRELY in Hindi (हिंदी). Use Devanagari script for all text including numbers, units, and technical terms. Maintain the same professional quality and formatting.**',
  'ta': '\n\n**IMPORTANT: Respond ENTIRELY in Tamil (தமிழ்). Use Tamil script for all text including numbers, units, and technical terms. Maintain the same professional quality and formatting.**',
  'kn': '\n\n**IMPORTANT: Respond ENTIRELY in Kannada (ಕನ್ನಡ). Use Kannada script for all text including numbers, units, and technical terms. Maintain the same professional quality and formatting.**',
  'mr': '\n\n**IMPORTANT: Respond ENTIRELY in Marathi (मराठी). Use Devanagari script for all text including numbers, units, and technical terms. Maintain the same professional quality and formatting.**'
};

// Handle POST requests
router.post('/', async (req, res) => {
  const { message, history = [], language = 'en' } = req.body;

  console.log('📨 Message received:', message);
  console.log('🔧 Provider: Groq, Model:', MODEL_NAME);

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured. Set GROQ_API_KEY environment variable');
    }
    
    // Check if this is a yield prediction query
    let mlPrediction = null;
    let enhancedMessage = message;
    
    if (detectYieldQuery(message)) {
      console.log('🌾 Yield query detected, calling ML API...');
      const params = extractYieldParams(message);
      mlPrediction = await getPrediction(params);
      
      if (mlPrediction && mlPrediction.success) {
        console.log('✅ ML prediction received:', mlPrediction);
        // Enhance the message with ML prediction data for Groq to incorporate
        enhancedMessage = `${message}\n\n[ML Model Prediction Data - Use this to enhance your response]:\n` +
          `- Crop: ${mlPrediction.crop}\n` +
          `- Area: ${mlPrediction.area_hectares} hectares\n` +
          `- Predicted Yield: ${mlPrediction.total_yield_tons} tons (${mlPrediction.total_yield_kg} kg)\n` +
          `- Yield per Hectare: ${mlPrediction.yield_per_hectare} tons/ha\n` +
          `- Confidence: ${(mlPrediction.confidence * 100).toFixed(0)}%\n` +
          `- Risk Level: ${mlPrediction.risk_level}\n` +
          `- Impact Factors: Temperature ${mlPrediction.factors.temperature_impact}%, ` +
          `Rainfall ${mlPrediction.factors.rainfall_impact}%, ` +
          `Soil ${mlPrediction.factors.soil_impact}%\n` +
          `- Recommendations: ${mlPrediction.recommendations.join('; ')}\n\n` +
          `Please provide a comprehensive agricultural response that incorporates this ML prediction data. ` +
          `Format the prediction results clearly with the yield numbers, confidence level, and actionable recommendations.`;
      }
    }

    const sanitizedHistory = Array.isArray(history)
      ? history
          .filter(h => h && typeof h.content === 'string' && (h.role === 'user' || h.role === 'assistant'))
          .slice(-20) // cap history to avoid token bloat
      : [];

    // Get language-specific system prompt
    const languageInstruction = languageInstructions[language] || '';
    const finalSystemPrompt = systemPrompt + languageInstruction;
    
    console.log('🌐 Selected language:', language);

    const payload = {
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: finalSystemPrompt },
        ...sanitizedHistory,
        { role: 'user', content: enhancedMessage }
      ],
      temperature: 0.85,
      max_tokens: 2500
    };

    const groqResp = await axios.post(`${GROQ_API_URL}/chat/completions`, payload, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    let reply = '';
    if (groqResp.data?.choices?.[0]?.message?.content) {
      reply = formatResponse(groqResp.data.choices[0].message.content);
    }

    console.log('✅ Groq replied');
    return res.json({ reply });
  } catch (err) {
    console.error('❌ Chatbot error:', err.response?.data || err.message || err);
    const status = err.response?.status || 500;
    const msg = err.response?.data?.error?.message || err.message || 'AI failed to respond';
    return res.status(status).json({ error: msg });
  }
});
module.exports = router;