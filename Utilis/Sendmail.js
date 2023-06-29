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

    const html =  `  
    <h3>FakeGram</h3>
    <p>Verify your accout Use Code</p>
    <h1>${text}</h1>
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
