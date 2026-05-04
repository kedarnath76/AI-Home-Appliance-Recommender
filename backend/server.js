const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { initDb } = require('./database');
const authRoute = require('./routes/auth');
const recommendRoute = require('./routes/recommend');
const historyRoute = require('./routes/history');
const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:3001'
    ];

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      /^http:\/\/localhost:\d+$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Initialize database
initDb().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Routes - Dual mounting for local and Vercel compatibility
app.use('/api/auth', authRoute);
app.use('/auth', authRoute);

app.use('/api/recommend', recommendRoute);
app.use('/recommend', recommendRoute);

app.use('/api/history', historyRoute);
app.use('/history', historyRoute);

app.use('/api/chat', chatRoute);
app.use('/chat', chatRoute);

// Basic health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Only start the server if we are running the file directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
