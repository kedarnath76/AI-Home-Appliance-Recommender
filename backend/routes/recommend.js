const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/', verifyToken, async (req, res) => {
  try {
    const { category, budget, room_size, energy_pref, brand_pref, usage_pattern, city } = req.body;

    if (!category || !budget) {
      return res.status(400).json({ error: 'Missing required fields: category or budget.' });
    }

    const systemPrompt = `You are an expert home appliance advisor in India.
Return ONLY valid JSON — no markdown, no explanation.
Schema: { 
  "recommendations": [ 
    { 
      "name": "...", 
      "brand": "...", 
      "year": "2024",
      "price_range": "...", 
      "energy_rating": 5, 
      "units_per_year": "...",
      "pros": ["..."], 
      "cons": ["..."], 
      "why_recommended": "..." 
    } 
  ] 
}`;

    const userPrompt = `I need a ${category} for a ${room_size || 'standard'} room, budget ₹${budget}, prefer ${energy_pref || 'any'} energy, brand: ${brand_pref || 'any'}. Usage pattern: ${usage_pattern || 'moderate'}. City/Climate: ${city || 'general India'}. Recommend top 3 options.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No content in Groq response");
    }

    const jsonResponse = JSON.parse(responseContent);
    res.json(jsonResponse);
  } catch (error) {
    console.error('Error in /api/recommend:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations from AI.' });
  }
});

module.exports = router;
