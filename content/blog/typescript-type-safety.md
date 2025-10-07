---
title: "TypeScript - JavaScript với Type Safety"
date: 2025-09-09T10:00:00+07:00
draft: false
tags: ["TypeScript", "JavaScript", "Type Safety", "Frontend", "Backend"]
categories: ["JavaScript"]
description: "Tìm hiểu về TypeScript và cách nó giúp phát triển ứng dụng JavaScript an toàn và hiệu quả hơn"
featured: true
featured_image: "/images/typescript-placeholder.jpg"
featured_badge: "Hot"
views: 850
likes: 45
reading_time: 12
---

# TypeScript - JavaScript với Type Safety

TypeScript là một superset của JavaScript được phát triển bởi Microsoft, thêm static type checking vào JavaScript. Nó giúp phát triển ứng dụng lớn và phức tạp một cách an toàn và hiệu quả hơn.

## Tại sao cần TypeScript?

### 1. Type Safety

TypeScript giúp phát hiện lỗi tại compile time thay vì runtime.

```javascript
// JavaScript - lỗi chỉ phát hiện khi chạy
function add(a, b) {
  return a + b;
}

console.log(add(5, "10")); // "510" - không phải kết quả mong muốn
```

```typescript
// TypeScript - lỗi được phát hiện ngay khi viết code
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(5, "10")); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

### 2. Better IDE Support

IntelliSense, auto-completion và refactoring tốt hơn.

### 3. Easier Refactoring

Thay đổi code an toàn hơn với type checking.

### 4. Self-Documenting Code

Types giúp code tự giải thích và dễ hiểu hơn.

## Cài đặt TypeScript

### Global Installation

```bash
npm install -g typescript
```

### Local Installation

```bash
npm install --save-dev typescript
npm install --save-dev @types/node
```

### Compile TypeScript

```bash
tsc filename.ts
```

## Basic Types

### Primitive Types

```typescript
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["John", "Jane", "Bob"];

// Tuples
let person: [string, number] = ["John", 30];
```

### Object Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

let user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

// Type with methods
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

class BasicCalculator implements Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

## Advanced Types

### Union Types

```typescript
let id: string | number;
id = "123"; // OK
id = 123; // OK
id = true; // Error

// Function with union return type
function getValue(): string | number {
  return Math.random() > 0.5 ? "hello" : 42;
}
```

### Intersection Types

```typescript
interface Person {
  name: string;
}

interface Employee {
  employeeId: number;
}

type EmployeePerson = Person & Employee;

let employee: EmployeePerson = {
  name: "John",
  employeeId: 123,
};
```

### Generic Types

```typescript
interface Container<T> {
  value: T;
  getValue(): T;
}

let stringContainer: Container<string> = {
  value: "Hello",
  getValue(): string {
    return this.value;
  },
};

let numberContainer: Container<number> = {
  value: 42,
  getValue(): number {
    return this.value;
  },
};

// Generic functions
function identity<T>(arg: T): T {
  return arg;
}

let stringResult = identity<string>("hello");
let numberResult = identity<number>(42);
```

## Classes và Inheritance

```typescript
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  public speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  private breed: string;

  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }

  public speak(): void {
    console.log(`${this.name} barks`);
  }

  public getBreed(): string {
    return this.breed;
  }
}

let dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // "Buddy barks"
```

## Enums

```typescript
enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

enum Direction {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
}

let currentStatus: Status = Status.PENDING;
let direction: Direction = Direction.UP;
```

## Modules và Namespaces

### ES6 Modules

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export default class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// main.ts
import Calculator, { add, subtract } from "./math";

console.log(add(5, 3)); // 8
console.log(subtract(5, 3)); // 2

let calc = new Calculator();
console.log(calc.multiply(4, 5)); // 20
```

## Type Guards và Type Assertions

### Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    // TypeScript biết value là string ở đây
    console.log(value.toUpperCase());
  } else {
    // TypeScript biết value là number ở đây
    console.log(value.toFixed(2));
  }
}
```

### Type Assertions

```typescript
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;

// Alternative syntax
let strLength2: number = (<string>someValue).length;
```

## Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - tất cả properties thành optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Pick - chỉ lấy một số properties
type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

// Omit - loại bỏ một số properties
type CreateUser = Omit<User, "id">;
// { name: string; email: string; password: string; }

// Record - tạo object type với key và value types
type UserRoles = Record<string, string[]>;
// { [key: string]: string[] }
```

## Async/Await với TypeScript

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Usage
async function getUserData() {
  try {
    const result = await fetchUser(1);
    console.log(result.data.name);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
```

## Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Best Practices

### 1. Sử dụng Interface cho Object Shapes

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Thay vì
type User = {
  id: number;
  name: string;
  email: string;
};
```

### 2. Sử dụng Type cho Unions và Primitives

```typescript
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
```

### 3. Strict Mode

Luôn bật strict mode trong tsconfig.json để có type checking tốt nhất.

### 4. Avoid `any`

```typescript
// Bad
function processData(data: any) {
  return data.someProperty;
}

// Good
function processData(data: unknown) {
  if (typeof data === "object" && data !== null && "someProperty" in data) {
    return (data as { someProperty: unknown }).someProperty;
  }
  throw new Error("Invalid data");
}
```

### 5. Sử dụng Generic Constraints

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

## TypeScript với React

```typescript
import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  return (
    <div>
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onUserSelect(user)}
          className={selectedUser?.id === user.id ? "selected" : ""}
        >
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
};

export default UserList;
```

## TypeScript với Node.js

```typescript
import express, { Request, Response, NextFunction } from "express";
import { User } from "./types/User";

const app = express();

interface CustomRequest extends Request {
  user?: User;
}

app.get(
  "/api/users/:id",
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

async function getUserById(id: number): Promise<User | null> {
  // Implementation here
  return null;
}
```

## Kết luận

TypeScript mang lại nhiều lợi ích cho việc phát triển JavaScript:

- **Type Safety**: Phát hiện lỗi sớm hơn
- **Better Developer Experience**: IDE support tốt hơn
- **Maintainability**: Code dễ bảo trì và refactor
- **Documentation**: Types như documentation sống
- **Team Collaboration**: Giảm bugs khi làm việc nhóm

Mặc dù có learning curve ban đầu, nhưng lợi ích lâu dài của TypeScript rất đáng giá, đặc biệt cho các dự án lớn và phức tạp.

## Tài liệu tham khảo

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
