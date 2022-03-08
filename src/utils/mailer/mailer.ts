import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import log from '@/utils/logger/logger';

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log(creds)
// }

const smtp = {
    user: String(process.env.SMTP_USER),
    pass: String(process.env.SMTP_PASSWORD),
    host: String(process.env.SMTP_HOST),
    port: Number(process.env.SMTP_PORT),
    secure: false, // Change to true in production
}

const transporter = nodemailer.createTransport({
    ...smtp,
    auth: {
        user: smtp.user,
        pass: smtp.pass
    }
})

export async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            log.error(err, "Error sending email")
            return;
        }
        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    })
}

// {
//   user: 'soptlggmy6i7io6b@ethereal.email',
//   pass: 'mybtg99Nh4rS2BbdUS',
//   smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
//   imap: { host: 'imap.ethereal.email', port: 993, secure: true },
//   pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
//   web: 'https://ethereal.email'
// }