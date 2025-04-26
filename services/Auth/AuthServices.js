const nodemailer = require("nodemailer");
const sendMail = async (data)=>{
    const transporter = nodemailer.createTransport({
        service:process.env.MAIL_SERVICE,
        auth:{
            user:process.env.MAIL_AUTH_USER,
            pass:process.env.MAIL_AUTH_PASSWORD
        },
    });

    const mailData = {
        from:process.env.MAIL_AUTH_USER,
        to:data.email,
        subject:"Verify Your Email Address",
        html:`<div>
                    <h3>verification code is ${data.code} </h3>
                    <p >Use These Code to Verify Your Information ,Please Not Share These Code With others .</p>
            </div>`
    }
    await transporter.sendMail(mailData);
}

module.exports= {sendMail}