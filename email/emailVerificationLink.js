export const emailVerificationLink = (link) => {
    const html = `
<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Verification - E-Commerce</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .header p {
            color: rgba(255,255,255,0.9);
            font-size: 16px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .verification-icon {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .icon-circle {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .content h2 {
            color: #2d3748;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .content p {
            color: #4a5568;
            font-size: 16px;
            text-align: center;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .verify-button {
            text-align: center;
            margin: 40px 0;
        }
        
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn:hover::before {
            left: 100%;
        }
        
        .security-info {
            background: #f7fafc;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            border-left: 5px solid #667eea;
        }
        
        .security-info h3 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .security-info h3::before {
            content: '🔒';
            margin-right: 10px;
            font-size: 20px;
        }
        
        .security-info ul {
            list-style: none;
            padding: 0;
        }
        
        .security-info li {
            color: #4a5568;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        
        .security-info li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #48bb78;
            font-weight: bold;
        }
        
        .link-fallback {
            background: #edf2f7;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
        }
        
        .link-fallback p {
            color: #4a5568;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .link-fallback a {
            color: #667eea;
            word-break: break-all;
            font-size: 12px;
        }
        
        .footer {
            background: #2d3748;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        
        .footer p {
            color: #a0aec0;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #a0aec0;
            font-size: 20px;
            transition: color 0.3s ease;
        }
        
        .social-links a:hover {
            color: #667eea;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .footer {
                padding: 20px;
            }
            
            .btn {
                padding: 15px 30px;
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🛍️</div>
            <h1>Welcome to E-Commerce!</h1>
            <p>Complete your account verification</p>
        </div>
        
        <div class="content">
            <div class="verification-icon">
                <div class="icon-circle">✉️</div>
            </div>
            
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up! To complete your registration and start shopping, please verify your email address by clicking the button below.</p>
            
            <div class="verify-button">
                <a href="${link}" class="btn">Verify Email Address</a>
            </div>
            
            <div class="security-info">
                <h3>Security Information</h3>
                <ul>
                    <li>This verification link expires in 24 hours</li>
                    <li>Your account is secure and encrypted</li>
                    <li>We never share your personal information</li>
                    <li>You can safely ignore this email if you didn't create an account</li>
                </ul>
            </div>
            
            <div class="link-fallback">
                <p><strong>Button not working?</strong></p>
                <p>Copy and paste this link into your browser:</p>
                <a href="${link}">${link}</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent by E-Commerce Platform</p>
            <p>If you have any questions, feel free to contact our support team</p>
            <div class="social-links">
                <a href="#">📧</a>
                <a href="#">📱</a>
                <a href="#">🌐</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px;">
                © 2024 E-Commerce Platform. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `;
    
    return html;
};