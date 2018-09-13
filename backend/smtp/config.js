// this config is for testing purposes,
// real configs will be provided through process.env params
const config = {
    senderEmail: process.env.SMTP_SENDER_EMAIL || 'Leave Tracking <leave.tracking@my-domain.com>',
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE || false,
    auth: {
        user: process.env.SMTP_USER || 'tsqkdxlesjay6lbl@ethereal.email',
        pass: process.env.SMTP_PASSWORD || 'ubksRq4EdAp7MHjtFP'
    }
};

export default config;
