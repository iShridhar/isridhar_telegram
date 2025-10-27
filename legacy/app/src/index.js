const { Telegraf, Markup } = require('telegraf');
const { Keyboard } = require('telegram-keyboard')
const LocalSession = require('telegraf-session-local')
const fs = require('fs');


const dotenv = require('dotenv');
dotenv.config();

const { COMMANDS, REACTIONS, INSTRUCTIONS, MENU, menuKeyboard, commandsText, reactionsText,prompts } = require('./const/const.js');

const {
  onBotStartPrivate,
  onBotCommandNewTopicPrivate,
  onBotCommandHelpPrivate,
  onBotTextPrivate } = require('./private.js');

const {
  onBotStartGroup,
  onBotCommandNewTopicGroup,
  onBotCommandHelpGroup,
  onBotTextGroup } = require('./group.js');

const { onBotCommandNewTopicCommon, checkSession } = require('./common.js');

const { makeDialog } = require('./dialog.js');

// Load environment variables
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
if (!telegramBotToken) {
  throw new Error('TELEGRAM_BOT_TOKEN not found');
}


// Create a new Telegraf instance using the API token provided by BotFather
const bot = new Telegraf(telegramBotToken);

// Set up local session middleware to store user data
const sessionPath = './data/sessions/session.json';
const session = new LocalSession();
bot.use((new LocalSession({ database: sessionPath })).middleware())


bot.telegram.setMyCommands(COMMANDS);

// Start command
bot.start(async (ctx) => {
  console.log('🚀 /start command');
  if (ctx.chat.type === 'private') {
    await onBotStartPrivate(ctx)
  } else {
    await onBotStartGroup(ctx);
  }
});

bot.command('new', async (ctx) => {
  console.log('💬 /newtopic command');
  await onBotCommandNewTopic(ctx);
});

bot.command('newtopic', async (ctx) => {
  console.log('💬 /newtopic command');
  await onBotCommandNewTopic(ctx);
});

bot.command('chat', async (ctx) => {
  console.log('💬 /chat command');
  await onBotCommandNewTopic(ctx);
});

bot.command('chatgpt', async (ctx) => {
  console.log('💬 /chatgpt command');
  await onBotCommandNewTopic(ctx);
});

bot.command('help', async (ctx) => {
  console.log('🆘 /chatgpt command');
  if (ctx.chat.type === 'private') {
    await onBotCommandHelpPrivate(ctx);
  } else {
    await onBotCommandHelpGroup(ctx);
  }
});



async function onBotCommandNewTopic(ctx) {
  //console.log(ctx,ctx.message.text);
  await checkSession(ctx);
  await onBotCommandNewTopicCommon(ctx);
}

async function onMenu(ctx, text, callback_data) {
  console.log('👨‍💻 Select instruction command', text, callback_data);

  const regex = /^menu:instructions:(.*)$/;

  const match = regex.exec(callback_data);
  if (match) {
    const instruction = match[1].trim();
    console.log(instruction);
    console.log("Instruction prompt:", prompts[instruction]);
    ctx.session.dialog = prompts[instruction];
    ctx.session.prompt = prompts[instruction];
    //await ctx.answerCbQuery('Instructions set, please write your text!', { show_alert: false }); //cache_time: 300  
    await ctx.reply(`👉👨‍💻💬 Now just type something (${text}):`);

  }

  const regexMode = /^menu:mode:(.*)$/;
  const matchMode = regexMode.exec(callback_data);
  if (matchMode) {
    const mode = matchMode[1].trim();
    console.log(mode);
    console.log("Mode:", mode);
    ctx.session.mode = mode;
    await ctx.reply(`👉👨‍💻💬 Now just type something (mode:${ctx.session.mode}):`);

  }

}

//Make menu hears functions
menuKeyboard.forEach(row => {
  //console.log(row);
  for (let key in row) {
    const button = row[key];
    bot.hears(button.text, ctx => {
      onMenu(ctx, button.text, button.callback_data)
    });
  };
});




// Listen for incoming text messages
bot.on('text', async (ctx) => {
  //return;

  console.log('💬 bot.on(text)');
  try {
    await checkSession(ctx);
    if (ctx.chat.type === 'private') {
      console.log('📝 text received (private)');
      if (ctx.session.mode=="qa")     ctx.session.dialog = ctx.session.prompt;
      await makeDialog(ctx);
    } else {
      console.log('📝 text received (group)');
      await onBotTextGroup(ctx);
    }
  } catch (err) {
    // Handle errors gracefully
    console.error('❌ Error:', err);
    if (err.response.status == 429) {
      await ctx.reply('Oops! Too many requests, bot is overloaded. Please try again little bit later.');
    } else if (err.response.status == 400) {
      await ctx.reply('Oops! Something went wrong with server. Please try again later or try to restart bot using /start command.');
    } else {
      await ctx.reply(`Oops! Something went wrong(status code ${err.response.status}). Please try again later or try to restart bot using /start command.`);
    }
  }
  console.log('🚀 FINISH bot.on(text)');
});

bot.action(/reaction:(.*):(.*)/, async (ctx) => {
  const reactionType = ctx.match[1];
  const reactionMessageId = ctx.match[2];
  console.log(reactionType, reactionMessageId);
  ctx.session.feedback[reactionMessageId] = reactionType;
  await ctx.answerCbQuery('Thank you for feedback!', { show_alert: false }); //cache_time: 300  
});





bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
});



// Start polling for incoming messages
bot.launch();
console.log('🚀 VadaVany bot is running');



//require('./const/show');


