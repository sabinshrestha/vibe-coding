import { Injectable, Logger } from '@nestjs/common';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(options: EmailOptions): Promise<void> {
    // Dev stub - logs email to console
    // In production, swap this for SendGrid, AWS SES, etc.
    this.logger.log('📧 Email sent:');
    this.logger.log(`   To: ${options.to}`);
    this.logger.log(`   Subject: ${options.subject}`);
    this.logger.log(`   Body: ${options.html.substring(0, 100)}...`);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${process.env.WEB_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to Workout Platform',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining Workout Platform. Start tracking your fitness journey today!</p>
        <p>Get started by:</p>
        <ul>
          <li>Creating your first workout template</li>
          <li>Logging your first session</li>
          <li>Exploring the exercise library</li>
        </ul>
      `,
    });
  }
}
