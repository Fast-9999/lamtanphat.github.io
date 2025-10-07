# Cải thiện phần "Bài viết nổi bật"

## Các tính năng đã được thêm vào:

### 1. Logic chọn bài viết nổi bật
- Sử dụng `featured: true` trong front matter để đánh dấu bài viết nổi bật
- Nếu không có bài viết nào được đánh dấu featured, sẽ hiển thị 6 bài viết mới nhất

### 2. Featured Images
- Thêm `featured_image: "/path/to/image"` trong front matter
- Hình ảnh sẽ hiển thị ở đầu mỗi post card với hiệu ứng hover

### 3. Featured Badges
- Thêm `featured_badge: "Hot"` để hiển thị badge trên hình ảnh
- Các badge phổ biến: "Hot", "Popular", "Trending", "Essential", "New"

### 4. Post Metadata
- **Thời gian đọc**: Tự động tính từ Hugo (`{{ .ReadingTime }}`)
- **Lượt xem**: Thêm `views: 1250` trong front matter
- **Lượt thích**: Thêm `likes: 89` trong front matter

### 5. Cải thiện CSS
- Layout card mới với thumbnail và content riêng biệt
- Hover effects cho hình ảnh
- Responsive design cho mobile
- Icons cho các metadata

## Cách sử dụng:

### Front matter mẫu:
```yaml
---
title: "Tiêu đề bài viết"
date: 2024-01-25T10:00:00+07:00
draft: false
tags: ["tag1", "tag2"]
categories: ["category"]
description: "Mô tả ngắn"
featured: true
featured_image: "/images/featured-image.jpg"
featured_badge: "Hot"
views: 1250
likes: 89
---
```

### Các tính năng tùy chọn:
- `featured`: true/false - Đánh dấu bài viết nổi bật
- `featured_image`: Đường dẫn hình ảnh
- `featured_badge`: Text hiển thị trên badge
- `views`: Số lượt xem
- `likes`: Số lượt thích

## Responsive Design:
- Desktop: Grid 3 cột với hình ảnh 200px
- Tablet: Grid 2 cột
- Mobile: 1 cột với hình ảnh 150px

## Browser Support:
- Modern browsers với CSS Grid support
- Fallback cho older browsers
- Progressive enhancement
