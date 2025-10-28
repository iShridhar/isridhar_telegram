# 🚀 Быстрый старт iiSridhar Telegram Bot

## 📋 Предварительные требования

- Node.js 18+ 
- npm или yarn
- Telegram Bot Token (получите у [@BotFather](https://t.me/BotFather))
- OpenAI API Key (или локальный AI сервер)

## ⚡ Быстрая установка

### 1. Установите зависимости

```bash
npm install
```

### 2. Создайте .env файл

```bash
cp .env.example .env
```

### 3. Отредактируйте .env файл

Откройте `.env` и заполните:

```env
BOT_TOKEN=ваш_telegram_bot_token
OPENAI_API_KEY=ваш_openai_api_key
```

### 4. Запустите бота

**Способ 1: Через скрипт (рекомендуется)**
```bash
chmod +x start.sh
./start.sh
```

**Способ 2: Напрямую через npm**
```bash
npm start
```

**Способ 3: Режим разработки с авто-перезагрузкой**
```bash
npm run dev
```

## 🌐 Запуск Mini App

### 1. Запустите Web App сервер

**Через скрипт:**
```bash
chmod +x start_webapp.sh
./start_webapp.sh
```

**Через npm:**
```bash
npm run webapp
```

### 2. Настройте Web App URL в боте

1. Перейдите к [@BotFather](https://t.me/BotFather)
2. Выберите вашего бота
3. Выберите "Bot Settings" → "Menu Button" → "Configure menu button"
4. Введите URL вашего веб-сервера (например: `https://your-domain.com`)

## 🧪 Тестирование

1. Откройте Telegram
2. Найдите вашего бота
3. Нажмите `/start`
4. Начните диалог! 💬

## 🛠️ Режимы работы

Бот поддерживает два режима AI:

### OpenAI (по умолчанию)

```env
USE_LOCAL_AI=false
OPENAI_API_KEY=your_key_here
```

### Локальный AI сервер

```env
USE_LOCAL_AI=true
LOCAL_AI_URL=http://localhost:12500/generate
```

## 📱 Команды бота

- `/start` - Начать диалог
- `/new` - Новая тема
- `/history` - История диалогов
- `/language` - Выбор языка (RU, ES, HI, TH)
- `/mode` - Режим общения
- `/help` - Справка

## 🎭 Режимы общения

1. **🕉️ Духовный наставник** - Глубокие духовные беседы
2. **🧘 Медитация** - Руководство по практикам
3. **📿 Философия** - Философские обсуждения
4. **❓ Q&A** - Быстрые вопросы-ответы

## 🌍 Поддерживаемые языки

- 🇷🇺 Русский
- 🇪🇸 Испанский
- 🇮🇳 Хинди
- 🇹🇭 Тайский

## 🐛 Решение проблем

### Бот не запускается

1. Проверьте, что заполнен `.env` файл
2. Убедитесь, что токен бота корректный
3. Проверьте логи в консоли

### AI не отвечает

1. Проверьте OpenAI API ключ
2. Убедитесь, что есть интернет соединение
3. Проверьте баланс OpenAI аккаунта

### База данных не работает

1. Убедитесь, что папка `data/` существует
2. Проверьте права доступа к папке
3. Удалите `data/bot.db` и перезапустите бота

## 📊 Структура проекта

```
iiSridhar_telegram/
├── src/
│   ├── index.js          # Главный файл бота
│   ├── config.js         # Конфигурация
│   ├── api/
│   │   └── ai.js         # AI интеграция
│   ├── bot/
│   │   └── menu.js       # Меню и клавиатуры
│   ├── database/
│   │   └── db.js         # База данных
│   ├── i18n/
│   │   └── translations.js  # Переводы
│   └── webapp/
│       ├── server.js     # Web App сервер
│       └── public/
│           └── index.html # Web App интерфейс
├── data/                 # База данных (создастся автоматически)
├── .env                  # Конфигурация (создайте из .env.example)
└── package.json          # Зависимости
```

## 🚀 Деплой в продакшн

### Запуск с PM2

```bash
npm install -g pm2
pm2 start src/index.js --name iisridhar-bot
pm2 start src/webapp/server.js --name iisridhar-webapp
pm2 save
pm2 startup
```

### Запуск в Docker

```bash
# Будет добавлено в следующей версии
```

## 📝 Дополнительная информация

- [Полная документация](./README.md)
- [Legacy код](./legacy/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [grammY документация](https://grammy.dev/)

---

Сделано с 🙏 и ❤️ для духовного развития

