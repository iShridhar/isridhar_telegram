import { Bot, session } from 'grammy';
import { config } from './config.js';
import { db } from './database/db.js';
import { aiService } from './api/ai.js';
import { t } from './i18n/translations.js';
import { createMainMenu, createModeMenu, createLanguageMenu, createFeedbackKeyboard } from './bot/menu.js';

// Initialize bot
const bot = new Bot(config.botToken);

// Session middleware
bot.use(session({
  initial: () => ({
    language: config.defaultLanguage,
    mode: 'spiritual',
    currentConversationId: null,
    messageHistory: [],
  }),
}));

// Initialize database
await db.init();

// Commands setup
const commands = [
  { command: 'start', description: 'Начать диалог с наставником' },
  { command: 'new', description: 'Начать новую тему беседы' },
  { command: 'history', description: 'Просмотр истории диалогов' },
  { command: 'language', description: 'Выбор языка интерфейса' },
  { command: 'mode', description: 'Выбор режима общения' },
  { command: 'help', description: 'Справка по боту' },
];

await bot.api.setMyCommands(commands);

// === COMMAND HANDLERS ===

// /start command
bot.command('start', async (ctx) => {
  console.log('🚀 /start command from', ctx.from.username);
  
  const userId = ctx.from.id;
  const lang = ctx.session.language || config.defaultLanguage;
  
  // Create or update user in database
  let user = await db.getUser(userId);
  if (!user) {
    await db.createUser(userId, {
      username: ctx.from.username,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      language_code: ctx.from.language_code,
    });
  } else {
    await db.updateUser(userId, {});
  }

  // Create main menu
  const mainMenu = createMainMenu(ctx);
  
  // Send welcome message
  const welcomeText = t(lang, 'welcome');
  await ctx.reply(welcomeText, {
    parse_mode: 'Markdown',
    reply_markup: mainMenu,
  });
});

// /new command
bot.command('new', async (ctx) => {
  console.log('💬 /new command from', ctx.from.username);
  
  const lang = ctx.session.language || config.defaultLanguage;
  ctx.session.currentConversationId = null;
  ctx.session.messageHistory = [];
  
  await ctx.reply(t(lang, 'new_topic'), { parse_mode: 'Markdown' });
});

// /history command
bot.command('history', async (ctx) => {
  console.log('📚 /history command from', ctx.from.username);
  
  const lang = ctx.session.language || config.defaultLanguage;
  const conversations = await db.getUserConversations(ctx.from.id, 10);
  
  if (conversations.length === 0) {
    await ctx.reply(t(lang, 'no_history'));
    return;
  }

  let historyText = '📚 **История диалогов:**\n\n';
  conversations.forEach((conv, index) => {
    const date = new Date(conv.created_at).toLocaleDateString();
    const title = conv.title || 'Беседа';
    historyText += `${index + 1}. ${title} - ${date}\n`;
  });

  await ctx.reply(historyText, { parse_mode: 'Markdown' });
});

// /language command
bot.command('language', async (ctx) => {
  console.log('🌐 /language command from', ctx.from.username);
  
  const lang = ctx.session.language || config.defaultLanguage;
  const languageMenu = createLanguageMenu(ctx);
  
  await ctx.reply('🌐 **Выберите язык:**', {
    parse_mode: 'Markdown',
    reply_markup: languageMenu,
  });
});

// /mode command
bot.command('mode', async (ctx) => {
  console.log('🎭 /mode command from', ctx.from.username);
  
  const lang = ctx.session.language || config.defaultLanguage;
  const modeMenu = createModeMenu(ctx);
  
  await ctx.reply('🎭 **Выберите режим общения:**\n\n' +
    `🕉️ ${t(lang, 'mode_spiritual')}\n` +
    `🧘 ${t(lang, 'mode_meditation')}\n` +
    `📿 ${t(lang, 'mode_philosophy')}\n` +
    `❓ ${t(lang, 'mode_qa')}`, {
    parse_mode: 'Markdown',
    reply_markup: modeMenu,
  });
});

// /help command
bot.command('help', async (ctx) => {
  console.log('❓ /help command from', ctx.from.username);
  
  const lang = ctx.session.language || config.defaultLanguage;
  const helpText = t(lang, 'help');
  
  await ctx.reply(helpText, { parse_mode: 'Markdown' });
});

// === CALLBACK QUERY HANDLERS ===

// Feedback callback
bot.callbackQuery(/^feedback:(.+):(.+)$/, async (ctx) => {
  const rating = ctx.match[1];
  const messageId = ctx.match[2];
  
  console.log('👍 Feedback:', rating, 'for message:', messageId);
  
  try {
    await db.addFeedback(messageId, ctx.from.id, rating);
    await ctx.answerCallbackQuery('Спасибо за отзыв! 🙏');
  } catch (error) {
    console.error('Feedback error:', error);
    await ctx.answerCallbackQuery('Ошибка сохранения отзыва');
  }
});

