# Використання офіційного образу Node.js LTS
FROM node:lts

# Встановлення робочої директорії в контейнері
WORKDIR /server

# Копіюємо package.json та package-lock.json для встановлення залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код у контейнер
COPY . .

# Відкриваємо порт 3000 для доступу до додатку
EXPOSE 3000

# Команда для запуску додатка
CMD ["node", "server.js"]
