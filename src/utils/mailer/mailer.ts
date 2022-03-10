import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import log from '@/utils/logger/logger';

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log(creds)
// }

export async function sendEmail(payload: SendMailOptions) {
    const creds = await nodemailer.createTestAccount();

    const smtp = {
        user: creds.user,
        pass: creds.pass,
        host: creds.smtp.host,
        port: creds.smtp.port,
        secure: false
    }

    const transporter = nodemailer.createTransport({
        ...smtp,
        auth: {
            user: smtp.user,
            pass: smtp.pass
        }
    })

    transporter.sendMail(payload, (err, info) => {
        if (err) {
            log.error(err, "Error sending email")
            return;
        }
        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    })
}

// {
// user: 'tmle5pbwgzsv7pfd@ethereal.email',
// pass: 'EmtZgqyaS1NEs3dAyp',
// smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
// imap: { host: 'imap.ethereal.email', port: 993, secure: true },
// pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
// web: 'https://ethereal.email'
// }