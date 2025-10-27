const { prompts } = require('./prompts.js');

const helpPrivateText = `💬 Any time you can write text. 👨‍💻 And bot will give response. 👉 You can give feedback(it will help us to improve) after response, using this buttons:`;
const helpGroupText = helpPrivateText;
const feedbackText = `📝 Your feedback will help us improve the quality of the bot's responses. If you have any further questions, please feel free to contact us at https://t.me/+sX40MfvypnVmNjI6`;

// Enable command menu
const COMMANDS = [
    { command: 'start', description: 'Start the bot.' },
    { command: 'new', description: 'Start new dialog. Usage: /new What is life after life?' },
    { command: 'chat', description: 'Continue dialog. Usage: /chat Can you please repeat?' },
    //{ command: 'translate', description: 'Translate to english next message' },  
    //{ command: 'chats', description: 'Show chats list' },
    //{ command: 'prompts', description: 'Chose special prompt' },  
    //{ command: 'useinternet_once', description: 'Use internet once for next mesage' },  
    //{ command: 'useinternet_always', description: 'Use internet always for this chat' },  
    //{ command: 'useinternet_never', description: 'Useinternet never for this chat' },  
    { command: 'help', description: 'Get help' },
];

const REACTIONS = {
    perfect: { emoji: '💯', description: 'Use this button to indicate a perfect answer' },
    good: { emoji: '👍', description: 'Use this button to indicate a good answer' },
    //like: { emoji: '❤️', description: 'Use this button to indicate that you like this answer' },
    funny: { emoji: '😂', description: 'Use this button to indicate that this answer is funny' },    
    //markdown: { emoji: '📔', description: 'Use this button to show this answer formatted in markdown.' },
    //source: { emoji: '💻', description: 'Use this button to show  this answer without markdown (source code)' },
    //stop: { emoji: '⛔', description: 'Use this button to immediately stop generating.' },
    //regenerate: { emoji: '🔄', description: 'Use this button to generate a new answer' },
    bad: { emoji: '👎', description: 'Use this button to indicate a bad answer' },
    terrible: { emoji: '❌', description: 'Use this button to indicate a terrible answer and ask not to get an answer like this again' }
};


const MENU = [
    {
        "instructions:spiritual": { emoji: '🕉️', description: 'Spiritual', prompt: prompts.spiritual }
    },

    {
        "instructions:plain": { emoji: '🤷‍♂️', description: 'Plain (no instructions)', prompt: prompts.plain },
        "instructions:dan": { emoji: '💪', description: 'DAN (jailbrake)', prompt: prompts.dan }
    },
    {
        "instructions:developer": { emoji: '💻', description: 'Developer', prompt: prompts.developer },
        "instructions:sceintist": { emoji: '🔬', description: 'Data Scientist', prompt: prompts.scientist }
    },
    {
        "instructions:svg": { emoji: '🎨', description: 'SVG creator', prompt: prompts.svg },
    },

    {
        "mode:qa": { emoji: '❓', description: 'Q&A', mode: "qa" },
        "mode:dialog": { emoji: '💬', description: 'Dialog', mode: "dialog" },
        //"mode:internet": { emoji: '🌐', description: 'Internet', mode:"internet" },
    }


];

function createKeyboard(menu) {
    let keyboard = [];

    for (let i = 0; i < menu.length; i++) {
        let row = [];
        for (let key in menu[i]) {
            let button = {
                text: menu[i][key].emoji + " " + menu[i][key].description,
                callback_data: `menu:${key}`
            };
            row.push(button);
        }
        keyboard.push(row);
    }
    return keyboard;
}

//.oneTimeKeyboard(true);

const menuKeyboard = createKeyboard(MENU);
// console.log(menuKeyboard);

const instructionsKeyboard = menuKeyboard;


const commandsText = COMMANDS.map(cmd => `/${cmd.command} - ${cmd.description}`).join('\n');
const reactionsText = Object.keys(REACTIONS).map(command => `${REACTIONS[command].emoji} - ${REACTIONS[command].description}`).join('\n');


module.exports = {
    COMMANDS, REACTIONS, MENU,
    menuKeyboard, 
    commandsText, reactionsText, feedbackText, helpPrivateText, helpGroupText,
    prompts
};