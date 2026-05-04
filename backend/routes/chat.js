const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: 0, name: 'Guest', email: 'guest@example.com' };
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    req.user = { id: 0, name: 'Guest', email: 'guest@example.com' };
    next();
  }
};

router.post('/', verifyToken, async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemPrompt = "You are an expert Indian home appliance advisor. Answer concisely. Format prices in ₹.";
    
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    res.json({ content: responseContent });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    if (error.response) {
      console.error('Groq Response Error:', error.response.data);
    }
    res.status(500).json({ 
      error: 'Failed to get response from AI.',
      details: error.message 
    });
  }
});

module.exports = router;
