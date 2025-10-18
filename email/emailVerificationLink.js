export const emailVerificationLink = (link) => {
  const html = `
<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
    <title></title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit
        }

        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }

        .image_block img+div {
            display: none;
        }

        sup,
        sub {
            font-size: 75%;
            line-height: 0;
        }

        .nl-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            padding: 20px !important;
        }

        .row-1 {
            background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%) !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .row-1::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #7747FF, #667eea, #764ba2);
        }

        .row-content {
            background: transparent !important;
            border-radius: 20px !important;
            position: relative !important;
        }

        .image_block img {
            border-radius: 50% !important;
            box-shadow: 0 15px 35px rgba(119, 71, 255, 0.3) !important;
            border: 4px solid #ffffff !important;
            transition: transform 0.3s ease !important;
        }

        .image_block img:hover {
            transform: scale(1.05) !important;
        }

        .heading_block h1 {
            background: linear-gradient(135deg, #7747FF, #667eea) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            font-size: 32px !important;
            font-weight: 700 !important;
            margin: 20px 0 !important;
            text-shadow: none !important;
        }

        .paragraph_block p {
            color: #4a5568 !important;
            font-size: 16px !important;
            line-height: 1.8 !important;
            margin: 15px 0 !important;
        }

        .verify-button {
            background: linear-gradient(135deg, #7747FF, #667eea) !important;
            color: white !important;
            padding: 18px 40px !important;
            text-decoration: none !important;
            border-radius: 50px !important;
            font-weight: 600 !important;
            font-size: 18px !important;
            box-shadow: 0 10px 30px rgba(119, 71, 255, 0.4) !important;
            display: inline-block !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .verify-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .verify-button:hover::before {
            left: 100%;
        }

        .backup-link {
            background: #f7fafc !important;
            border: 2px dashed #e2e8f0 !important;
            border-radius: 12px !important;
            padding: 20px !important;
            margin: 20px 0 !important;
        }

        .backup-link p {
            color: #718096 !important;
            font-size: 14px !important;
            margin-bottom: 10px !important;
        }

        .backup-link a {
            color: #7747FF !important;
            text-decoration: none !important;
            word-break: break-all !important;
            font-size: 12px !important;
        }

        .note-section {
            background: linear-gradient(135deg, #fff5f5, #fef5e7) !important;
            border-left: 4px solid #f6ad55 !important;
            padding: 20px !important;
            margin: 20px 0 !important;
            border-radius: 0 12px 12px 0 !important;
        }

        .note-section p {
            color: #744210 !important;
            font-size: 14px !important;
            margin: 0 !important;
        }

        .footer-section {
            background: #f8f9fa !important;
            padding: 30px !important;
            text-align: center !important;
            border-top: 1px solid #e2e8f0 !important;
            border-radius: 0 0 20px 20px !important;
        }

        .footer-section p {
            color: #718096 !important;
            font-size: 14px !important;
            margin: 0 !important;
        }

        .footer-section a {
            color: #7747FF !important;
            text-decoration: none !important;
            font-weight: 600 !important;
        }

        .decorative-elements {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(119, 71, 255, 0.1), rgba(102, 126, 234, 0.1));
            border-radius: 50%;
            z-index: 1;
        }

        .decorative-elements::after {
            content: '';
            position: absolute;
            bottom: -30px;
            right: -30px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            border-radius: 50%;
        }

        @media (max-width:520px) {
            .desktop_hide table.icons-inner {
                display: inline-block !important;
            }

            .icons-inner {
                text-align: center;
            }

            .icons-inner td {
                margin: 0 auto;
            }

            .mobile_hide {
                display: none;
            }

            .row-content {
                width: 100% !important;
            }

            .stack .column {
                width: 100%;
                display: block;
            }

            .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
                display: table !important;
                max-height: none !important;
            }

            .heading_block h1 {
                font-size: 28px !important;
            }

            .verify-button {
                padding: 15px 30px !important;
                font-size: 16px !important;
            }
        }
    </style>
</head>

<body class="body"
    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;" width="100%">
        <tbody>
            <tr>
                <td>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                        role="presentation"
                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); position: relative; overflow: hidden; padding: 50px 0;"
                        width="100%">
                        <tbody>
                            <tr>
                                <td>
                                    <div class="decorative-elements"></div>
                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                        class="row-content stack" role="presentation"
                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: transparent; color: #000000; width: 500px; margin: 0 auto; border-radius: 20px;"
                                        width="500">
                                        <tbody>
                                            <tr>
                                                <td class="column column-1"
                                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                    width="100%">
                                                    <table border="0" cellpadding="06" cellspacing="0"
                                                        class="image_block block-1" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                        width="100%">
                                                        <tr>
                                                            <td class="pad"
                                                                style="padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;">
                                                                <div align="center" class="alignment"
                                                                    style="line-height:10px">
                                                                    <div style="max-width: 250px;"><img
                                                                            alt="reset-password" height="auto"
                                                                            src="https://res.cloudinary.com/dmoygyqxc/image/upload/v1760783193/otp-email_avpyre.png"
                                                                            style="display: block; height: auto; border: 0; width: 100%; border-radius: 50%; box-shadow: 0 15px 35px rgba(119, 71, 255, 0.3); border: 4px solid #ffffff; transition: transform 0.3s ease;"
                                                                            title="reset-password" width="250" /></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                        class="heading_block block-2" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                        width="100%">
                                                        <tr>
                                                            <td class="pad" style="text-align:center;width:100%;">
                                                                <h1
                                                                    style="margin: 0; color: #393d47; direction: ltr; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 30px; background: linear-gradient(135deg, #7747FF, #667eea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                                                    <strong>Email Verification</strong>
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellpadding="10" cellspacing="0"
                                                        class="paragraph_block block-3" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                        width="100%">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="color:#4a5568;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;font-size:16px;line-height:1.8;text-align:center;mso-line-height-alt:21px;">
                                                                    <p style="margin: 0; word-break: break-word;">We
                                                                        received a request to verify your identity. Use
                                                                        the following link to
                                                                        complete the verification process:</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellpadding="10" cellspacing="0"
                                                        class="heading_block block-4" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                        width="100%">
                                                        <tr>
                                                            <td class="pad">
                                                                <h4
                                                                    style="margin: 0; color: #7747FF; direction: ltr; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 20px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;">

                                                                    <a href="${link}"
                                                                        class="verify-button"
                                                                        style="background: linear-gradient(135deg, #7747FF, #667eea); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 10px 30px rgba(119, 71, 255, 0.4); display: inline-block; transition: all 0.3s ease; position: relative; overflow: hidden;">Verify Email Address</a>
                                                                </h4>
                                                                
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellpadding="10" cellspacing="0"
                                                        class="paragraph_block block-3 backup-link" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; background: #f7fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;"
                                                        width="100%">
                                                        <tr>
                                                            <td class="pad">
                                                                <div
                                                                    style="color:#718096;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                                                    <p style="margin: 0; word-break: break-word;">If the button above doesn't work, you can copy and
                                                                        paste the following link into your browser:</p>
                                                                      
                                                                        <a href="${link}" style="color: #7747FF; text-decoration: none; word-break: break-all; font-size: 12px;">${link}</a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                        class="paragraph_block block-5 note-section" role="presentation"
                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; background: linear-gradient(135deg, #fff5f5, #fef5e7); border-left: 4px solid #f6ad55; padding: 20px; margin: 20px 0; border-radius: 0 12px 12px 0;"
                                                        width="100%">
                                                        <tr>
                                                            <td class="pad"
                                                                style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                                <div
                                                                    style="color:#744210;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:19.5px;">
                                                                    <p style="margin: 10px;"><strong>Note:</strong> This link will expire in 1 hours. If you did not create an account, you can safely ignore this email.</p>
                                                                         
                                                                    <p style="margin: 0;">Thank you,<br />
                                                                        <a href="https://www.youtube.com/@developergoswami"
                                                                            target="_blank" style="color: #7747FF; text-decoration: none; font-weight: 600;">Developer
                                                                            SHANTO KUMAR</a>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>

      `;

  return html;
};