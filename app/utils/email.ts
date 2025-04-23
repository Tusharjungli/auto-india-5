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

/**
 * Sends order confirmation email.
 * @param to Customer's email.
 * @param orderId The ID of the placed order.
 */
export async function sendOrderConfirmation(to: string, orderId: string) {
  try {
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

    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
  }
}
