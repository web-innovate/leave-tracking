import config from './config';
import nodemailer from'nodemailer';
import expressTemplates from 'nodemailer-express-handlebars';
import path from 'path';

class Smtp {
    constructor() {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport(config);

            const templatePlugin = new expressTemplates({
                viewPath: path.resolve(__dirname, './templates'),
                extName: '.hbs'
            });

            this.transporter.use('compile', templatePlugin);
        }
    }

    sendMail(to, subject, template, context) {
        const message = {
            from: config.senderEmail,
            to,
            subject,
            template,
            context
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(message, (err, info) => {
                if (err) {
                    return reject(err);
                }

                return resolve(info);
            });
        });
    }
}

export default new Smtp;