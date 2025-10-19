export const orderNotification = (data) => {
    const html = `
          <!DOCTYPE html>
    <html lang="en-US" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
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
  
          .row-4 .column-1 .block-3 .button:hover {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
              border-bottom: 0 solid transparent !important;
              border-left: 0 solid transparent !important;
              border-right: 0px solid transparent !important;
              border-top: 0 solid transparent !important;
              color: #ffffff !important;
              transform: translateY(-2px) !important;
              box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
          }

          /* Unique table styling */
          .order-table {
              border-collapse: separate !important;
              border-spacing: 0 !important;
              border-radius: 12px !important;
              overflow: hidden !important;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
          }

          .order-table th {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
              color: white !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              padding: 15px !important;
              border: none !important;
          }

          .order-table td {
              padding: 12px 15px !important;
              border-bottom: 1px solid #e9ecef !important;
              transition: all 0.3s ease !important;
          }

          .order-table tr:hover td {
              background-color: rgba(102, 126, 234, 0.05) !important;
              transform: scale(1.01) !important;
          }

          /* Enhanced link styling */
          .enhanced-link {
              color: #667eea !important;
              text-decoration: none !important;
              position: relative !important;
              transition: all 0.3s ease !important;
              font-weight: 500 !important;
          }

          .enhanced-link:hover {
              color: #764ba2 !important;
              text-decoration: none !important;
          }

          .enhanced-link::after {
              content: '' !important;
              position: absolute !important;
              width: 0 !important;
              height: 2px !important;
              bottom: -2px !important;
              left: 0 !important;
              background: linear-gradient(90deg, #667eea, #764ba2) !important;
              transition: width 0.3s ease !important;
          }

          .enhanced-link:hover::after {
              width: 100% !important;
          }

          /* Unique image styling */
          .enhanced-image {
              border-radius: 8px !important;
              transition: all 0.3s ease !important;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
          }

          .enhanced-image:hover {
              transform: scale(1.05) !important;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          }

          /* Social media icons enhancement */
          .social-icon {
              transition: all 0.3s ease !important;
              border-radius: 50% !important;
              padding: 8px !important;
          }

          .social-icon:hover {
              transform: translateY(-3px) !important;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
          }
  
          @media (max-width:700px) {
  
              .desktop_hide table.icons-inner,
              .row-5 .column-2 .block-1.social_block .alignment table,
              .social_block.desktop_hide .social-table {
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
  
              .row-3 .column-1 .block-2.paragraph_block td.pad>div,
              .row-3 .column-3 .block-1.paragraph_block td.pad>div {
                  font-size: 10px !important;
              }
  
              .row-3 .column-1 .block-2.paragraph_block td.pad {
                  padding: 10px !important;
              }
  
              .row-3 .column-2 .block-1.divider_block td.pad,
              .row-3 .column-4 .block-1.divider_block td.pad {
                  padding: 30px 10px 10px !important;
              }
  
              .row-3 .column-2 .block-1.divider_block .alignment table,
              .row-3 .column-4 .block-1.divider_block .alignment table {
                  display: inline-table;
              }
  
              .row-2 .column-1 .block-1.heading_block h1 {
                  font-size: 30px !important;
              }
  
              .row-3 .column-3 .block-1.paragraph_block td.pad,
              .row-3 .column-5 .block-1.paragraph_block td.pad {
                  padding: 25px 0 0 !important;
              }
  
              .row-3 .column-5 .block-1.paragraph_block td.pad>div {
                  text-align: center !important;
                  font-size: 10px !important;
              }
  
              .row-5 .column-1 .block-1.paragraph_block td.pad>div {
                  text-align: center !important;
                  font-size: 11px !important;
              }
  
              .row-5 .column-2 .block-1.social_block .alignment {
                  text-align: center !important;
              }
  
              .row-7 .column-1 .block-1.paragraph_block td.pad>div,
              .row-7 .column-2 .block-1.paragraph_block td.pad>div,
              .row-7 .column-3 .block-1.paragraph_block td.pad>div {
                  font-size: 11px !important;
              }
  
              .row-2 .row-content {
                  padding: 30px !important;
              }
  
              .row-4 .row-content {
                  padding: 0 30px 30px !important;
              }
  
              .row-5 .row-content {
                  padding: 20px !important;
              }
  
              .row-6 .row-content {
                  padding: 5px 30px !important;
              }
  
              .row-3 .column-1 {
                  padding: 10px 0 5px 5px !important;
              }
  
              .row-3 .column-5 {
                  padding: 5px 10px 5px 0 !important;
              }
  
              .row-5 .column-2 {
                  padding: 20px 0 0 !important;
              }
          }
      </style>
  
  </head>
  
  <body class="body"
      style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
          <tbody>
              <tr>
                  <td>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                          role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tbody>
                              <tr>
                                  <td>
                                      <table align="center" border="0" cellpadding="0" cellspacing="0"
                                          class="row-content stack" role="presentation"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f1ed; border-radius: 0 0 20px 20px; color: #000000; width: 680px; margin: 0 auto;"
                                          width="680">
                                          <tbody>
                                              <tr>
                                                  <td class="column column-1"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top;"
                                                      width="100%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="image_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="width:100%;padding-right:0px;padding-left:0px;">
                                                                  <div align="center" class="alignment">
                                                                      <div style="max-width: 248px;"><img alt="Logo"
                                                                              height="auto" src="https://res.cloudinary.com/dmoygyqxc/image/upload/v1760783191/logo-black_iupwdm.png"
                                                                              class="enhanced-image"
                                                                              style="display: block; height: auto; border: 0; width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;"
                                                                              title="Logo" width="248" /></div>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                          role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tbody>
                              <tr>
                                  <td>
                                      <table align="center" border="0" cellpadding="0" cellspacing="0"
                                          class="row-content stack" role="presentation"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; padding: 30px 60px 20px; width: 680px; margin: 0 auto;"
                                          width="680">
                                          <tbody>
                                              <tr>
                                                  <td class="column column-1"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
                                                      width="100%">
                                                      <table border="0" cellpadding="10" cellspacing="0"
                                                          class="heading_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad">
                                                                  <h1
                                                                      style="margin: 0; color: #000000; direction: ltr; font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif; font-size: 40px; font-weight: 400; letter-spacing: -2px; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 48px;">
                                                                      <span class="tinyMce-placeholder"
                                                                          style="word-break: break-word;">YOUR ORDER WILL
                                                                          BE SHIPPED SOON!</span>
                                                                  </h1>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                          role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tbody>
                              <tr>
                                  <td>
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
                                          role="presentation"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;"
                                          width="680">
                                          <tbody>
                                              <tr>
                                                  <td class="column column-1"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 45px; padding-top: 10px; vertical-align: top;"
                                                      width="25%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="image_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="width:100%;padding-right:0px;padding-left:0px;">
                                                                  <div align="center" class="alignment">
                                                                      <div style="max-width: 13px;"><img alt="Check"
                                                                              height="auto" src="https://res.cloudinary.com/dmoygyqxc/image/upload/v1760783191/check-orange_kcmrfz.png"
                                                                              style="display: block; height: auto; border: 0; width: 100%;"
                                                                              title="Check" width="13" /></div>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-2" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad" style="padding-top:10px;">
                                                                  <div
                                                                      style="color:#000000;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:18px;font-weight:700;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:22px;">
                                                                      <p style="margin: 0;">Confirmed</p>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td class="column column-2"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
                                                      width="16.666666666666668%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="divider_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:35px;">
                                                                  <div align="center" class="alignment">
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          role="presentation"
                                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                          width="100%">
                                                                          <tr>
                                                                              <td class="divider_inner"
                                                                                  style="font-size: 1px; line-height: 1px; border-top: 2px solid #e1cabf;">
                                                                                  <span
                                                                                      style="word-break: break-word;"> </span>
                                                                              </td>
                                                                          </tr>
                                                                      </table>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td class="column column-3"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
                                                      width="16.666666666666668%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad" style="padding-top:25px;">
                                                                  <div
                                                                      style="color:#e1cabf;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:18px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:22px;">
                                                                      <p style="margin: 0;">Shipped</p>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td class="column column-4"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
                                                      width="16.666666666666668%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="divider_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:35px;">
                                                                  <div align="center" class="alignment">
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          role="presentation"
                                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                          width="100%">
                                                                          <tr>
                                                                              <td class="divider_inner"
                                                                                  style="font-size: 1px; line-height: 1px; border-top: 2px solid #e1cabf;">
                                                                                  <span
                                                                                      style="word-break: break-word;"> </span>
                                                                              </td>
                                                                          </tr>
                                                                      </table>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td class="column column-5"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-top: 5px; vertical-align: top;"
                                                      width="25%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad" style="padding-left:10px;padding-top:25px;">
                                                                  <div
                                                                      style="color:#e1cabf;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:18px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:22px;">
                                                                      <p style="margin: 0;">Delivered</p>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
                          role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tbody>
                              <tr>
                                  <td>
                                      <table align="center" border="0" cellpadding="0" cellspacing="0"
                                          class="row-content stack" role="presentation"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; padding-bottom: 60px; padding-left: 60px; padding-right: 60px; width: 680px; margin: 0 auto;"
                                          width="680">
                                          <tbody>
                                              <tr>
                                                  <td class="column column-1"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
                                                      width="100%">
                                                      <table border="0" cellpadding="40" cellspacing="0"
                                                          class="image_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad">
                                                                  <div align="center" class="alignment">
                                                                      <div style="max-width: 130px;"><img
                                                                              alt="a hand with a star" height="auto"
                                                                              src="https://res.cloudinary.com/dmoygyqxc/image/upload/v1760783191/order-conf-icon_pf6lzr.png"
                                                                              class="enhanced-image"
                                                                              style="display: block; height: auto; border: 0; width: 100%; border-radius: 12px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2); transition: all 0.3s ease;"
                                                                              title="a hand with a star" width="130" />
                                                                      </div>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="heading_block block-2" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:35px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;width:100%;">
                                                                  <h3
                                                                      style="margin: 0; color: #4400ff; direction: ltr; font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 29px;">
                                                                      <span class="tinyMce-placeholder"
                                                                          style="word-break: break-word;">Order Id:
                                                                          ${data.order_id} </span>
                                                                  </h3>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="button_block block-3" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad" style="text-align:center;">
                                                                  <div align="center" class="alignment"><a
                                                                          href="${data.orderDetailsUrl}"
                                                                          style="color:#ffffff;text-decoration:none;"
                                                                          target="_blank"> <span class="button"
                                                                              style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 30px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; display: inline-block; font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif; font-size: 16px; font-weight: 700; mso-border-alt: none; padding-bottom: 12px; padding-top: 12px; padding-left: 35px; padding-right: 35px; text-align: center; width: auto; word-break: keep-all; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;"><span
                                                                                  style="word-break: break-word; line-height: 32px;">VIEW
                                                                                  MY
                                                                                  ORDER</span></span> </a>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
                          role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tbody>
                              <tr>
                                  <td>
                                      <table align="center" border="0" cellpadding="0" cellspacing="0"
                                          class="row-content stack" role="presentation"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; border-radius: 20px 20px 0 0; color: #000000; padding-bottom: 20px; padding-left: 60px; padding-top: 20px; width: 680px; margin: 0 auto;"
                                          width="680">
                                          <tbody>
                                              <tr>
                                                  <td class="column column-1"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 20px; vertical-align: top;"
                                                      width="58.333333333333336%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                                                  <div
                                                                      style="color:#f7f1ed;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:14px;font-weight:700;letter-spacing:3px;line-height:1.2;text-align:left;mso-line-height-alt:17px;">
                                                                      <p style="margin: 0;">FUEL FOR YOUR INNER GLOW</p>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td class="column column-2"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-right: 50px; padding-top: 20px; vertical-align: top;"
                                                      width="41.666666666666664%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="social_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="text-align:right;padding-right:0px;padding-left:0px;">
                                                                  <div align="right" class="alignment">
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          class="social-table" role="presentation"
                                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;"
                                                                          width="108px">
                                                                          <tr>
                                                                              <td style="padding:0 0 0 4px;"><a
                                                                                      href="https://www.facebook.com/"
                                                                                      target="_blank"><img alt="facebook"
                                                                                          height="auto"
                                                                                          src="https://res.cloudinary.com/dmoygyqxc/image/upload/v1760783191/facebook2x_euewul.png"
                                                                                          class="social-icon"
                                                                                          style="display: block; height: auto; border: 0; border-radius: 50%; padding: 8px; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
                                                                                          title="facebook"
                                                                                          width="32" /></a></td>
                                                                              <td style="padding:0 0 0 4px;"><a
                                                                                      href="https://www.twitter.com/"
                                                                                      target="_blank"><img alt="twitter"
                                                                                          height="auto"
                                                                                          src="https://res.cloudinary.com/dmoygyqxc/image/upload/v1760783192/twitter2x_s55vsi.png"
                                                                                          class="social-icon"
                                                                                          style="display: block; height: auto; border: 0; border-radius: 50%; padding: 8px; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
                                                                                          title="twitter"
                                                                                          width="32" /></a></td>
                                                                              <td style="padding:0 0 0 4px;"><a
                                                                                      href="https://www.instagram.com/"
                                                                                      target="_blank"><img alt="instagram"
                                                                                          height="auto"
                                                                                          src="https://res.cloudinary.com/dmoygyqxc/image/upload/v1760783191/instagram2x_flwflg.png"
                                                                                          class="social-icon"
                                                                                          style="display: block; height: auto; border: 0; border-radius: 50%; padding: 8px; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
                                                                                          title="instagram"
                                                                                          width="32" /></a></td>
                                                                          </tr>
                                                                      </table>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6"
                          role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tbody>
                              <tr>
                                  <td>
                                      <table align="center" border="0" cellpadding="0" cellspacing="0"
                                          class="row-content stack" role="presentation"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; border-radius: 0; color: #000000; padding: 5px 60px; width: 680px; margin: 0 auto;"
                                          width="680">
                                          <tbody>
                                              <tr>
                                                  <td class="column column-1"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;"
                                                      width="100%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="divider_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:10px;padding-top:10px;">
                                                                  <div align="center" class="alignment">
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          role="presentation"
                                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                          width="100%">
                                                                          <tr>
                                                                              <td class="divider_inner"
                                                                                  style="font-size: 1px; line-height: 1px; border-top: 1px solid #3a3a3a;">
                                                                                  <span
                                                                                      style="word-break: break-word;"> </span>
                                                                              </td>
                                                                          </tr>
                                                                      </table>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-2" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:20px;padding-top:20px;">
                                                                  <div
                                                                      style="color:#ffffff;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:18px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:22px;">
                                                                      <p style="margin: 0;"><strong>Have a
                                                                              question?</strong> We love curiosity. <a
                                                                              href="contact-us.com" rel="noopener"
                                                                              class="enhanced-link"
                                                                              style="text-decoration: none; color: #667eea; position: relative; transition: all 0.3s ease; font-weight: 500;"
                                                                              target="_blank">contact us</a></p>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="divider_block block-3" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:10px;padding-top:10px;">
                                                                  <div align="center" class="alignment">
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          role="presentation"
                                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                          width="100%">
                                                                          <tr>
                                                                              <td class="divider_inner"
                                                                                  style="font-size: 1px; line-height: 1px; border-top: 1px solid #3a3a3a;">
                                                                                  <span
                                                                                      style="word-break: break-word;"> </span>
                                                                              </td>
                                                                          </tr>
                                                                      </table>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-4" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:5px;padding-top:15px;">
                                                                  <div
                                                                      style="color:#ffffff;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:18px;">
                                                                      <p style="margin: 0;">How much do you want to hear
                                                                          from us?</p>
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
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7"
                          role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tbody>
                              <tr>
                                  <td>
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content"
                                          role="presentation"
                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;"
                                          width="680">
                                          <tbody>
                                              <tr>
                                                  <td class="column column-1"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 20px; padding-top: 5px; vertical-align: top;"
                                                      width="33.333333333333336%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:20px;padding-top:15px;">
                                                                  <div
                                                                      style="color:#f7f1ed;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:13px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:16px;">
                                                                      <p style="margin: 0;"><a
                                                                              href="https://www.example.com"
                                                                              rel="noopener"
                                                                              class="enhanced-link"
                                                                              style="text-decoration: none; color: #667eea; position: relative; transition: all 0.3s ease; font-weight: 500;"
                                                                              target="_blank">Give me everything!</a></p>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td class="column column-2"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 20px; padding-right: 20px; padding-top: 5px; vertical-align: top;"
                                                      width="33.333333333333336%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:20px;padding-top:15px;">
                                                                  <div
                                                                      style="color:#f7f1ed;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:13px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:16px;">
                                                                      <p style="margin: 0;"><a
                                                                              href="https://www.example.com"
                                                                              rel="noopener"
                                                                              class="enhanced-link"
                                                                              style="text-decoration: none; color: #667eea; position: relative; transition: all 0.3s ease; font-weight: 500;"
                                                                              target="_blank">Just the essentials.</a></p>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td class="column column-3"
                                                      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-right: 20px; padding-top: 5px; vertical-align: top;"
                                                      width="33.333333333333336%">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          class="paragraph_block block-1" role="presentation"
                                                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                          width="100%">
                                                          <tr>
                                                              <td class="pad"
                                                                  style="padding-bottom:20px;padding-top:15px;">
                                                                  <div
                                                                      style="color:#f7f1ed;direction:ltr;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;font-size:13px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:16px;">
                                                                      <p style="margin: 0;"><a
                                                                              href="https://www.example.com"
                                                                              rel="noopener"
                                                                              class="enhanced-link"
                                                                              style="text-decoration: none; color: #667eea; position: relative; transition: all 0.3s ease; font-weight: 500;"
                                                                              target="_blank">Unsubscribe</a></p>
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