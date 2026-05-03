const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { initDb } = require('./database');
const authRoute = require('./routes/auth');
const recommendRoute = require('./routes/recommend');
const historyRoute = require('./routes/history');
const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow all vercel.app domains (covers preview deploys) and localhost
    if (
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:3000'
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Initialize database
initDb().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/recommend', recommendRoute);
app.use('/api/history', historyRoute);
app.use('/api/chat', chatRoute);

// Basic health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
