export const SEND_FORGOT_PASSWORD_TEMPLATE = (resetLink) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
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
                style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:40px;color:#fff;">
                <h1 style="margin:0;font-size:30px;">🔒 Reset Password</h1>
                <p style="margin-top:10px;font-size:16px;opacity:.9;">
                  Ticket Management System
                </p>
              </td>
            </tr>
  
            <!-- Content -->
            <tr>
              <td style="padding:40px;color:#374151;line-height:1.8;">
  
                <h2 style="margin-top:0;color:#111827;">
                  Forgot your password?
                </h2>
  
                <p>
                  We received a request to reset the password for your account.
                  Click the button below to create a new password.
                </p>
  
                <div style="text-align:center;margin:40px 0;">
                  <a href="${resetLink}"
                    style="
                      display:inline-block;
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:15px 35px;
                      border-radius:8px;
                      font-size:16px;
                      font-weight:bold;
                    ">
                    Reset Password
                  </a>
                </div>
  
                <p>
                  If the button above doesn't work, copy and paste the following
                  link into your browser:
                </p>
  
                <p style="
                  word-break:break-all;
                  background:#f3f4f6;
                  padding:12px;
                  border-radius:6px;
                  font-size:14px;
                  color:#2563eb;
                ">
                  ${resetLink}
                </p>
  
                <p>
                  <strong>Note:</strong> This link will expire in
                  <strong>15 minutes</strong>.
                </p>
  
                <p>
                  If you didn't request a password reset, you can safely ignore
                  this email. Your password will remain unchanged.
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