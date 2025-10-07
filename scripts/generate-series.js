const fs = require('fs');
const path = require('path');

// Series configuration
const series = [
    {
        name: "Java từ Zero to Hero",
        slug: "java-zero-to-hero",
        total: 10,
        posts: [
            { title: "Giới thiệu Java và JVM", slug: "java-introduction-jvm", order: 1 },
            { title: "Cài đặt môi trường Java", slug: "java-setup-environment", order: 2 },
            { title: "Cú pháp cơ bản Java", slug: "java-basic-syntax", order: 3 },
            { title: "OOP trong Java", slug: "java-oop-principles", order: 4 },
            { title: "Collections Framework", slug: "java-collections", order: 5 },
            { title: "Exception Handling", slug: "java-exception-handling", order: 6 },
            { title: "File I/O và Streams", slug: "java-file-io-streams", order: 7 },
            { title: "Multithreading", slug: "java-multithreading", order: 8 },
            { title: "Spring Boot cơ bản", slug: "java-spring-boot-basic", order: 9 },
            { title: "Xây dựng REST API", slug: "java-rest-api", order: 10 }
        ]
    },
    {
        name: "JavaScript ES6+ Complete Guide",
        slug: "javascript-es6-complete",
        total: 8,
        posts: [
            { title: "ES6 Features Overview", slug: "javascript-es6-overview", order: 1 },
            { title: "Arrow Functions và this", slug: "javascript-arrow-functions", order: 2 },
            { title: "Destructuring Assignment", slug: "javascript-destructuring", order: 3 },
            { title: "Template Literals", slug: "javascript-template-literals", order: 4 },
            { title: "Modules và Import/Export", slug: "javascript-modules", order: 5 },
            { title: "Promises và Async/Await", slug: "javascript-promises-async", order: 6 },
            { title: "Classes và Inheritance", slug: "javascript-classes", order: 7 },
            { title: "Modern JavaScript Patterns", slug: "javascript-modern-patterns", order: 8 }
        ]
    },
    {
        name: "React Hooks Mastery",
        slug: "react-hooks-mastery",
        total: 6,
        posts: [
            { title: "useState Hook", slug: "react-usestate-hook", order: 1 },
            { title: "useEffect Hook", slug: "react-useeffect-hook", order: 2 },
            { title: "useContext Hook", slug: "react-usecontext-hook", order: 3 },
            { title: "useReducer Hook", slug: "react-usereducer-hook", order: 4 },
            { title: "Custom Hooks", slug: "react-custom-hooks", order: 5 },
            { title: "Advanced Hooks Patterns", slug: "react-advanced-hooks", order: 6 }
        ]
    }
];

function generateSeriesPosts() {
    const contentDir = path.join(process.cwd(), 'content', 'blog');
    
    // Ensure content directory exists
    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }
    
    series.forEach(seriesItem => {
        console.log(`\n📚 Generating series: ${seriesItem.name}`);
        
        seriesItem.posts.forEach(post => {
            const fileName = `${post.slug}.md`;
            const filePath = path.join(contentDir, fileName);
            
            // Check if file already exists
            if (fs.existsSync(filePath)) {
                console.log(`⚠️  File already exists: ${fileName}`);
                return;
            }
            
            // Generate front matter
            const frontMatter = `---
title: "${post.title}"
date: ${new Date().toISOString()}
draft: true
tags: ["${seriesItem.name.split(' ')[0]}", "Tutorial", "Series"]
categories: ["${seriesItem.name.split(' ')[0]}"]
description: "Bài ${post.order} trong series ${seriesItem.name} - ${post.title}"
featured: ${post.order === 1}
featured_image: "/images/${post.slug}-featured.jpg"
series: "${seriesItem.name}"
series_order: ${post.order}
series_total: ${seriesItem.total}
reading_time: 15
difficulty: "Beginner"
prerequisites: ["Kiến thức cơ bản về lập trình"]
learning_objectives: 
  - "Hiểu được khái niệm cơ bản"
  - "Áp dụng vào thực tế"
  - "Viết code thành thạo"
---

# ${post.title}

## 📋 Tóm tắt bài viết

Trong bài viết này, chúng ta sẽ tìm hiểu về...

## 🎯 Mục tiêu học tập

- Hiểu được khái niệm cơ bản
- Áp dụng vào thực tế  
- Viết code thành thạo

## 📚 Kiến thức cần có

- Kiến thức cơ bản về lập trình

## 🚀 Bắt đầu

### 1. Giới thiệu

### 2. Khái niệm cơ bản

### 3. Ví dụ thực tế

\`\`\`javascript
// Code example
console.log("Hello World!");
\`\`\`

### 4. Best Practices

### 5. Common Mistakes

## 🔗 Tài liệu tham khảo

- [Official Documentation](https://example.com)
- [GitHub Repository](https://github.com/example)

## 📖 Bài viết tiếp theo

${post.order < seriesItem.total ? 
    `**Bài tiếp theo:** [Bài ${post.order + 1} - Tên bài viết](/blog/next-post/)` : 
    `**Chúc mừng!** Bạn đã hoàn thành series **${seriesItem.name}** 🎉`}

## 💬 Thảo luận

Bạn có câu hỏi gì về bài viết này? Hãy để lại bình luận bên dưới!

---

**Series:** ${seriesItem.name} | **Bài ${post.order}/${seriesItem.total}** | **Độ khó:** Beginner | **Thời gian đọc:** 15 phút
`;

            // Write file
            fs.writeFileSync(filePath, frontMatter);
            console.log(`✅ Created: ${fileName}`);
        });
    });
    
    console.log(`\n🎉 Generated ${series.reduce((total, s) => total + s.posts.length, 0)} series posts!`);
}

// Run the script
if (require.main === module) {
    generateSeriesPosts();
}

module.exports = { generateSeriesPosts, series };
