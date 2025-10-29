import 'dotenv/config';

export const config = {
  // Telegram
  botToken: process.env.BOT_TOKEN,
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  
  // Local AI
  localAiUrl: process.env.LOCAL_AI_URL || 'http://localhost:12500/generate',
  useLocalAi: process.env.USE_LOCAL_AI === 'true',
  
  // Ollama
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama2',
  useOllama: process.env.USE_OLLAMA === 'true',
  
  // Database
  databasePath: process.env.DATABASE_PATH || './data/bot.db',
  
  // Web App
  webappPort: parseInt(process.env.WEBAPP_PORT) || 3000,
  webappUrl: process.env.WEBAPP_URL || 'http://localhost:3000',
  
  // Bot Settings
  adminIds: process.env.BOT_ADMIN_IDS?.split(',').map(id => parseInt(id)) || [],
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'ru',
  maxContextMessages: parseInt(process.env.MAX_CONTEXT_MESSAGES) || 10,
};

// Validate required config
if (!config.botToken) {
  throw new Error('BOT_TOKEN is required in .env file');
}

if (!config.useLocalAi && !config.useOllama && !config.openaiApiKey) {
  throw new Error('OPENAI_API_KEY is required when not using local AI or Ollama');
}

