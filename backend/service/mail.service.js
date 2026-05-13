const nodemailer = require("nodemailer");
require("dotenv").config();
// ============================================
// Create Nodemailer transporter (Gmail OAuth2)
// ============================================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GOOGLE_USER_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server verification failed:");
    console.error("   Error name:", error.name);
    console.error("   Error code:", error.code);
    console.error("   Error message:", error.message);

    if (error.code === "ENETUNREACH") {
      console.error(
        "   💡 Hint: This is an IPv6 issue. Ensure dns.setDefaultResultOrder('ipv4first') is called in server.js BEFORE any imports.",
      );
    }
    if (error.code === "EAUTH") {
      console.error(
        "   💡 Hint: App Password invalid or missing. Go to Google Account → Security → 2-Step Verification → App Passwords, generate one, and set it as GOOGLE_APP_PASSWORD in .env.",
      );
    }
  } else {
    console.log("📧 Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"ModelVerse AI Team" <${process.env.GOOGLE_USER_EMAIL}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, //plain text body
      html, // html body
    });

    console.log("📧 Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

module.exports = sendEmail;