const mailTemplate = (otp) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f8ff; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1e3a8a; text-align: center; margin-bottom: 20px;">SwiftShip Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Dear Customer,</p>
        <p style="font-size: 16px; color: #333;">
          Please use the following One-Time Password (OTP) to verify your identity. This code is valid for <strong>5 minutes</strong>.
        </p>
        <div style="font-size: 36px; font-weight: bold; text-align: center; margin: 30px 0; color: #2563eb;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #666;">
          If you didn’t request this code, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,<br/><strong>SwiftShip Team</strong></p>
      </div>
    </div>
  `;
};

const otpTemplate = (otp, email) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <tr>
                <td style="text-align: center; padding-bottom: 20px;">
                  <h2 style="color: #333333; font-size: 24px;">Verify Your Email</h2>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                  <p>Hello,</p>
                  <p>We received a request to verify your email for your SwiftShip account. Use the OTP below to complete verification:</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <span style="display: inline-block; background-color: #00a6a6; color: #ffffff; padding: 12px 25px; border-radius: 5px; font-size: 20px; font-weight: bold;">${otp}</span>
                </td>
              </tr>
              <tr>
                <td style="color: #666666; font-size: 14px; text-align: center;">
                  <p>This OTP will expire in 10 minutes. Do not share it with anyone.</p>
                </td>
              </tr>
              <tr>
                <td style="text-align: center; color: #999999; font-size: 14px; padding-top: 20px;">
                  <p>SwiftShip • Fast & Reliable Parcel Shipping</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};

// Updated template function
const resetPassTemplate = (randomString, email) => {
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <tr>
                <td style="text-align: center; padding-bottom: 20px;">
                  <h2 style="color: #333333; font-size: 24px;">Reset Your SwiftShip Password</h2>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                  <p>Hello,</p>
                  <p>We received a request to reset the password for your SwiftShip account. If you didn’t make this request, you can ignore this email.</p>
                  <p>To reset your password, click the button below:</p>
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <a href="${frontendURL}/reset-password/${randomString}?email=${encodeURIComponent(
    email
  )}" 
                     target="_blank" 
                     style="display: inline-block; padding: 12px 25px; background-color: #5C2E91; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    Reset Password
                  </a>
                </td>
              </tr>
              <tr>
                <td style="color: #666666; font-size: 14px; text-align: center;">
                  <p>This link will expire in 10 minutes for security reasons.</p>
                </td>
              </tr>
              <tr>
                <td style="text-align: center; color: #999999; font-size: 14px; padding-top: 20px;">
                  <p>SwiftShip • Fast & Reliable Parcel Shipping</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};

const orderNotificationEmail = ({
  orderId,
  productName,
  trackingLink,
  purchaseDate,
}) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <tr>
              <td style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333333; font-size: 24px;">Thank you for your purchase!</h2>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                <p>Hello,</p>
                <p>We're happy to let you know that your order <strong>${orderId}</strong> for the product <strong>${productName}</strong> was successfully placed on <strong>${purchaseDate}</strong>.</p>
                <p>You can track the status of your shipment by clicking the button below:</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <a href="${trackingLink}" target="_blank" rel="noopener noreferrer" style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Track Your Order</a>
              </td>
            </tr>
            <tr>
              <td style="color: #666666; font-size: 14px; text-align: center;">
                <p>If you have any questions or need assistance, feel free to contact our support team.</p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; color: #999999; font-size: 14px; padding-top: 20px;">
                <p>Swift Ship • Fast & Reliable Shipping</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
};

const contactMailTemplate = ({ name, email, phone, address, message }) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7fa; color: #333;">
    <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #045364, #057b9a); padding: 20px 30px; color: white;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 600;">📩 New Contact Form Submission</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">A new inquiry has been submitted via your website.</p>
      </div>

      <!-- Content -->
      <div style="padding: 25px 30px;">
        <table cellpadding="8" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f9f9f9;">
            <td style="font-weight: bold; width: 120px;">👤 Name:</td>
            <td>${name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">📧 Email:</td>
            <td><a href="mailto:${email}" style="color: #045364; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="font-weight: bold;">📱 Phone:</td>
            <td>${phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">🏠 Address:</td>
            <td>${address || 'N/A'}</td>
          </tr>
          <tr style="background: #f9f9f9; vertical-align: top;">
            <td style="font-weight: bold;">💬 Message:</td>
            <td style="white-space: pre-line;">${message}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="background: #f4f7fa; padding: 15px 30px; font-size: 12px; color: #777; text-align: center;">
        This is an automated message from your contact form. Please do not reply directly.
      </div>
    </div>
  </div>
`;

