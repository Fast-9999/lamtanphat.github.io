---
title: "Database và ORM - Quản lý dữ liệu trong ứng dụng"
date: 2025-07-08T10:00:00+07:00
draft: false
tags: ["Database", "ORM", "SQL", "NoSQL", "JPA"]
categories: ["Java"]
description: "Tìm hiểu về Database, ORM và cách quản lý dữ liệu trong ứng dụng Java và JavaScript"
featured_image: "https://lanit.com.vn/wp-content/uploads/2024/08/typescript-la-gi.jpg"
---

# Database và ORM - Quản lý dữ liệu trong ứng dụng

Database là thành phần quan trọng trong hầu hết các ứng dụng, và ORM (Object-Relational Mapping) giúp developer làm việc với database một cách dễ dàng hơn.

## Các loại Database

### 1. Relational Database (SQL)

#### MySQL
```sql
-- Tạo database
CREATE DATABASE blog_db;
USE blog_db;

-- Tạo bảng users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng posts
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng post_categories (many-to-many)
CREATE TABLE post_categories (
    post_id INT,
    category_id INT,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert dữ liệu mẫu
INSERT INTO users (name, email, password_hash) VALUES
('TaansFast', 'nguyenvana@email.com', 'hashed_password_1'),
('Trần Thị B', 'tranthib@email.com', 'hashed_password_2');

INSERT INTO categories (name, description) VALUES
('Java', 'Bài viết về lập trình Java'),
('JavaScript', 'Bài viết về JavaScript và frontend'),
('Database', 'Kiến thức về database');

INSERT INTO posts (title, content, author_id, published) VALUES
('Giới thiệu Java', 'Java là ngôn ngữ lập trình...', 1, TRUE),
('JavaScript ES6', 'ES6 mang đến nhiều tính năng mới...', 1, TRUE),
('MySQL Basics', 'MySQL là database phổ biến...', 2, FALSE);
```

#### PostgreSQL
```sql
-- Tạo database với PostgreSQL
CREATE DATABASE blog_db;
\c blog_db;

-- Tạo bảng với các kiểu dữ liệu PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. NoSQL Database

#### MongoDB
```javascript
// MongoDB với Node.js
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('blog_db');

// Collection users
const users = db.collection('users');

// Insert user
const user = {
    name: 'TaansFast',
    email: 'nguyenvana@email.com',
    password_hash: 'hashed_password',
    profile: {
        bio: 'Lập trình viên Java',
        avatar: 'avatar.jpg',
        social_links: {
            github: 'github.com/nguyenvana',
            linkedin: 'linkedin.com/in/nguyenvana'
        }
    },
    created_at: new Date()
};

await users.insertOne(user);

// Collection posts
const posts = db.collection('posts');

// Insert post
const post = {
    title: 'Giới thiệu Java',
    content: 'Java là ngôn ngữ lập trình...',
    author_id: user._id,
    categories: ['Java', 'Programming'],
    tags: ['java', 'oop', 'jvm'],
    published: true,
    created_at: new Date(),
    updated_at: new Date()
};

await posts.insertOne(post);

// Query với aggregation
const postsWithAuthors = await posts.aggregate([
    {
        $lookup: {
            from: 'users',
            localField: 'author_id',
            foreignField: '_id',
            as: 'author'
        }
    },
    {
        $unwind: '$author'
    },
    {
        $project: {
            title: 1,
            content: 1,
            'author.name': 1,
            'author.email': 1,
            published: 1,
            created_at: 1
        }
    }
]).toArray();
```

## ORM trong Java - JPA/Hibernate

### Entity Classes
```java
// User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
    public User() {}
    
    public User(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public List<Post> getPosts() { return posts; }
    public void setPosts(List<Post> posts) { this.posts = posts; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

// Post.java
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @Column(nullable = false)
    private Boolean published = false;
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "post_categories",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
    public Post() {}
    
    public Post(String title, String content, User author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    
    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }
    
    public Set<Category> getCategories() { return categories; }
    public void setCategories(Set<Category> categories) { this.categories = categories; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

// Category.java
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToMany(mappedBy = "categories")
    private Set<Post> posts = new HashSet<>();
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors, getters, setters
    public Category() {}
    
    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Set<Post> getPosts() { return posts; }
    public void setPosts(Set<Post> posts) { this.posts = posts; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
```

### Repository Layer
```java
// UserRepository.java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Query methods
    Optional<User> findByEmail(String email);
    
    List<User> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate")
    List<User> findUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT u FROM User u JOIN FETCH u.posts WHERE u.id = :userId")
    Optional<User> findByIdWithPosts(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE User u SET u.name = :name WHERE u.id = :userId")
    int updateUserName(@Param("userId") Long userId, @Param("name") String name);
    
    // Native query
    @Query(value = "SELECT * FROM users WHERE created_at >= :date", nativeQuery = true)
    List<User> findUsersCreatedAfterNative(@Param("date") LocalDateTime date);
}

// PostRepository.java
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    List<Post> findByPublishedTrue();
    
    List<Post> findByAuthorId(Long authorId);
    
    List<Post> findByTitleContainingIgnoreCase(String title);
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author JOIN FETCH p.categories WHERE p.published = true")
    List<Post> findPublishedPostsWithDetails();
    
    @Query("SELECT p FROM Post p WHERE p.author.id = :authorId AND p.published = :published")
    List<Post> findByAuthorAndPublished(@Param("authorId") Long authorId, @Param("published") Boolean published);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :authorId")
    long countByAuthor(@Param("authorId") Long authorId);
}
```

### Service Layer
```java
// UserService.java
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        
        user.setName(request.getName());
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email đã tồn tại!");
            }
            user.setEmail(request.getEmail());
        }
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        userRepository.delete(user);
    }
    
    public List<User> searchUsers(String keyword) {
        return userRepository.findByNameContainingIgnoreCase(keyword);
    }
}

