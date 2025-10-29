#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🦙 iiSridhar Telegram Bot - Запуск с Ollama${NC}"
echo ""

# Проверка Ollama
if ! command -v ollama &> /dev/null; then
    echo -e "${RED}❌ Ollama не установлен!${NC}"
    echo ""
    echo "Установите Ollama:"
    echo "  macOS/Linux: curl -fsSL https://ollama.ai/install.sh | sh"
    echo "  Windows: скачайте с https://ollama.ai"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Ollama установлен${NC}"

# Проверка модели
OLLAMA_MODEL=${OLLAMA_MODEL:-llama2}
echo -e "${BLUE}📦 Проверка модели $OLLAMA_MODEL...${NC}"

if ! ollama list | grep -q "$OLLAMA_MODEL"; then
    echo -e "${YELLOW}⚠️  Модель $OLLAMA_MODEL не найдена${NC}"
    echo -e "${BLUE}📥 Скачиваю модель (это может занять несколько минут)...${NC}"
    ollama pull $OLLAMA_MODEL
fi

echo -e "${GREEN}✅ Модель $OLLAMA_MODEL готова${NC}"

# Проверка Ollama сервера
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Ollama сервер не запущен${NC}"
    echo -e "${BLUE}🚀 Запускаю Ollama в фоне...${NC}"
    ollama serve > /dev/null 2>&1 &
    OLLAMA_PID=$!
    sleep 3
    echo -e "${GREEN}✅ Ollama запущен (PID: $OLLAMA_PID)${NC}"
else
    echo -e "${GREEN}✅ Ollama сервер уже запущен${NC}"
fi

# Проверка .env файла
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Файл .env не найден${NC}"
    echo -e "${BLUE}📝 Создаю .env для Ollama...${NC}"
    
    cat > .env << 'EOF'
# Telegram Bot Token (получите у @BotFather)
BOT_TOKEN=your_telegram_bot_token_here

# Ollama Configuration
USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Database
DATABASE_PATH=./data/bot.db

# Web App
WEBAPP_PORT=3000
WEBAPP_URL=http://localhost:3000

# Bot Settings
BOT_ADMIN_IDS=123456789
DEFAULT_LANGUAGE=ru
MAX_CONTEXT_MESSAGES=10
EOF
    
    echo -e "${GREEN}✅ Файл .env создан${NC}"
    echo ""
    echo -e "${RED}⚠️  ВАЖНО: Отредактируйте .env и укажите BOT_TOKEN!${NC}"
    echo "  Получите токен у @BotFather в Telegram"
    echo ""
    echo "Затем запустите скрипт снова:"
    echo "  ./start_with_ollama.sh"
    echo ""
    exit 1
fi

# Проверка BOT_TOKEN
if grep -q "your_telegram_bot_token_here" .env; then
    echo -e "${RED}❌ BOT_TOKEN не указан в .env!${NC}"
    echo ""
    echo "Отредактируйте .env и укажите ваш Telegram Bot Token:"
    echo "  nano .env"
    echo ""
    echo "Получите токен у @BotFather в Telegram"
    exit 1
fi

# Проверка USE_OLLAMA
if ! grep -q "USE_OLLAMA=true" .env; then
    echo -e "${YELLOW}⚠️  USE_OLLAMA не установлен в true${NC}"
    echo -e "${BLUE}📝 Обновляю .env...${NC}"
    sed -i.bak 's/USE_OLLAMA=false/USE_OLLAMA=true/' .env
    echo -e "${GREEN}✅ USE_OLLAMA=true${NC}"
fi

# Проверка node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Установка зависимостей...${NC}"
    npm install
fi

# Создание директории для данных
mkdir -p data/sessions

echo -e "${GREEN}✅ Все проверки пройдены!${NC}"
echo ""
echo -e "${BLUE}🚀 Запуск бота с Ollama ($OLLAMA_MODEL)...${NC}"
echo ""
echo -e "${GREEN}Бот готов к работе!${NC}"
echo -e "${YELLOW}Откройте Telegram и найдите вашего бота${NC}"
echo ""

# Запуск бота
npm start


