var nodemailer = require("nodemailer");

const sendMail = async (email, subject, otp) => {
    console.log("1")
  try {
    await nodemailer.createTestAccount()

   
   
    const transport = nodemailer.createTransport({
      host: process.env.Host2,
      port: process.env.Port2,
      auth: {
        user: process.env.User_Name2,
        pass: process.env.Pass_Word2
      },
    });

    const html =  `  
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333333;
            background-color: #f2f2f2;
          }
    
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
    
          h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #555555;
          }
    
          p {
            margin-bottom: 15px;
            color: #555555;
          }
    
          .otp-container {
            background-color: #eeeeee;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
    
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #555555;
            margin: 0;
            text-align: center;
          }
    
          .note {
            font-size: 16px;
            color: #777777;
            margin-top: 10px;
            text-align: center;
          }
    
          .signature {
            font-style: italic;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Dear Sir/Mam</h1>
    
          <p>
            We are pleased to provide you with a one-time password (OTP) for
            Email Verifaction.
          </p>
    
          <div class="otp-container">
            <p class="otp-code">Your OTP: ${otp}</p>
            <p class="note">
              Please use this OTP to  verify your Email.
            </p>
          </div>
    
          <p>
            If you did not request this OTP or have any concerns, please contact our
            support team immediately.
          </p>
    
          <p>Thank you for your attention to this matter.</p>
    
          <p>Best regards,</p>
    
          <p class="signature">FAKEGRAM</p>
        </div>
      </body>
    </html>
    
    `
    

  
  transport.sendMail({
    from:process.env.Username,
    to:email,
    subject,
   html
  })
 

  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
