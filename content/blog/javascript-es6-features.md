---
title: "JavaScript ES6+ - Những tính năng hiện đại"
date: 2025-08-19T10:00:00+07:00
draft: false
tags: ["JavaScript", "ES6", "Modern JavaScript", "ES2015"]
categories: ["JavaScript"]
description: "Tìm hiểu về các tính năng mới trong JavaScript ES6+ và cách sử dụng chúng"
featured_image: "/images/javascript-placeholder.jpg"
---

# JavaScript ES6+ - Những tính năng hiện đại

ES6 (ECMAScript 2015) đã mang đến một cuộc cách mạng cho JavaScript với nhiều tính năng mới giúp code trở nên sạch sẽ và dễ đọc hơn.

## Arrow Functions

Arrow functions cung cấp syntax ngắn gọn hơn cho việc viết functions.

```javascript
// ES5 - Function truyền thống
var multiply = function(a, b) {
    return a * b;
};

// ES6 - Arrow function
const multiply = (a, b) => a * b;

// Arrow function với một tham số
const square = x => x * x;

// Arrow function với nhiều dòng
const processData = (data) => {
    const processed = data.map(item => item * 2);
    return processed.filter(item => item > 10);
};

// Arrow function không có tham số
const getCurrentTime = () => new Date();
```

### Lexical `this` binding
Arrow functions không có `this` riêng, chúng kế thừa `this` từ scope cha.

```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }
    
    start() {
        // ES5 - cần bind this
        setInterval(function() {
            this.seconds++;
            console.log(this.seconds);
        }.bind(this), 1000);
        
        // ES6 - arrow function tự động bind this
        setInterval(() => {
            this.seconds++;
            console.log(this.seconds);
        }, 1000);
    }
}
```

## Template Literals

Template literals cho phép embed expressions và multiline strings.

```javascript
const name = "TaansFast";
const age = 25;
const city = "Hà Nội";

// ES5 - String concatenation
var message = "Xin chào, tôi là " + name + ", " + age + " tuổi, sống ở " + city;

// ES6 - Template literals
const message = `Xin chào, tôi là ${name}, ${age} tuổi, sống ở ${city}`;

// Multiline strings
const htmlTemplate = `
    <div class="user-card">
        <h2>${name}</h2>
        <p>Tuổi: ${age}</p>
        <p>Thành phố: ${city}</p>
    </div>
`;

// Expression trong template literals
const calculation = `Kết quả: ${2 + 3 * 4}`; // "Kết quả: 14"
```

## Destructuring Assignment

Destructuring cho phép extract values từ arrays hoặc objects.

```javascript
// Array destructuring
const colors = ['red', 'green', 'blue'];
const [first, second, third] = colors;
console.log(first);  // "red"
console.log(second); // "green"

// Object destructuring
const person = {
    name: 'TaansFast',
    age: 25,
    city: 'Hà Nội',
    email: 'nguyenvana@email.com'
};

const { name, age, city } = person;
console.log(name); // "TaansFast"

// Destructuring với default values
const { name, age, country = 'Việt Nam' } = person;

// Destructuring với alias
const { name: fullName, age: userAge } = person;

// Nested destructuring
const user = {
    profile: {
        personal: {
            name: 'TaansFast',
            age: 25
        },
        contact: {
            email: 'nguyenvana@email.com'
        }
    }
};

const { profile: { personal: { name }, contact: { email } } } = user;
```

## Spread Operator và Rest Parameters

### Spread Operator (...)
```javascript
// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Function arguments
const numbers = [1, 2, 3, 4, 5];
const max = Math.max(...numbers); // 5

// Copy arrays và objects
const originalArray = [1, 2, 3];
const copiedArray = [...originalArray];

const originalObject = { x: 1, y: 2 };
const copiedObject = { ...originalObject };
```

### Rest Parameters
```javascript
// Rest parameters trong functions
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest parameters với destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]
```

## Classes

ES6 giới thiệu class syntax cho JavaScript.

