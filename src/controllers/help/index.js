import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";

export const sendHelpQuestion = async (req, res) => {
  try {
    const { email, firstname, question } = req.body;
    console.log({ firstname });
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SERVICE_MAIL,
        pass: process.env.SERVICE_MAIL_PASSWORD,
      },
    });

    const currDir = process.cwd();
    const templatePath = path.join(currDir, "./src/views/help.html");
    const emailTemplate = fs.readFileSync(templatePath, "utf8");
    const name = firstname;

    const mailOption = {
      from: process.env.SERVICE_MAIL,
      to: process.env.ADMIN_MAIL,
      subject: "Albany user request a help!",
      html: emailTemplate
        .replace("{{name}}", name)
        .replace("{{email}}", email)
        .replace("{{question}}", question),
    };
    await transporter
      .sendMail(mailOption)
      .then((response) => {
        res.status(200).json({ message: "Mail Sent" });
      })
      .catch((err) => {});
  } catch (error) {}
};
