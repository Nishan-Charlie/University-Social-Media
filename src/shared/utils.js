import nodemailer from "nodemailer";

function sendMail(mailOptions, res) {
  console.log("process.env.SERVICE_MAIL", process.env.SERVICE_MAIL);
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SERVICE_MAIL,
        pass: process.env.SERVICE_MAIL_PASSWORD,
      },
    });
    transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.json("---------", error);
  }
}

export { sendMail };
