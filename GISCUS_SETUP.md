# Hướng dẫn Setup Giscus Comments

## Bước 1: Tạo GitHub Repository
1. Tạo một repository mới trên GitHub (có thể là private)
2. Bật GitHub Discussions trong Settings > Features

## Bước 2: Cài đặt Giscus App
1. Truy cập https://giscus.app/
2. Điền thông tin repository của bạn
3. Chọn category cho discussions
4. Copy các thông số được tạo ra

## Bước 3: Cập nhật Comments Component
Thay thế các giá trị trong file `layouts/partials/comments.html`:

```html
<script src="https://giscus.app/client.js"
        data-repo="your-username/your-repo"           <!-- Thay bằng repo của bạn -->
        data-repo-id="your-repo-id"                   <!-- Thay bằng repo ID -->
        data-category="General"                       <!-- Thay bằng category -->
        data-category-id="your-category-id"           <!-- Thay bằng category ID -->
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="vi"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>
```

## Bước 4: Tùy chỉnh Theme
Comments sẽ tự động thích ứng với theme của website. Bạn có thể tùy chỉnh màu sắc trong CSS variables.

## Lưu ý
- Giscus yêu cầu người dùng có tài khoản GitHub để comment
- Comments được lưu trữ dưới dạng GitHub Discussions
- Có thể moderate comments trực tiếp trên GitHub
- Hỗ trợ reactions và replies

## Troubleshooting
- Nếu comments không hiển thị, kiểm tra console để xem lỗi
- Đảm bảo repository ID và category ID chính xác
- Kiểm tra xem GitHub Discussions đã được bật chưa
