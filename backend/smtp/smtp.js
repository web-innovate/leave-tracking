import config from './config';
import nodemailer from'nodemailer';

class Smtp {
    constructor() {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport(config);
        }
    }

    sendMail(to, subject, html, text = '') {
        const message = {
            from: config.senderEmail,
            to,
            subject,
            text,
            html
        };

        this.transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return;
            }

            console.log('Message sent: %s', info.messageId);
        });

    }

}

export default new Smtp;