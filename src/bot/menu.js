import { Menu } from '@grammyjs/menu';
import { t } from '../i18n/translations.js';
import { config } from '../config.js';

// Main menu
export function createMainMenu(ctx) {
  const lang = ctx.session.language || config.defaultLanguage;
  
  const menu = new Menu('main-menu')
    .text(t(lang, 'btn_new_topic'), async (ctx) => {
      await ctx.answerCallbackQuery();
      await handleNewTopic(ctx);
    })
    .text(t(lang, 'btn_history'), async (ctx) => {
      await ctx.answerCallbackQuery();
      await handleHistory(ctx);
    })
    .row()
    .text(t(lang, 'btn_settings'), async (ctx) => {
      await ctx.answerCallbackQuery();
      await handleSettings(ctx);
    })
    .text(t(lang, 'btn_help'), async (ctx) => {
      await ctx.answerCallbackQuery();
      const helpText = t(lang, 'help');
      await ctx.reply(helpText, { parse_mode: 'Markdown' });
    })
    .row()
    .webApp(t(lang, 'btn_webapp'), config.webappUrl);

  return menu;
}

// Mode selection menu
export function createModeMenu(ctx) {
  const lang = ctx.session.language || config.defaultLanguage;
  
  const menu = new Menu('mode-menu')
    .text(t(lang, 'btn_spiritual'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.mode = 'spiritual';
      await ctx.reply(t(lang, 'mode_changed', { mode: t(lang, 'mode_spiritual') }), {
        parse_mode: 'Markdown',
      });
    })
    .text(t(lang, 'btn_meditation'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.mode = 'meditation';
      await ctx.reply(t(lang, 'mode_changed', { mode: t(lang, 'mode_meditation') }), {
        parse_mode: 'Markdown',
      });
    })
    .row()
    .text(t(lang, 'btn_philosophy'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.mode = 'philosophy';
      await ctx.reply(t(lang, 'mode_changed', { mode: t(lang, 'mode_philosophy') }), {
        parse_mode: 'Markdown',
      });
    })
    .text(t(lang, 'btn_qa'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.mode = 'qa';
      await ctx.reply(t(lang, 'mode_changed', { mode: t(lang, 'mode_qa') }), {
        parse_mode: 'Markdown',
      });
    })
    .row()
    .text('« Назад', async (ctx) => {
      await ctx.answerCallbackQuery();
      const mainMenu = createMainMenu(ctx);
      await ctx.reply('Главное меню:', { reply_markup: mainMenu });
    });

  return menu;
}

// Language selection menu
export function createLanguageMenu(ctx) {
  const lang = ctx.session.language || config.defaultLanguage;
  
  const menu = new Menu('language-menu')
    .text(t(lang, 'lang_ru'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.language = 'ru';
      await ctx.reply(t('ru', 'language_changed', { language: 'Русский' }));
    })
    .text(t(lang, 'lang_es'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.language = 'es';
      await ctx.reply(t('es', 'language_changed', { language: 'Español' }));
    })
    .row()
    .text(t(lang, 'lang_hi'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.language = 'hi';
      await ctx.reply(t('hi', 'language_changed', { language: 'हिंदी' }));
    })
    .text(t(lang, 'lang_th'), async (ctx) => {
      await ctx.answerCallbackQuery();
      ctx.session.language = 'th';
      await ctx.reply(t('th', 'language_changed', { language: 'ไทย' }));
    })
    .row()
    .text('« Back', async (ctx) => {
      await ctx.answerCallbackQuery();
      const mainMenu = createMainMenu(ctx);
      await ctx.reply('Main menu:', { reply_markup: mainMenu });
    });

  return menu;
}

// Feedback menu (inline keyboard)
export function createFeedbackKeyboard(messageId) {
  return {
    inline_keyboard: [
      [
        { text: '💯', callback_data: `feedback:perfect:${messageId}` },
        { text: '👍', callback_data: `feedback:good:${messageId}` },
        { text: '😂', callback_data: `feedback:funny:${messageId}` },
        { text: '👎', callback_data: `feedback:bad:${messageId}` },
        { text: '❌', callback_data: `feedback:terrible:${messageId}` },
      ],
    ],
  };
}

// Handler functions
async function handleNewTopic(ctx) {
  const lang = ctx.session.language || config.defaultLanguage;
  ctx.session.currentConversationId = null;
  ctx.session.messageHistory = [];
  await ctx.reply(t(lang, 'new_topic'), { parse_mode: 'Markdown' });
}

async function handleHistory(ctx) {
  const lang = ctx.session.language || config.defaultLanguage;
  // Import db here to avoid circular dependency
  const { db } = await import('../database/db.js');
  
  const conversations = await db.getUserConversations(ctx.from.id, 5);
  
  if (conversations.length === 0) {
    await ctx.reply(t(lang, 'no_history'));
    return;
  }

  let historyText = '📚 **История диалогов:**\n\n';
  conversations.forEach((conv, index) => {
    const date = new Date(conv.created_at).toLocaleDateString();
    historyText += `${index + 1}. ${conv.title || 'Беседа'} - ${date}\n`;
  });

  await ctx.reply(historyText, { parse_mode: 'Markdown' });
}

async function handleSettings(ctx) {
  const lang = ctx.session.language || config.defaultLanguage;
  const modeMenu = createModeMenu(ctx);
  const langMenu = createLanguageMenu(ctx);
  
  await ctx.reply('⚙️ **Настройки**\n\nВыберите что изменить:', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎭 Режим общения', callback_data: 'settings:mode' }],
        [{ text: '🌐 Язык интерфейса', callback_data: 'settings:language' }],
      ],
    },
  });
}