// PostService.java
@Service
@Transactional
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    
    public List<Post> getPublishedPosts() {
        return postRepository.findByPublishedTrue();
    }
    
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }
    
    public Post createPost(CreatePostRequest request) {
        User author = userRepository.findById(request.getAuthorId())
            .orElseThrow(() -> new RuntimeException("Author không tồn tại!"));
        
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(author);
        post.setPublished(request.getPublished());
        
        // Add categories
        if (request.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            post.setCategories(new HashSet<>(categories));
        }
        
        return postRepository.save(post);
    }
    
    public Post updatePost(Long id, UpdatePostRequest request) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post không tồn tại!"));
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setPublished(request.getPublished());
        
        // Update categories
        if (request.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            post.setCategories(new HashSet<>(categories));
        }
        
        return postRepository.save(post);
    }
    
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post không tồn tại!"));
        postRepository.delete(post);
    }
    
    public List<Post> getPostsByAuthor(Long authorId) {
        return postRepository.findByAuthorId(authorId);
    }
    
    public List<Post> searchPosts(String keyword) {
        return postRepository.findByTitleContainingIgnoreCase(keyword);
    }
}
```

## ORM trong JavaScript - Mongoose

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên là bắt buộc'],
        trim: true,
        maxlength: [100, 'Tên không được quá 100 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    profile: {
        bio: String,
        avatar: String,
        socialLinks: {
            github: String,
            linkedin: String,
            twitter: String
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password trước khi save
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual để lấy posts của user
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

// Transform JSON output
userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);

// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    content: {
        type: String,
        required: [true, 'Nội dung là bắt buộc']
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Tóm tắt không được quá 500 ký tự']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    tags: [String],
    published: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

// Index cho search
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ published: 1, publishedAt: -1 });
postSchema.index({ author: 1, published: 1 });

// Pre-save middleware
postSchema.pre('save', function(next) {
    if (this.published && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Virtual cho số lượng comments
postSchema.virtual('commentCount').get(function() {
    return this.comments ? this.comments.length : 0;
});

// Virtual cho số lượng likes
postSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

module.exports = mongoose.model('Post', postSchema);

// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên category là bắt buộc'],
        unique: true,
        trim: true,
        maxlength: [50, 'Tên category không được quá 50 ký tự']
    },
    description: {
        type: String,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    color: {
        type: String,
        default: '#007bff'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Pre-save middleware để tạo slug
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
```

## Database Connection và Configuration

### Spring Boot Configuration
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog_db?useSSL=false&serverTimezone=UTC
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
        
  h2:
    console:
      enabled: true
      path: /h2-console
      
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### Node.js Configuration
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

// .env
MONGODB_URI=mongodb://localhost:27017/blog_db
NODE_ENV=development
```

## Best Practices

### 1. Database Design
- Sử dụng proper indexing
- Normalize data appropriately
- Use foreign keys và constraints
- Plan for scalability

### 2. ORM Best Practices
- Use lazy loading appropriately
- Avoid N+1 queries
- Use transactions when needed
- Implement proper error handling

### 3. Security
- Use parameterized queries
- Implement proper authentication
- Encrypt sensitive data
- Regular security audits

## Kết luận

Database và ORM là những thành phần quan trọng trong việc phát triển ứng dụng. Việc hiểu rõ về database design, ORM patterns, và best practices sẽ giúp bạn xây dựng các ứng dụng robust và scalable.

Trong bài tiếp theo, chúng ta sẽ tìm hiểu về **API Development** - cách xây dựng RESTful APIs và GraphQL.