```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // Method
    greet() {
        return `Xin chào, tôi là ${this.name}`;
    }
    
    // Getter
    get info() {
        return `${this.name}, ${this.age} tuổi`;
    }
    
    // Setter
    set newAge(age) {
        if (age > 0) {
            this.age = age;
        }
    }
    
    // Static method
    static createAdult(name) {
        return new Person(name, 18);
    }
}

// Inheritance
class Student extends Person {
    constructor(name, age, school) {
        super(name, age); // Gọi constructor của class cha
        this.school = school;
    }
    
    study() {
        return `${this.name} đang học tại ${this.school}`;
    }
    
    // Override method
    greet() {
        return `Xin chào, tôi là ${this.name}, học sinh tại ${this.school}`;
    }
}

// Sử dụng
const student = new Student("TaansFast", 20, "Đại học Bách Khoa");
console.log(student.greet());
console.log(student.study());
```

## Modules (import/export)

ES6 modules cho phép organize code thành các modules riêng biệt.

```javascript
// math.js - Export named exports
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

// Default export
export default class Calculator {
    static divide(a, b) {
        return a / b;
    }
}

// utils.js
export const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN');
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// main.js - Import
import Calculator, { add, multiply, PI } from './math.js';
import { formatDate, formatCurrency } from './utils.js';

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
console.log(PI); // 3.14159
console.log(Calculator.divide(10, 2)); // 5

const today = new Date();
console.log(formatDate(today));
console.log(formatCurrency(1000000)); // "1.000.000 ₫"
```

## Promises và Async/Await

### Promises
```javascript
// Tạo Promise
const fetchUserData = (userId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({
                    id: userId,
                    name: 'TaansFast',
                    email: 'nguyenvana@email.com'
                });
            } else {
                reject(new Error('Invalid user ID'));
            }
        }, 1000);
    });
};

// Sử dụng Promise
fetchUserData(1)
    .then(user => {
        console.log('User data:', user);
        return fetchUserData(2);
    })
    .then(user => {
        console.log('Second user:', user);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });

// Promise.all
Promise.all([
    fetchUserData(1),
    fetchUserData(2),
    fetchUserData(3)
])
.then(users => {
    console.log('All users:', users);
})
.catch(error => {
    console.error('Error:', error);
});
```

### Async/Await
```javascript
// Async function
async function getUserData(userId) {
    try {
        const user = await fetchUserData(userId);
        console.log('User:', user);
        return user;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Sử dụng async/await
async function processUsers() {
    try {
        const user1 = await getUserData(1);
        const user2 = await getUserData(2);
        console.log('Both users loaded:', user1, user2);
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// Parallel execution với Promise.all
async function loadAllUsers() {
    try {
        const users = await Promise.all([
            getUserData(1),
            getUserData(2),
            getUserData(3)
        ]);
        console.log('All users loaded:', users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}
```

## Map và Set

### Map
```javascript
const userMap = new Map();

// Thêm data
userMap.set('user1', { name: 'TaansFast', age: 25 });
userMap.set('user2', { name: 'Trần Thị B', age: 30 });

// Lấy data
console.log(userMap.get('user1')); // { name: 'TaansFast', age: 25 }

// Kiểm tra key tồn tại
console.log(userMap.has('user1')); // true

// Xóa key
userMap.delete('user1');

// Iterate
for (const [key, value] of userMap) {
    console.log(key, value);
}

// Size
console.log(userMap.size); // 1
```

### Set
```javascript
const uniqueNumbers = new Set([1, 2, 3, 2, 1, 4]);
console.log(uniqueNumbers); // Set { 1, 2, 3, 4 }

// Thêm phần tử
uniqueNumbers.add(5);

// Kiểm tra phần tử tồn tại
console.log(uniqueNumbers.has(3)); // true

// Xóa phần tử
uniqueNumbers.delete(2);

// Iterate
for (const number of uniqueNumbers) {
    console.log(number);
}

// Convert to Array
const array = [...uniqueNumbers];
```

## Kết luận

ES6+ đã làm cho JavaScript trở nên mạnh mẽ và hiện đại hơn rất nhiều. Các tính năng như arrow functions, template literals, destructuring, classes, modules, và async/await đã giúp developer viết code sạch sẽ và dễ maintain hơn.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **Node.js** và cách xây dựng backend với JavaScript.
