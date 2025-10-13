import nodemailer from 'nodemailer';

export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Email user:', process.env.EMAIL_USER);
    console.log('Email pass:', process.env.EMAIL_PASS ? 'EXISTS' : 'MISSING');
  }

  async sendActivationEmail(to: string, activationLink: string) {
    const mailOptions = {
      from: `<${process.env.EMAIL_USER}>`,
      to,
      subject: 'Active your account',
      html: `
            <a href="${activationLink}" 
            style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
            Kích hoạt tài khoản
            </a>
            `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
export const mailService = new MailService();
