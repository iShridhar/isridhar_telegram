import sqlite3 from 'sqlite3';
import { config } from '../config.js';
import { promisify } from 'util';

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(config.databasePath, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('📊 Database connected');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const run = promisify(this.db.run.bind(this.db));

    // Users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        language_code TEXT DEFAULT 'ru',
        mode TEXT DEFAULT 'spiritual',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Conversations table
    await run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        mode TEXT DEFAULT 'spiritual',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Messages table
    await run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER,
        user_id INTEGER,
        role TEXT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Feedback table
    await run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER,
        user_id INTEGER,
        rating TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES messages(id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    console.log('✅ Database tables created/verified');
  }

  // User methods
  async getUser(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async createUser(userId, userData) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO users (user_id, username, first_name, last_name, language_code) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, userData.username, userData.first_name, userData.last_name, userData.language_code || 'ru'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async updateUser(userId, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), userId];
    
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET ${fields}, last_active = CURRENT_TIMESTAMP WHERE user_id = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Conversation methods
  async createConversation(userId, title, mode) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO conversations (user_id, title, mode) VALUES (?, ?, ?)',
        [userId, title, mode],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getConversation(conversationId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM conversations WHERE id = ?',
        [conversationId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getUserConversations(userId, limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT ?',
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async updateConversation(conversationId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [conversationId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Message methods
  async addMessage(conversationId, userId, role, content) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO messages (conversation_id, user_id, role, content) VALUES (?, ?, ?, ?)',
        [conversationId, userId, role, content],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getConversationMessages(conversationId, limit = 50) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?',
        [conversationId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getLastMessages(conversationId, count) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?',
        [conversationId, count],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows.reverse());
        }
      );
    });
  }

  // Feedback methods
  async addFeedback(messageId, userId, rating) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO feedback (message_id, user_id, rating) VALUES (?, ?, ?)',
        [messageId, userId, rating],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else {
          console.log('📊 Database closed');
          resolve();
        }
      });
    });
  }
}

export const db = new Database();

