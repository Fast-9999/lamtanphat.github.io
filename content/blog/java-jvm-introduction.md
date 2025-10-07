---
title: "Giới thiệu về Java và JVM"
date: 2025-07-29T10:00:00+07:00
draft: false
tags: ["Java", "JVM", "Cơ bản"]
categories: ["Java"]
description: "Tìm hiểu về ngôn ngữ lập trình Java và Java Virtual Machine (JVM)"
featured_image: "/images/java-placeholder.jpg"
---

# Giới thiệu về Java và JVM

Java là một trong những ngôn ngữ lập trình phổ biến nhất thế giới, được phát triển bởi Sun Microsystems (nay thuộc Oracle) vào năm 1995. Java được thiết kế với triết lý "Write Once, Run Anywhere" (WORA).

## Đặc điểm nổi bật của Java

### 1. Platform Independent
Java code được biên dịch thành bytecode, có thể chạy trên bất kỳ platform nào có JVM.

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 2. Object-Oriented Programming
Java là ngôn ngữ thuần OOP với các tính năng:
- **Encapsulation**: Đóng gói dữ liệu và phương thức
- **Inheritance**: Kế thừa giữa các class
- **Polymorphism**: Đa hình
- **Abstraction**: Trừu tượng hóa

### 3. Memory Management
Java có Garbage Collector tự động quản lý bộ nhớ, giúp developer không cần lo lắng về memory leak.

## Java Virtual Machine (JVM)

JVM là thành phần quan trọng nhất của Java platform:

### Cách hoạt động của JVM

1. **Class Loader**: Tải các class file vào memory
2. **Execution Engine**: Thực thi bytecode
3. **Memory Areas**: Quản lý các vùng nhớ khác nhau

### Các vùng nhớ trong JVM

- **Method Area**: Chứa class metadata
- **Heap**: Chứa objects và arrays
- **Stack**: Chứa method frames
- **PC Register**: Chứa địa chỉ instruction hiện tại
- **Native Method Stack**: Chứa native method calls

## JDK vs JRE vs JVM

- **JVM (Java Virtual Machine)**: Môi trường runtime để thực thi bytecode
- **JRE (Java Runtime Environment)**: Bao gồm JVM + libraries cần thiết để chạy Java applications
- **JDK (Java Development Kit)**: Bao gồm JRE + development tools (compiler, debugger, etc.)

## Cài đặt và chạy chương trình Java đầu tiên

### Bước 1: Cài đặt JDK
```bash
# Kiểm tra phiên bản Java
java -version
javac -version
```

### Bước 2: Viết chương trình
```java
public class FirstProgram {
    public static void main(String[] args) {
        System.out.println("Chào mừng đến với Java!");
        System.out.println("Hôm nay là: " + new java.util.Date());
    }
}
```

### Bước 3: Biên dịch và chạy
```bash
javac FirstProgram.java
java FirstProgram
```

## Lợi ích của việc học Java

1. **Cộng đồng lớn**: Nhiều tài liệu và hỗ trợ
2. **Enterprise applications**: Được sử dụng rộng rãi trong doanh nghiệp
3. **Android development**: Ngôn ngữ chính thức cho Android
4. **Spring ecosystem**: Framework mạnh mẽ cho web development
5. **Job opportunities**: Nhiều cơ hội việc làm

## Kết luận

Java là một ngôn ngữ lập trình mạnh mẽ và linh hoạt, phù hợp cho cả người mới bắt đầu và developer có kinh nghiệm. Việc hiểu rõ về JVM và cách Java hoạt động sẽ giúp bạn trở thành một Java developer tốt hơn.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **Object-Oriented Programming** trong Java. Hãy theo dõi blog để không bỏ lỡ!
