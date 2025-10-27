const { chatgptConversation,chatgptConversationMessages } = require('../api/chatgpt.js');
const { getCurrentDateFormatted } = require('../helper');
var currentDate=getCurrentDateFormatted() ;//"2023-03-04"
console.log(currentDate);



var showGuru=`Śrīla Bhakti Rakshak Sridhar Dev-Goswami Mahārāja`;
var showHost=`Ananta Shanti Das`;
var showGuests=`Barack Obama
Elon Musk
Jeff Bezos
Bill Gates
Oprah Winfrey
Mark Zuckerberg
Vladimir Putin
Angela Merkel
Xi Jinping
Cristiano Ronaldo
Lionel Messi
Neymar
Roger Federer
Serena Williams
Usain Bolt
Michael Jordan
Kobe Bryant
Beyoncé
Taylor Swift
Adele
Eminem
Jay-Z
Stephen King
J.KRowling
Paulo Coelho
Steven Spielberg
Martin Scorsese
Quentin Tarantino
Robert Downey Jr.
Tom Cruise
Will Smith
Angelina Jolie
Jennifer Lawrence
Tom Brady
LeBron James
Michael Phelps
Simone Biles
Mahatma Gandhi
Mother Teresa
Nelson Mandela
Albert Einstein
Stephen Hawking
Marie Curie
Isaac Newton
Charles Darwin
Galileo Galilei
Leonardo da Vinci
Pablo Picasso
Vincent van Gogh
Elvis Presley`;

var showScript=`1. The host begins the show and welcomes viewers, explaining that all questions/comments will be taken from the online chat.
2. The host reads out a question/comment from the chat and specifies which famous personality (guest) the question/comment is addressed to.
3. The host asks the guest to provide their response to the question/comment from the chat.
4. The famous personality gives their material answer to the question/comment.
5. The host turns to Guru Maharaj and asks for a spiritual comment on the guest's material answer.
6. Guru Maharaj thanks the guest for their answer and gives their comments on the answer from a spiritual perspective, offering recommendations for overcoming difficulties and spiritual development.
7. The process continues as the host reads out more questions/comments from the chat, addressing different guests.`


// Be humble and tolerant. Pay respect to everyone, do not demand respect for yorself. Listen about the Lord and chant his glory. Śrīla Bhakti Rakshak Sridhar Dev-Goswami Mahārāja in parampara of Sri Chaitanya Saraswat Math: Srila Bhakti Raksak Sridhar Maharaj and Srila Bhakti Sundar Govinda Maharaj. Srila Bhakti Bimal Avadhut Maharaj and Srila Bhakti Sevan Hrishikesh Maharaj are also in Sri Chaitanya Saraswat Math parampara. Bhaktivedanta Narayana Gosvami is not in Sri Chaitanya Saraswat Math parampara.
var showPromptSystem={ "role": "system", "content": `You are VedaVany, a large language model trained by 360SoftDevelopment. Answer as concisely as possible.
Knowledge cutoff: 2023-03
Current date: ${currentDate}


`};
//Instructions: Please act as Śrīla Bhakti Rakshak Sridhar Dev-Goswami Mahārāja. 

var chatNewMessage=`У меня наш бот перешёл на английский, а у вас?`;
var chatConentFull=`
У меня наш бот перешёл на английский, а у вас?

> Вайшнава дас:
Я с ним пытаюсь учить английский, он как я понял мультиязычный)) и на русском отвечает и на английском👍

> Natalia Alexandrova:
и подзавис, хотя я делала и рестарт и старт новый чарт

> Вайшнава дас:
У меня больше дня не отвечал, потом ответил на все сразу

> Roman:
Petr, how are you?

> Roman:
Также, на заметку. На английском языке у него в два раза больше символов(токенов), которые он может отвечать

> Ратин Кисельный Прабху Krishnadas:
Хто имеет дело с Kaiber: подскажите, есть ли хакк, который позволяет не платить за видео, которые он генерит?

`;
var makeQuestion=
[ 
    { "role": "user", "content": `Chat content:\n${chatConentFull}\n
JSON example:
[
    {"who":"Roman",
     "whom":"Petr"
     "question":"How are you?"}
]
Instructions: Put all the questions from chat in json as in example, add who and whom.
` }
];



var makeQuestion2=
[ 
    showPromptSystem,
    { "role": "user", "content": `I want you to act as host of show.\nShow script:\n${showScript}` },
    { "role": "assistant", "content": `Ok`},
    { "role": "user", "content": `Chat content:\n${chatConentFull}` },
    { "role": "assistant", "content": `Ok`},
    //{ "role": "user", "content": `Last message in chat: ${chatNewMessage}\nIf possible, make just question from this last message, if not possible, just say NO. Don't explain anything` }
    { "role": "user", "content": `Last message in chat: ${chatNewMessage}\nInstructions:I want you to use step 2 in script:  make text for host from this last message, if not possible, just say NO.` }
];

// Don't explain anything
/*
async function myFunction() {
    const response =  await chatgptConversationMessages(makeQuestion);
    console.log('🤖 Response:', response);
}
  
myFunction();
*/

/*
chatgptConversationMessages(makeQuestion).then((response) => {
    console.log(response);
  });
*/