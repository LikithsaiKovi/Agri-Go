const express = require('express');
const router = express.Router();
const axios = require('axios');

// Hugging Face API key (set your key in .env as HUGGINGFACE_API_KEY)
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
// Use a more reliable open conversational model (e.g., google/gemma-7b-it)
const HF_MODEL = 'deepseek-ai/Janus-Pro-7B';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  if (!HUGGINGFACE_API_KEY) return res.status(500).json({ error: 'Hugging Face API key not set' });

  try {
    const hfRes = await axios.post(
      HF_API_URL,
      { inputs: message },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // The response format may vary by model; adjust as needed
    const reply = Array.isArray(hfRes.data) && hfRes.data[0]?.generated_text
      ? hfRes.data[0].generated_text
      : (hfRes.data.generated_text || JSON.stringify(hfRes.data));
    res.json({ reply });
  } catch (err) {
    console.error('❌ Hugging Face API error:', err.response?.data || err.message || err);
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error || 'Hugging Face AI failed to respond'
    });
  }
});

module.exports = router;
