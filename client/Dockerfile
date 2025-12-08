FROM node:22-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy rest of client code
COPY . .

EXPOSE 5173

# Vite dev server, accessible from outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
