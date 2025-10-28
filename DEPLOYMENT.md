# 🚀 Руководство по деплою

## Варианты развертывания

### 1. 🖥️ На собственном сервере (VPS/Dedicated)

#### Требования
- Ubuntu 20.04+ / Debian 11+
- Node.js 18+
- PM2 для управления процессами
- Nginx (опционально, для Web App)
- SSL сертификат (для Web App)

#### Установка

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Клонирование проекта
git clone <your-repo-url> /opt/iisridhar-bot
cd /opt/iisridhar-bot/iiSridhar_telegram

# Установка зависимостей
npm install --production

# Настройка .env
cp .env.example .env
nano .env  # Заполните токены

# Создание директорий
mkdir -p data/sessions

# Запуск бота
pm2 start src/index.js --name iisridhar-bot
pm2 start src/webapp/server.js --name iisridhar-webapp

# Автозапуск при перезагрузке
pm2 startup
pm2 save

# Проверка статуса
pm2 status
pm2 logs iisridhar-bot
```

#### Настройка Nginx (для Web App)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Получите SSL сертификат с Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. 🐳 Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Копирование зависимостей
COPY package*.json ./
RUN npm ci --production

# Копирование кода
COPY . .

# Создание директорий
RUN mkdir -p data/sessions

# Запуск
CMD ["node", "src/index.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  bot:
    build: .
    container_name: iisridhar-bot
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    networks:
      - iisridhar-network

  webapp:
    build: .
    container_name: iisridhar-webapp
    command: node src/webapp/server.js
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    networks:
      - iisridhar-network

networks:
  iisridhar-network:
    driver: bridge
```

Запуск:
```bash
docker-compose up -d
docker-compose logs -f
```

### 3. ☁️ Heroku

#### Подготовка

1. Установите Heroku CLI
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. Создайте приложение
```bash
heroku create iisridhar-bot
```

3. Установите переменные окружения
```bash
heroku config:set BOT_TOKEN=your_token
heroku config:set OPENAI_API_KEY=your_key
heroku config:set USE_LOCAL_AI=false
```

4. Создайте Procfile
```
web: node src/webapp/server.js
worker: node src/index.js
```

5. Деплой
```bash
git push heroku main
heroku ps:scale worker=1 web=1
heroku logs --tail
```

### 4. 🚀 Railway

1. Перейдите на [Railway.app](https://railway.app)
2. Создайте новый проект из GitHub репозитория
3. Добавьте переменные окружения
4. Railway автоматически задеплоит приложение

### 5. ☁️ Google Cloud Run

```bash
# Аутентификация
gcloud auth login

# Создание проекта
gcloud projects create iisridhar-bot

# Сборка контейнера
gcloud builds submit --tag gcr.io/iisridhar-bot/bot

# Деплой
gcloud run deploy iisridhar-bot \
  --image gcr.io/iisridhar-bot/bot \
  --platform managed \
  --region us-central1 \
  --set-env-vars BOT_TOKEN=your_token,OPENAI_API_KEY=your_key
```

### 6. 🌊 DigitalOcean App Platform

1. Создайте App в DigitalOcean
2. Подключите GitHub репозиторий
3. Установите переменные окружения
4. Настройте автодеплой

## 🔒 Безопасность

### Рекомендации

1. **Не коммитьте .env файл**
   - Добавьте `.env` в `.gitignore`
   - Используйте environment variables на сервере

2. **Защитите базу данных**
   ```bash
   chmod 600 data/bot.db
   ```

3. **Регулярно обновляйте зависимости**
   ```bash
   npm audit
   npm update
   ```

4. **Используйте firewall**
   ```bash
   sudo ufw enable
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   ```

5. **Мониторинг логов**
   ```bash
   pm2 logs
   pm2 monit
   ```

## 📊 Мониторинг

### PM2 Monitoring

```bash
# Установка модуля мониторинга
pm2 install pm2-logrotate

# Настройка ротации логов
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Web dashboard
pm2 web
```

### Health Check

Создайте `/health` endpoint в Web App:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});
```

## 🔄 Обновление

```bash
# С PM2
cd /opt/iisridhar-bot/iiSridhar_telegram
git pull
npm install
pm2 restart all

# С Docker
docker-compose pull
docker-compose up -d
```

## 📈 Масштабирование

### Горизонтальное масштабирование

```bash
# Запуск нескольких инстансов с PM2
pm2 start src/index.js -i 4 --name iisridhar-bot
```

### Использование Redis для сессий

```javascript
// Замените локальные сессии на Redis
import { Redis } from '@grammyjs/redis';

const redis = new Redis({ url: process.env.REDIS_URL });
bot.use(session({ storage: redis }));
```

## 🆘 Проблемы и решения

### Бот падает при запуске
- Проверьте логи: `pm2 logs`
- Убедитесь, что все env переменные установлены
- Проверьте права доступа к `data/` директории

### Высокое использование памяти
- Ограничьте историю сообщений в контексте
- Используйте Redis для сессий
- Настройте PM2 автоперезапуск при превышении лимита

```bash
pm2 start src/index.js --max-memory-restart 500M
```

### Медленные ответы
- Проверьте OpenAI API лимиты
- Оптимизируйте промпты
- Используйте кеширование

---

Сделано с 🙏 и ❤️

