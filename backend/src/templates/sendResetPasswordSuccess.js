export const SEND_RESET_PASSWORD_SUCCESS_TEMPLATE = () => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  </head>
  
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
      <tr>
        <td align="center">
  
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">
  
            <!-- Header -->
            <tr>
              <td align="center"
                style="background:linear-gradient(135deg,#16a34a,#15803d);padding:40px;color:#ffffff;">
  
                <div style="font-size:60px;line-height:1;">✅</div>
  
                <h1 style="margin:15px 0 5px;font-size:30px;">
                  Password Updated
                </h1>
  
                <p style="margin:0;font-size:16px;opacity:.9;">
                  Ticket Management System
                </p>
  
              </td>
            </tr>
  
            <!-- Content -->
            <tr>
              <td style="padding:40px;color:#374151;line-height:1.8;">
  
                <h2 style="margin-top:0;color:#111827;">
                  Your password has been reset successfully.
                </h2>
  
                <p>
                  This email confirms that the password for your account has been
                  changed successfully.
                </p>
  
                <div style="
                  margin:30px 0;
                  background:#ecfdf5;
                  border-left:5px solid #16a34a;
                  padding:18px;
                  border-radius:6px;
                  color:#166534;
                ">
                  <strong>✓ Success</strong><br>
                  Your account is now protected with your new password.
                </div>
  
                <p>
                  You can now sign in using your new password.
                </p>
  
                <p>
                  <strong>Didn't make this change?</strong><br>
                  If you did not reset your password, please contact your
                  administrator or support team immediately to secure your
                  account.
                </p>
  
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td
                style="
                  background:#f9fafb;
                  text-align:center;
                  padding:25px;
                  color:#6b7280;
                  font-size:13px;
                ">
  
                <p style="margin:0;">
                  © ${new Date().getFullYear()} Ticket Management System
                </p>
  
                <p style="margin-top:8px;">
                  This is an automated email. Please do not reply.
                </p>
  
              </td>
            </tr>
  
          </table>
  
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  };