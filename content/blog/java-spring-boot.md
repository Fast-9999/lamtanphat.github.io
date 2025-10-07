---
title: "Spring Boot - Framework Java phổ biến nhất"
date: 2025-08-12T10:00:00+07:00
draft: false
tags: ["Java", "Spring Boot", "Framework", "Web Development"]
categories: ["Java"]
description: "Tìm hiểu về Spring Boot và cách xây dựng ứng dụng web với Spring Boot"
featured: true
featured_image: "/images/java-placeholder.jpg"
featured_badge: "Hot"
views: 1250
likes: 89
---

# Spring Boot - Framework Java phổ biến nhất

Spring Boot là một framework Java được xây dựng trên Spring Framework, giúp tạo ra các ứng dụng Java độc lập và production-ready một cách nhanh chóng.

## Tại sao Spring Boot?

### 1. Auto Configuration
Spring Boot tự động cấu hình các beans dựa trên dependencies có trong classpath.

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 2. Embedded Server
Không cần deploy WAR file, Spring Boot có embedded Tomcat, Jetty hoặc Undertow.

### 3. Production Ready
Có sẵn các tính năng như health checks, metrics, externalized configuration.

## Tạo ứng dụng Spring Boot đầu tiên

### Bước 1: Tạo project với Spring Initializr

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### Bước 2: Tạo Entity

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    // Constructors, getters, setters
    public User() {}
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

### Bước 3: Tạo Repository

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
}
```

### Bước 4: Tạo Service

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        userRepository.delete(user);
    }
}
```

### Bước 5: Tạo REST Controller

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

## Configuration với application.properties

```properties
# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password

# JPA configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Server configuration
server.port=8080

# Logging
logging.level.org.springframework.web=DEBUG
logging.level.com.example=DEBUG
```

## Testing với Spring Boot

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testCreateUser() {
        User user = new User("TaansFast", "nguyenvana@email.com");
        User createdUser = userService.createUser(user);
        
        assertThat(createdUser.getId()).isNotNull();
        assertThat(createdUser.getName()).isEqualTo("TaansFast");
        assertThat(createdUser.getEmail()).isEqualTo("nguyenvana@email.com");
    }
    
    @Test
    void testGetAllUsers() {
        List<User> users = userService.getAllUsers();
        assertThat(users).isNotEmpty();
    }
}
```

## Spring Boot Actuator

Thêm dependency để monitor ứng dụng:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Các endpoints hữu ích:
- `/actuator/health` - Health check
- `/actuator/info` - Application info
- `/actuator/metrics` - Application metrics

## Best Practices

### 1. Package Structure
```
com.example.app/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── config/
└── Application.java
```

### 2. Exception Handling
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

### 3. Validation
```java
@Entity
public class User {
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 50, message = "Tên phải từ 2-50 ký tự")
    private String name;
    
    @Email(message = "Email không hợp lệ")
    private String email;
}
```

## Kết luận

Spring Boot giúp developer Java tạo ra ứng dụng web một cách nhanh chóng và hiệu quả. Với auto-configuration, embedded server và production-ready features, Spring Boot là lựa chọn hàng đầu cho enterprise applications.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **Spring Security** để bảo mật ứng dụng Spring Boot.
