export const otpEmail = (otp) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Email OTP</title>
    <style>
      /* Client resets */
      html, body { margin:0; padding:0; height:100%; }
      img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
      table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
      table td { border-collapse:collapse; }
      a { text-decoration:none; }

      /* Base */
      .bg { background:#f6f7fb; }
      .wrap { width:100%; }
      .container { width:100%; max-width:560px; margin:0 auto; }
      .card { background:#ffffff; border-radius:16px; box-shadow:0 6px 22px rgba(22,28,45,.06); }
      .px { padding-left:28px; padding-right:28px; }
      .py { padding-top:28px; padding-bottom:28px; }
      .muted { color:#64748b; }
      .heading { color:#0f172a; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      .brand { color:#7c3aed; }
      .btn { background:#7c3aed; color:#ffffff !important; padding:12px 18px; border-radius:10px; display:inline-block; font-weight:600; }
      .otp { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:28px; letter-spacing:10px; color:#0f172a; background:#f1f5f9; border-radius:12px; padding:14px 18px; display:inline-block; }
      .divider { height:1px; background:#e2e8f0; line-height:1px; }

      /* Dark mode (limited client support) */
      @media (prefers-color-scheme: dark) {
        .bg { background:#0b1220 !important; }
        .card { background:#0f172a !important; }
        .heading { color:#e2e8f0 !important; }
        .muted { color:#94a3b8 !important; }
        .otp { background:#111827 !important; color:#e5e7eb !important; }
        .divider { background:#1f2937 !important; }
      }

      /* Mobile */
      @media only screen and (max-width:600px) {
        .px { padding-left:18px !important; padding-right:18px !important; }
        .py { padding-top:22px !important; padding-bottom:22px !important; }
        .otp { font-size:24px !important; letter-spacing:8px !important; }
      }
    </style>
  </head>
  <body class="bg">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="wrap">
      <tr>
        <td style="padding:36px 16px;">
          <table role="presentation" width="100%" class="container">
            <tr>
              <td>
                <table role="presentation" width="100%" class="card">
                  <tr>
                    <td class="px py">
                      <table role="presentation" width="100%">
                        <tr>
                          <td style="text-align:center; padding-bottom:8px;">
                            <div class="heading" style="font-size:14px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase;">Verification Code</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:center; padding-bottom:6px;">
                            <div class="heading" style="font-size:24px; font-weight:800;">Secure your account</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:center; padding-bottom:18px;">
                            <div class="muted" style="font-size:14px; line-height:22px;">Use the One-Time Password below to verify your identity. This code expires in 1 minute.</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:center; padding:8px 0 18px;">
                            <span class="otp" aria-label="Your one-time password">${otp}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:center; padding-bottom:6px;">
                            <a class="btn" href="#" style="pointer-events:none;">Enter this code in the app</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:22px;">
                            <div class="divider"></div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:16px;">
                            <div class="muted" style="font-size:12px; line-height:20px;">
                              If you did not request this code, you can safely ignore this email.
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:14px;">
                            <div class="muted" style="font-size:12px; line-height:20px;">
                              Need help? Reply to this email.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

  return html;
};
