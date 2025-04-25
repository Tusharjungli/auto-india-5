import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true, // true for port 465 (Gmail SMTP)
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// ✅ Transporter Verify (No unused variables!)
transporter.verify((error) => {
  if (error) {
    console.error('❌ Transporter Verification Failed:', error);
  } else {
    console.log('✅ Transporter is ready to send emails!');
  }
});

/**
 * Sends order confirmation email.
 * @param to Customer's email.
 * @param orderId The ID of the placed order.
 */
export async function sendOrderConfirmation(to: string, orderId: string): Promise<void> {
  try {
    console.log('📤 Attempting to send order confirmation email...');
    console.log('📧 Sending to:', to);
    console.log('🆔 Order ID:', orderId);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `🛒 Order Confirmation - Auto India Spare Parts`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Thank you for your order!</h2>
          <p>Your Order ID: <strong>${orderId}</strong></p>
          <p>We will process and ship your order soon.</p>
          <br/>
          <p>🚗 Auto India Spare Parts Team</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully. Message ID:', info.messageId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error sending order confirmation email:', error.message);
    } else {
      console.error('❌ Unknown error sending order confirmation email:', error);
    }
  }
}
