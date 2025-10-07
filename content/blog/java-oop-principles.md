---
title: "Object-Oriented Programming trong Java"
date: 2025-08-05T10:00:00+07:00
draft: false
tags: ["Java", "OOP", "Class", "Object"]
categories: ["Java"]
description: "Tìm hiểu về Object-Oriented Programming và cách áp dụng trong Java"
featured_image: "/images/java-placeholder.jpg"
---

# Object-Oriented Programming trong Java

Object-Oriented Programming (OOP) là một paradigm lập trình dựa trên khái niệm "objects", chứa dữ liệu (attributes) và code (methods). Java được thiết kế hoàn toàn theo hướng OOP.

## Bốn nguyên lý cơ bản của OOP

### 1. Encapsulation (Đóng gói)

Encapsulation giúp che giấu implementation details và chỉ expose những gì cần thiết.

```java
public class BankAccount {
    private double balance; // Private field
    private String accountNumber;
    
    // Constructor
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    // Public methods để truy cập private fields
    public double getBalance() {
        return balance;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Đã gửi: " + amount + " VND");
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Đã rút: " + amount + " VND");
            return true;
        }
        return false;
    }
}
```

### 2. Inheritance (Kế thừa)

Inheritance cho phép class con kế thừa properties và methods từ class cha.

```java
// Base class
public class Animal {
    protected String name;
    protected int age;
    
    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void eat() {
        System.out.println(name + " đang ăn...");
    }
    
    public void sleep() {
        System.out.println(name + " đang ngủ...");
    }
}

// Derived class
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String breed) {
        super(name, age); // Gọi constructor của class cha
        this.breed = breed;
    }
    
    public void bark() {
        System.out.println(name + " đang sủa: Gâu gâu!");
    }
    
    @Override
    public void eat() {
        System.out.println(name + " đang ăn thức ăn cho chó...");
    }
}
```

### 3. Polymorphism (Đa hình)

Polymorphism cho phép cùng một interface có nhiều implementation khác nhau.

```java
// Abstract class
public abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Abstract method
    public abstract double getArea();
    
    // Concrete method
    public void displayInfo() {
        System.out.println("Hình " + color + " có diện tích: " + getArea());
    }
}

// Concrete implementations
public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
}

// Sử dụng polymorphism
public class ShapeDemo {
    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle("đỏ", 5.0),
            new Rectangle("xanh", 4.0, 6.0),
            new Circle("vàng", 3.0)
        };
        
        for (Shape shape : shapes) {
            shape.displayInfo(); // Polymorphism in action
        }
    }
}
```

### 4. Abstraction (Trừu tượng hóa)

Abstraction giúp che giấu complexity và chỉ show những gì cần thiết.

```java
// Interface
public interface Vehicle {
    void start();
    void stop();
    void accelerate();
}

// Implementation
public class Car implements Vehicle {
    private String brand;
    private boolean isRunning = false;
    
    public Car(String brand) {
        this.brand = brand;
    }
    
    @Override
    public void start() {
        isRunning = true;
        System.out.println(brand + " đã khởi động");
    }
    
    @Override
    public void stop() {
        isRunning = false;
        System.out.println(brand + " đã dừng");
    }
    
    @Override
    public void accelerate() {
        if (isRunning) {
            System.out.println(brand + " đang tăng tốc");
        } else {
            System.out.println("Xe chưa khởi động!");
        }
    }
}
```

## Best Practices trong OOP

### 1. Single Responsibility Principle
Mỗi class chỉ nên có một lý do để thay đổi.

```java
// Good: Tách biệt responsibilities
public class User {
    private String name;
    private String email;
    // Chỉ quản lý thông tin user
}

public class UserValidator {
    public boolean isValidEmail(String email) {
        return email.contains("@");
    }
}

public class UserRepository {
    public void save(User user) {
        // Logic lưu user vào database
    }
}
```

### 2. Composition over Inheritance
Ưu tiên composition thay vì inheritance khi có thể.

```java
// Composition example
public class Engine {
    public void start() {
        System.out.println("Engine started");
    }
}

public class Car {
    private Engine engine; // Composition
    
    public Car() {
        this.engine = new Engine();
    }
    
    public void start() {
        engine.start();
    }
}
```

### 3. Use Interfaces for Flexibility
```java
public interface PaymentProcessor {
    boolean processPayment(double amount);
}

public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // Credit card logic
        return true;
    }
}

public class PayPalProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // PayPal logic
        return true;
    }
}
```

## Lợi ích của OOP

1. **Code Reusability**: Tái sử dụng code thông qua inheritance
2. **Maintainability**: Dễ bảo trì và mở rộng
3. **Modularity**: Code được tổ chức thành modules độc lập
4. **Flexibility**: Dễ dàng thay đổi implementation
5. **Team Development**: Nhiều developer có thể làm việc song song

## Kết luận

OOP là foundation quan trọng của Java programming. Việc hiểu và áp dụng đúng các nguyên lý OOP sẽ giúp bạn viết code clean, maintainable và scalable.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **Collections Framework** trong Java - một trong những phần quan trọng nhất của Java API.