// Settings callbacks
bot.callbackQuery('settings:mode', async (ctx) => {
  await ctx.answerCallbackQuery();
  const modeMenu = createModeMenu(ctx);
  await ctx.editMessageText('🎭 **Выберите режим общения:**', {
    parse_mode: 'Markdown',
    reply_markup: modeMenu,
  });
});

bot.callbackQuery('settings:language', async (ctx) => {
  await ctx.answerCallbackQuery();
  const languageMenu = createLanguageMenu(ctx);
  await ctx.editMessageText('🌐 **Выберите язык:**', {
    parse_mode: 'Markdown',
    reply_markup: languageMenu,
  });
});

// === MESSAGE HANDLER ===

// Text message handler
bot.on('message:text', async (ctx) => {
  console.log('💬 Text message from', ctx.from.username);
  
  const lang = ctx.session.language || config.defaultLanguage;
  const mode = ctx.session.mode || 'spiritual';
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

  try {
    // Create new conversation if needed
    if (!ctx.session.currentConversationId) {
      const title = userMessage.substring(0, 50);
      ctx.session.currentConversationId = await db.createConversation(userId, title, mode);
      console.log('📝 New conversation created:', ctx.session.currentConversationId);
    }

    // Add user message to database
    const userMsgId = await db.addMessage(
      ctx.session.currentConversationId,
      userId,
      'user',
      userMessage
    );

    // Update message history
    ctx.session.messageHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Keep only last N messages for context
    if (ctx.session.messageHistory.length > config.maxContextMessages * 2) {
      ctx.session.messageHistory = ctx.session.messageHistory.slice(-config.maxContextMessages * 2);
    }

    // Show typing indicator
    await ctx.replyWithChatAction('typing');

    // Generate AI response with streaming
    let fullResponse = '';
    let lastUpdate = Date.now();
    let responseMessage = null;

    // Send initial "thinking" message
    responseMessage = await ctx.reply(t(lang, 'thinking'));

    // Generate response
    for await (const chunk of aiService.generateStream(ctx.session.messageHistory, mode, lang)) {
      fullResponse += chunk;
      
      // Update message every 500ms and on punctuation
      const now = Date.now();
      if (now - lastUpdate > 500 || /[.!?;,]\s*$/.test(fullResponse)) {
        lastUpdate = now;
        try {
          await ctx.api.editMessageText(
            ctx.chat.id,
            responseMessage.message_id,
            fullResponse + ' ✍️'
          );
        } catch (error) {
          // Ignore "message is not modified" errors
          if (!error.description?.includes('message is not modified')) {
            console.error('Edit message error:', error);
          }
        }
        
        // Send typing action periodically
        await ctx.replyWithChatAction('typing');
      }
    }

    // Final message update with feedback buttons
    if (fullResponse) {
      // Add assistant message to history
      ctx.session.messageHistory.push({
        role: 'assistant',
        content: fullResponse,
      });

      // Save to database
      const assistantMsgId = await db.addMessage(
        ctx.session.currentConversationId,
        userId,
        'assistant',
        fullResponse
      );

      // Update conversation timestamp
      await db.updateConversation(ctx.session.currentConversationId);

      // Final update with feedback
      await ctx.api.editMessageText(
        ctx.chat.id,
        responseMessage.message_id,
        fullResponse,
        {
          reply_markup: createFeedbackKeyboard(assistantMsgId),
        }
      );
    }

  } catch (error) {
    console.error('❌ Message handling error:', error);
    await ctx.reply(t(lang, 'error'), { parse_mode: 'Markdown' });
  }
});

// === ERROR HANDLER ===

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`❌ Error while handling update ${ctx.update.update_id}:`);
  console.error(err.error);
});

// === START BOT ===

console.log('🕉️ iiSridhar Telegram Bot starting...');

// Graceful shutdown
process.once('SIGINT', async () => {
  console.log('⏹️ Stopping bot...');
  await db.close();
  await bot.stop();
  process.exit(0);
});

process.once('SIGTERM', async () => {
  console.log('⏹️ Stopping bot...');
  await db.close();
  await bot.stop();
  process.exit(0);
});

// Start bot
await bot.start();
console.log('🚀 iiSridhar Telegram Bot is running!');
console.log(`📊 Database: ${config.databasePath}`);
console.log(`🤖 AI Service: ${config.useOllama ? `Ollama (${config.ollamaModel})` : config.useLocalAi ? 'Local AI' : 'OpenAI'}`);
console.log(`🌍 Default language: ${config.defaultLanguage}`);

