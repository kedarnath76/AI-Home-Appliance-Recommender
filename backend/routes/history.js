const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getDb } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';

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

router.use(verifyToken);

// Get all history for current user
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const history = await db.all('SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(history.map(row => ({
      ...row,
      recommendations: JSON.parse(row.recommendations)
    })));
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

// Save a new recommendation to history
router.post('/', async (req, res) => {
  try {
    const { category, budget, room_size, energy_pref, brand_pref, usage_pattern, city, recommendations } = req.body;
    
    if (!category || !recommendations) {
      return res.status(400).json({ error: 'Missing category or recommendations.' });
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO history (user_id, category, budget, room_size, energy_pref, brand_pref, usage_pattern, city, recommendations) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, category, budget, room_size, energy_pref, brand_pref, usage_pattern, city, JSON.stringify(recommendations)]
    );

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Failed to save history.' });
  }
});

// Clear history
router.delete('/', async (req, res) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM history WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'History cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history.' });
  }
});

// Wishlist specific routes
router.get('/wishlist', async (req, res) => {
  try {
    const db = await getDb();
    const wishlist = await db.all('SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(wishlist.map(row => ({ ...row, details: JSON.parse(row.details) })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/wishlist', async (req, res) => {
  try {
    const { appliance_name, brand, details } = req.body;
    const db = await getDb();
    
    // Check if exists
    const exists = await db.get('SELECT * FROM wishlist WHERE user_id = ? AND appliance_name = ?', [req.user.id, appliance_name]);
    
    if (exists) {
      await db.run('DELETE FROM wishlist WHERE id = ?', [exists.id]);
      return res.json({ message: 'Removed from wishlist', saved: false });
    } else {
      await db.run(
        'INSERT INTO wishlist (user_id, appliance_name, brand, details) VALUES (?, ?, ?, ?)',
        [req.user.id, appliance_name, brand, JSON.stringify(details)]
      );
      return res.json({ message: 'Added to wishlist', saved: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

module.exports = router;
