# 🤝 Участие в разработке

Спасибо за интерес к проекту **iiSridhar Telegram Bot**! Мы приветствуем любой вклад.

## 📋 Как внести вклад

### 1. 🐛 Сообщить об ошибке

1. Проверьте, не создана ли уже подобная issue
2. Создайте новую issue с подробным описанием:
   - Шаги для воспроизведения
   - Ожидаемое поведение
   - Фактическое поведение
   - Версия Node.js и ОС
   - Логи ошибок

### 2. 💡 Предложить улучшение

1. Создайте issue с описанием функции
2. Объясните, зачем это нужно
3. Предложите возможную реализацию

### 3. 🔧 Исправить баг или добавить функцию

#### Шаги:

1. **Fork репозитория**
   ```bash
   git clone https://github.com/yourusername/iisridhar-bot.git
   cd iisridhar-bot/iiSridhar_telegram
   ```

2. **Создайте ветку**
   ```bash
   git checkout -b feature/amazing-feature
   # или
   git checkout -b fix/bug-description
   ```

3. **Установите зависимости**
   ```bash
   npm install
   ```

4. **Внесите изменения**
   - Следуйте стилю кода проекта
   - Добавьте комментарии
   - Обновите документацию при необходимости

5. **Тестирование**
   ```bash
   npm test  # когда будут добавлены тесты
   ```

6. **Commit изменений**
   ```bash
   git add .
   git commit -m "feat: добавлена amazing feature"
   ```
   
   Используйте [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - новая функция
   - `fix:` - исправление бага
   - `docs:` - изменения в документации
   - `style:` - форматирование кода
   - `refactor:` - рефакторинг
   - `test:` - добавление тестов
   - `chore:` - обновление зависимостей и т.д.

7. **Push в GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Создайте Pull Request**
   - Опишите изменения
   - Приложите скриншоты (если UI)
   - Укажите связанные issues

## 📝 Стандарты кода

### JavaScript/ES6

- Используйте ES6+ синтаксис
- Предпочитайте `const` и `let` вместо `var`
- Используйте async/await вместо callbacks
- Добавляйте JSDoc комментарии к функциям

```javascript
/**
 * Генерирует ответ AI
 * @param {Array} messages - Массив сообщений
 * @param {string} mode - Режим работы
 * @param {string} language - Язык
 * @returns {Promise<string>} Ответ AI
 */
async function generate(messages, mode, language) {
  // ...
}
```

### Именование

- Файлы: `snake_case.js` или `camelCase.js`
- Переменные и функции: `camelCase`
- Классы: `PascalCase`
- Константы: `UPPER_CASE`

### Структура

```javascript
// 1. Imports
import { Bot } from 'grammy';
import { config } from './config.js';

// 2. Constants
const DEFAULT_TIMEOUT = 5000;

// 3. Classes/Functions
class MyClass {
  // ...
}

// 4. Exports
export { MyClass };
```

## 🧪 Тестирование

```bash
# Запуск тестов (в разработке)
npm test

# Проверка линтера
npm run lint

# Форматирование
npm run format
```

## 📚 Документация

При добавлении новых функций:

1. Обновите README.md
2. Добавьте примеры использования
3. Обновите CHANGELOG.md
4. Добавьте JSDoc комментарии

## 🎯 Приоритетные задачи

### Высокий приоритет
- [ ] Добавить unit тесты
- [ ] Добавить интеграционные тесты
- [ ] Улучшить обработку ошибок
- [ ] Добавить rate limiting

### Средний приоритет
- [ ] Поддержка голосовых сообщений
- [ ] Поддержка изображений (vision)
- [ ] Экспорт истории диалогов
- [ ] Админ панель

### Низкий приоритет
- [ ] Telegram payments интеграция
- [ ] Поддержка групповых чатов
- [ ] Gamification (достижения)
- [ ] Интеграция с другими AI моделями

## 🌟 Области для помощи

- **Frontend** - улучшение Mini App интерфейса
- **Backend** - оптимизация производительности
- **AI/ML** - улучшение промптов и контекста
- **DevOps** - Docker, CI/CD, мониторинг
- **Документация** - переводы, примеры
- **Testing** - написание тестов
- **Design** - UI/UX улучшения

## 💬 Связь

- **Telegram**: [@yourusername](https://t.me/yourusername)
- **Email**: your@email.com
- **Issues**: [GitHub Issues](https://github.com/yourrepo/issues)

## 📜 Лицензия

Внося вклад в проект, вы соглашаетесь, что ваш код будет опубликован под MIT лицензией.

## 🙏 Благодарности

Спасибо всем контрибьюторам:

- [@contributor1](https://github.com/contributor1)
- [@contributor2](https://github.com/contributor2)

---

**Вместе мы делаем мир лучше! 🕉️**

