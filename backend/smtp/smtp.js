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

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(message, (err, info) => {
                if (err) {
                    reject(err);
                }

                return resolve(info);
            });
        });
    }
}

export default new Smtp;