const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Method not allowed'
            })
        };
    }

    try {
        const { email, name } = JSON.parse(event.body);

        // Validate email
        if (!email || !isValidEmail(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Email không hợp lệ'
                })
            };
        }

        // Create subscribers directory if it doesn't exist
        const subscribersDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(subscribersDir)) {
            fs.mkdirSync(subscribersDir, { recursive: true });
        }

        const subscribersFile = path.join(subscribersDir, 'subscribers.json');
        
        // Read existing subscribers
        let subscribers = [];
        if (fs.existsSync(subscribersFile)) {
            try {
                const data = fs.readFileSync(subscribersFile, 'utf8');
                subscribers = JSON.parse(data);
            } catch (error) {
                console.error('Error reading subscribers file:', error);
                subscribers = [];
            }
        }

        // Check if email already exists
        const existingSubscriber = subscribers.find(sub => sub.email === email);
        if (existingSubscriber) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Email đã được đăng ký trước đó. Cảm ơn bạn!',
                    alreadySubscribed: true
                })
            };
        }

        // Add new subscriber
        const newSubscriber = {
            email: email,
            name: name || '',
            subscribedAt: new Date().toISOString(),
            status: 'active',
            source: 'website',
            ip: event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown'
        };

        subscribers.push(newSubscriber);

        // Save subscribers
        fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));

        // Log subscription (for analytics)
        console.log('New newsletter subscription:', {
            email: email,
            name: name,
            timestamp: newSubscriber.subscribedAt,
            ip: newSubscriber.ip
        });

        // In production, you might want to:
        // 1. Send confirmation email
        // 2. Add to external service (Mailchimp, ConvertKit, etc.)
        // 3. Send to analytics service

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Đăng ký thành công! Cảm ơn bạn đã quan tâm đến blog của tôi.',
                subscriber: {
                    email: email,
                    name: name
                }
            })
        };

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Có lỗi xảy ra, vui lòng thử lại sau'
            })
        };
    }
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}