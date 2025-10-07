# Hướng dẫn Setup Blog Lập Trình Mạng

## Cài đặt và Chạy Blog

### 1. Cài đặt Hugo
```bash
# Windows (với Chocolatey)
choco install hugo

# macOS (với Homebrew)
brew install hugo

# Linux (Ubuntu/Debian)
sudo apt-get install hugo

# Kiểm tra version
hugo version
```

### 2. Clone và Chạy Blog
```bash
# Clone repository
git clone <your-repo-url>
cd bloglaptrinh

# Chạy development server
hugo server -D

# Truy cập http://localhost:1313
```

### 3. Build Production
```bash
# Build static files
hugo

# Files sẽ được tạo trong thư mục public/
```

## Cấu hình

### 1. Cập nhật thông tin cá nhân
Chỉnh sửa file `hugo.toml`:
```toml
[params]
  author = "Tên của bạn"
  description = "Mô tả blog của bạn"
  email = "email@example.com"
  twitter = "your_twitter"
  github = "your_github"
  linkedin = "your_linkedin"
```

### 2. Setup Google Analytics
1. Tạo Google Analytics account
2. Lấy Measurement ID
3. Cập nhật trong `hugo.toml`:
```toml
[params]
  googleAnalytics = "G-XXXXXXXXXX"
```

### 3. Setup Giscus Comments
1. Tạo GitHub repository
2. Bật GitHub Discussions
3. Truy cập https://giscus.app/
4. Cấu hình và copy settings
5. Cập nhật trong `hugo.toml`:
```toml
[params.giscus]
  repo = "username/repo-name"
  repoId = "R_XXXXXXXXXX"
  category = "General"
  categoryId = "DIC_kwXXXXXXXXXX"
```

### 4. Cập nhật Social Links
Chỉnh sửa file `layouts/partials/header.html` và `layouts/partials/footer.html`:
```html
<a href="https://github.com/your-username" target="_blank" rel="noopener">
<a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener">
<a href="https://twitter.com/your-handle" target="_blank" rel="noopener">
```

## Tạo Bài Viết Mới

### 1. Tạo bài viết
```bash
hugo new blog/ten-bai-viet.md
```

### 2. Cấu trúc frontmatter
```yaml
---
title: "Tiêu đề bài viết"
date: 2024-03-01T10:00:00+07:00
draft: false
tags: ["Tag1", "Tag2", "Tag3"]
categories: ["Category"]
description: "Mô tả ngắn gọn về bài viết"
featured: true
featured_image: "/images/featured-image.jpg"
featured_badge: "Hot"
views: 0
likes: 0
reading_time: 5
---
```

### 3. Viết nội dung
Sử dụng Markdown syntax để viết nội dung bài viết.

## Deploy

### 1. Netlify (Recommended)
1. Connect GitHub repository với Netlify
2. Build command: `hugo`
3. Publish directory: `public`
4. Deploy!

### 2. Vercel
1. Connect GitHub repository với Vercel
2. Build command: `hugo`
3. Output directory: `public`
4. Deploy!

### 3. GitHub Pages
```bash
# Tạo GitHub Actions workflow
mkdir -p .github/workflows
```

Tạo file `.github/workflows/hugo.yml`:
```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Install Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Checkout
        uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Build with Hugo
        run: hugo

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## Customization

### 1. Thay đổi màu sắc
Chỉnh sửa CSS variables trong `static/css/style.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... */
}
```

### 2. Thêm trang mới
```bash
hugo new about.md
hugo new contact.md
```

### 3. Thay đổi layout
Chỉnh sửa các file trong thư mục `layouts/`

## Troubleshooting

### 1. Hugo server không chạy
```bash
# Kiểm tra port
hugo server -p 1314

# Kiểm tra logs
hugo server --verbose
```

### 2. Build lỗi
```bash
# Kiểm tra syntax
hugo --verbose

# Clean cache
hugo --gc
```

### 3. Images không hiển thị
- Đảm bảo images được đặt trong `static/images/`
- Sử dụng đường dẫn `/images/filename.jpg`

## Performance Tips

### 1. Optimize Images
- Sử dụng WebP format
- Compress images trước khi upload
- Sử dụng lazy loading

### 2. Minify CSS/JS
```bash
# Install minification tools
npm install -g clean-css-cli uglify-js

# Minify CSS
cleancss -o static/css/style.min.css static/css/style.css

# Minify JS
uglifyjs static/js/main.js -o static/js/main.min.js
```

### 3. Enable Compression
Thêm vào `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Encoding = "gzip"
```

## Backup và Maintenance

### 1. Backup
```bash
# Backup toàn bộ project
tar -czf blog-backup-$(date +%Y%m%d).tar.gz .

# Backup chỉ content
tar -czf content-backup-$(date +%Y%m%d).tar.gz content/
```

### 2. Update Hugo
```bash
# Check version
hugo version

# Update (tùy theo cách cài đặt)
# Windows: choco upgrade hugo
# macOS: brew upgrade hugo
# Linux: sudo apt-get update && sudo apt-get upgrade hugo
```

## Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra Hugo documentation
2. Tìm kiếm trên GitHub Issues
3. Tham gia Hugo community forums

---

**Chúc bạn có một blog thành công! 🚀**
