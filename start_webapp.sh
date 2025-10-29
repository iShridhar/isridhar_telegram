#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 iiSridhar Telegram Mini App - Запуск${NC}"
echo ""

# Проверка .env файла
if [ ! -f .env ]; then
    echo -e "${RED}❌ Файл .env не найден!${NC}"
    echo "Создайте .env файл на основе .env.example:"
    echo "  cp .env.example .env"
    exit 1
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
echo -e "${BLUE}🚀 Запуск Web App сервера...${NC}"
echo ""

# Запуск web app
npm run webapp


