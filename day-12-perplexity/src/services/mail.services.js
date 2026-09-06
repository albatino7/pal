import config from "../config/config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Connected TO SMTP SERVER");
  })
  .catch((error) => {
    // const error = new Error("Unable to connect SMTP Server ");
    // error.status = 404;
    throw error;
  });

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${config.GOOGLE_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // const Details = await transporter.sendMail(info);
    // console.log(Details);
  } catch (error) {
    // console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
