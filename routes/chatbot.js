const express = require('express');
const router = express.Router();
const axios = require('axios');

const MODEL_NAME = process.env.MODEL_NAME || 'openai/gpt-oos-120b';

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

// Handle POST requests
router.post('/', async (req, res) => {
  const { message } = req.body;

  console.log('📨 Message received:', message);
  console.log('🔧 Provider: grok, Model:', MODEL_NAME);

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const grokUrl = process.env.GROK_API_URL;
    const grokKey = process.env.GROK_API_KEY;
    
    if (!grokUrl || !grokKey) {
      throw new Error('Grok not configured. Set GROK_API_URL and GROK_API_KEY');
    }

    const payload = {
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.85,
      max_tokens: 2000
    };

    const grokResp = await axios.post(grokUrl, payload, {
      headers: {
        'Authorization': `Bearer ${grokKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    let reply = '';
    if (grokResp.data?.choices?.[0]?.message?.content) {
      reply = formatResponse(grokResp.data.choices[0].message.content);
    }

    console.log('✅ Grok replied');
    return res.json({ reply });
  } catch (err) {
    console.error('❌ Chatbot error:', err.response?.data || err.message || err);
    const status = err.response?.status || 500;
    const msg = err.response?.data?.error?.message || err.message || 'AI failed to respond';
    return res.status(status).json({ error: msg });
  }
});
module.exports = router;