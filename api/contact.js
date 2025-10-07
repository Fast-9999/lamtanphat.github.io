const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting - 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Quá nhiều yêu cầu liên hệ. Vui lòng thử lại sau 15 phút.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // hoặc service khác
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Validation function
const validateContactForm = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Tên phải có ít nhất 2 ký tự');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email không hợp lệ');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Tin nhắn phải có ít nhất 10 ký tự');
  }
  
  return errors;
};

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    const validationErrors = validateContactForm({ name, email, message });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }
    
    // Create email content
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: 'taansfast@email.com', // Email nhận
      subject: `[Blog Contact] ${subject || 'Liên hệ từ blog'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Liên hệ mới từ blog</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Thông tin người liên hệ:</h3>
            <p><strong>Tên:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Chủ đề:</strong> ${subject || 'Không xác định'}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Tin nhắn:</h3>
            <p style="line-height: 1.6; color: #374151;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
            <p>IP: ${req.ip}</p>
          </div>
        </div>
      `,
      replyTo: email
    };
    
    // Send email
    const transporter = createTransporter();
    await transporter.sendMail(emailContent);
    
    // Log successful contact (optional)
    console.log(`New contact from ${name} (${email}) at ${new Date().toISOString()}`);
    
    res.json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi trong vòng 24-48 giờ.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
    });
  }
});

// Health check endpoint
app.get('/api/contact/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
