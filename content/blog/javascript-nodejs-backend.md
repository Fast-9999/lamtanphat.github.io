---
title: "Node.js - JavaScript trên Server"
date: 2025-08-26T10:00:00+07:00
draft: false
tags: ["JavaScript", "Node.js", "Backend", "Express.js"]
categories: ["JavaScript"]
description: "Tìm hiểu về Node.js và cách xây dựng ứng dụng backend với JavaScript"
featured: true
featured_image: "/images/javascript-placeholder.jpg"
featured_badge: "Trending"
views: 1800
likes: 124
---

# Node.js - JavaScript trên Server

Node.js là một JavaScript runtime được xây dựng trên Chrome's V8 JavaScript engine, cho phép chạy JavaScript trên server-side.

## Tại sao Node.js?

### 1. Single Language
Sử dụng JavaScript cho cả frontend và backend.

### 2. Non-blocking I/O
Event-driven, non-blocking I/O model giúp ứng dụng lightweight và efficient.

### 3. NPM Ecosystem
Hệ sinh thái package manager lớn nhất thế giới.

### 4. Real-time Applications
Rất phù hợp cho chat apps, gaming, collaboration tools.

## Cài đặt và Hello World

### Cài đặt Node.js
```bash
# Kiểm tra phiên bản
node --version
npm --version

# Tạo project mới
mkdir my-node-app
cd my-node-app
npm init -y
```

### Hello World với HTTP Server
```javascript
// server.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Xin chào từ Node.js!</h1>');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

## Express.js Framework

Express.js là web framework phổ biến nhất cho Node.js.

### Cài đặt Express
```bash
npm install express
```

### Basic Express App
```javascript
// app.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware để parse JSON
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với Express.js!' });
});

app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'TaansFast', email: 'nguyenvana@email.com' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com' }
    ];
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    const newUser = {
        id: Date.now(),
        name,
        email
    };
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

## Middleware trong Express

Middleware là functions được thực thi trong chuỗi request-response.

```javascript
// Custom middleware
const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Có lỗi xảy ra!' });
};

// Sử dụng middleware
app.use(logger);
app.use(errorHandler);

// Built-in middleware
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
```

## RESTful API với Express

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// Mock database
let users = [
    { id: 1, name: 'TaansFast', email: 'nguyenvana@email.com', age: 25 },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', age: 30 }
];

// GET /api/users
router.get('/', (req, res) => {
    res.json(users);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User không tồn tại' });
    }
    res.json(user);
});

// POST /api/users
router.post('/', (req, res) => {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name và email là bắt buộc' });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        age: age || 0
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User không tồn tại' });
    }
    
    const { name, email, age } = req.body;
    users[userIndex] = { ...users[userIndex], name, email, age };
    
    res.json(users[userIndex]);
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User không tồn tại' });
    }
    
    users.splice(userIndex, 1);
    res.status(204).send();
});

module.exports = router;
```

```javascript
// app.js - Sử dụng routes
const express = require('express');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

## File System và Path Module

```javascript
const fs = require('fs').promises;
const path = require('path');

// Đọc file
async function readFile() {
    try {
        const data = await fs.readFile('data.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.error('Lỗi đọc file:', error);
    }
}

// Ghi file
async function writeFile() {
    try {
        await fs.writeFile('output.txt', 'Nội dung file mới', 'utf8');
        console.log('File đã được ghi thành công');
    } catch (error) {
        console.error('Lỗi ghi file:', error);
    }
}

// Làm việc với đường dẫn
const filePath = path.join(__dirname, 'data', 'users.json');
console.log('File path:', filePath);
console.log('Directory name:', path.dirname(filePath));
console.log('File name:', path.basename(filePath));
console.log('File extension:', path.extname(filePath));
```

## Environment Variables và Configuration

```javascript
// Cài đặt dotenv
// npm install dotenv

require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    nodeEnv: process.env.NODE_ENV || 'development'
};

console.log('Config:', config);
```

```bash
# .env file
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

## Error Handling và Async/Await

```javascript
// Async function với error handling
const asyncFunction = async () => {
    try {
        const result = await someAsyncOperation();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Express route với async/await
app.get('/api/data', async (req, res) => {
    try {
        const data = await fetchDataFromDatabase();
        res.json(data);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
```

## Testing với Jest

```bash
npm install --save-dev jest supertest
```

```javascript
// tests/app.test.js
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
    test('GET /api/users should return users', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200);
        
        expect(response.body).toBeInstanceOf(Array);
    });
    
    test('POST /api/users should create new user', async () => {
        const newUser = {
            name: 'Test User',
            email: 'test@email.com',
            age: 25
        };
        
        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);
        
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.email).toBe(newUser.email);
    });
});
```

## Package.json Scripts

```json
{
    "scripts": {
        "start": "node app.js",
        "dev": "nodemon app.js",
        "test": "jest",
        "test:watch": "jest --watch",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix"
    }
}
```

## Best Practices

### 1. Project Structure
```
my-node-app/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── tests/
├── config/
├── app.js
└── server.js
```

### 2. Security
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### 3. Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
```

## Kết luận

Node.js đã cách mạng hóa việc phát triển backend bằng JavaScript. Với Express.js, chúng ta có thể tạo ra các RESTful API mạnh mẽ và scalable. Non-blocking I/O và event-driven architecture làm cho Node.js rất phù hợp cho real-time applications.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **React.js** - một trong những frontend framework phổ biến nhất hiện nay.
