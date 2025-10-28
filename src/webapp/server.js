import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { db } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
await db.init();

// API Routes

// Get user info
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await db.getUser(parseInt(req.params.userId));
    res.json(user || {});
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get user conversations
app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const conversations = await db.getUserConversations(parseInt(req.params.userId), limit);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get conversation messages
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const messages = await db.getConversationMessages(parseInt(req.params.conversationId));
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = config.webappPort;
app.listen(PORT, () => {
  console.log(`🌐 Web App server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.once('SIGINT', async () => {
  console.log('⏹️ Stopping web app server...');
  await db.close();
  process.exit(0);
});

process.once('SIGTERM', async () => {
  console.log('⏹️ Stopping web app server...');
  await db.close();
  process.exit(0);
});

