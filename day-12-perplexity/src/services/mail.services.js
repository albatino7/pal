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
    console.log("========== SEND EMAIL ==========");
    console.log("FROM:", config.GOOGLE_USER);
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    console.log("================================");

    const info = await transporter.sendMail({
      from: `"Parplexity" <${config.GOOGLE_USER}>`,
      to: to,
      subject,
      text,
      html,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("EMAIL SENDING ERROR:", error);
    throw error;
  }
};

export default sendEmail;
