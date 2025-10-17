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
    console.log('sendEmail1!!!');
    console.log('Email user:', process.env.EMAIL_USER);
    const mailOptions = {
      from: `<${process.env.EMAIL_USER}>`,
      to,
      subject: 'Activate your account',
      html: `
        <a href="${activationLink}" 
        style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
        Activate your account
        </a>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
