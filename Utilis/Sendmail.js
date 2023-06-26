var nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
    console.log("1")
  try {
    await nodemailer.createTestAccount()

   
   
    const transport = nodemailer.createTransport({
      host: process.env.Host,
      port: process.env.Port,
      auth: {
        user: process.env.User_Name,
        pass: process.env.Pass_Word
      },
    });

  
  transport.sendMail({
    from:process.env.Username,
    to:email,
    subject,
    text
  })
 

  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
