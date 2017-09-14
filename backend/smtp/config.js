// this config is for testing purposes,
// real configs will be provided through process.env params
const config = {
    senderEmail: process.env.smtpSenderEmail || 'Leave Tracking <leave.tracking@my-domain.com>',
    host: process.env.smtpHost || 'smtp.ethereal.email',
    port: process.env.smtPort || 587,
    secure: process.env.smtSecure || false,
    auth: {
        user: process.env.smtUser || 'uhzdcegtgaxt427t@ethereal.email',
        pass: process.env.smtPass || 'cR48DwNMD3ncEwykrG'
    }
};

export default config;
