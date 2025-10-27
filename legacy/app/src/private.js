const {onBotCommandNewTopicCommon} = require('./common.js');
const { COMMANDS, REACTIONS, INSTRUCTIONS, menuKeyboard,commandsText,reactionsText,feedbackText,helpPrivateText,prompts } = require('./const/const.js');

async function onBotStartPrivate(ctx) {
    await ctx.reply('👋 Welcome to VedaVany.');
    await onBotCommandHelpPrivate(ctx);
    await onBotCommandNewTopicCommon(ctx);
}


async function onBotCommandHelpPrivate(ctx) {
    await ctx.reply('List of commands:');
    await ctx.reply(commandsText);
    await ctx.reply(helpPrivateText);
    await ctx.reply(reactionsText);
    await ctx.reply(feedbackText);
    
}



module.exports = {
    onBotStartPrivate,
    onBotCommandHelpPrivate,
};