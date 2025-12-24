import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Extracting Ticket ID from the message string to generate a clean QR code
  // This assumes your message contains the Ticket ID string
  const qrData = options.ticketId || options.message;
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=150`;

  const mailOptions = {
    from: `"EventBooker" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 2px solid #4A90E2;">
          <h2 style="color: #4A90E2; margin: 0;">Booking Confirmation</h2>
        </div>
        
        <div style="padding: 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 20px;">
                <div style="white-space: pre-wrap; font-size: 16px;">${options.message}</div>
              </td>
              
              <td style="vertical-align: top; width: 150px; text-align: center;">
                <div style="border: 1px solid #eee; padding: 10px; border-radius: 8px; background: white;">
                  <img src="${qrCodeUrl}" alt="Ticket QR Code" width="130" height="130" style="display: block;" />
                  <p style="font-size: 10px; color: #999; margin-top: 5px; font-weight: bold;">SCAN AT ENTRY</p>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
          © 2025 EventBooker. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;