const bookingNotificationEmail = (data) => `
  <h2>New Booking Received</h2>
  <h3>Sender Details</h3>
  <p>Name: ${data.senderName}</p>
  <p>Phone: ${data.senderPhone}</p>
  <p>Email: ${data.senderEmail}</p>
  <p>Address Type: ${data.senderAddressType}</p>
  <p>District/Area: ${data.senderDistrict} - ${data.senderArea}</p>
  <p>Post Code: ${data.senderPostCode}</p>
  <p>Address: ${data.senderAddress}</p>

  <h3>Recipient Details</h3>
  <p>Name: ${data.recipientName}</p>
  <p>Phone: ${data.recipientPhone}</p>
  <p>District/Area: ${data.recipientDistrict} - ${data.recipientArea}</p>
  <p>Post Code: ${data.recipientPostCode}</p>
  <p>Address: ${data.recipientAddress}</p>
  <p>Instruction: ${data.recipientInstruction || 'N/A'}</p>
  <p>Send Pickup Notification: ${data.sendPickupNotification ? 'Yes' : 'No'}</p>

  <h3>Parcel Details</h3>
  <p>Product Type: ${data.productType}</p>
  <p>Weight: ${data.weightKg} kg</p>
  <p>Contents: ${data.contents}</p>
  <p>Number of Items: ${data.numberOfItems}</p>
  <p>Packaging Service: ${data.packagingService}</p>
  <p>Declared Value: ${data.parcelValue || 'N/A'}</p>
  <p>Delivery Speed: ${data.deliverySpeed}</p>
`;

const bulkQuoteEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #045364; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background: #045364; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border: 1px solid #ddd; }
        .footer { margin-top: 20px; padding: 20px; background: #eee; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Request</h1>
        </div>
        
        <div class="content">
          <h2>Shipping Details</h2>
          <table>
            <tr><th colspan="2">Shipping Route</th></tr>
            <tr><td><strong>From Country:</strong></td><td>${
              data.originCountry || 'N/A'
            }</td></tr>
            <tr><td><strong>Destination:</strong></td><td>${
              data.destinationCountry || 'N/A'
            }</td></tr>
            
            <tr><th colspan="2">Package Information</th></tr>
            <tr><td><strong>Category:</strong></td><td>${
              data.category || 'N/A'
            }</td></tr>
            <tr><td><strong>Transport Method:</strong></td><td>${
              data.transportMethod || 'N/A'
            }</td></tr>
            
            <tr><th colspan="2">Shipping Details</th></tr>
            <tr><td><strong>Shipping Method:</strong></td><td>${
              data.shippingMethod || 'N/A'
            }</td></tr>
            <tr><td><strong>Currency:</strong></td><td>${
              data.currency || 'N/A'
            }</td></tr>
            <tr><td><strong>Total Value:</strong></td><td>${
              data.totalValue || 'N/A'
            }</td></tr>
            
            <tr><th colspan="2">Delivery Options</th></tr>
            <tr><td><strong>Delivery Type:</strong></td><td>${
              data.deliveryType || 'N/A'
            }</td></tr>
            
            <tr><th colspan="2">Request Details</th></tr>
            <tr><td><strong>Submitted At:</strong></td><td>${
              data.submittedAt || new Date().toLocaleString()
            }</td></tr>
          </table>
        </div>
        
        <div class="footer">
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  mailTemplate,
  otpTemplate,
  resetPassTemplate,
  orderNotificationEmail,
  contactMailTemplate,
  bookingNotificationEmail,
  bulkQuoteEmailTemplate,
};
