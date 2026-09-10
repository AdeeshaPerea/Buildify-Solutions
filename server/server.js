// ==========================================================================
// BUILDIFY SOLUTIONS - NODE.JS / EXPRESS BACKEND SERVER
// ==========================================================================

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Buildify Solutions Backend Core',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Export for serverless or start directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Buildify Solutions API running on http://localhost:${PORT}`);
  });
}

export default app;
