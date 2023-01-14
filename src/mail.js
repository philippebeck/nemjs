/**
 * CREATE MAILER
 * @returns 
 */
exports.createMailer = () => {
  const nodemailer = require("nodemailer");

  const transport = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  };

  return nodemailer.createTransport(transport);
}

/**
 * CREATE MESSAGE
 * @param {object} message 
 * @returns 
 */
exports.createMessage = (message) => {

  return { 
    from: process.env.MAIL_USER, 
    to: message.email, 
    bcc: process.env.MAIL_USER,
    subject: message.subject, 
    text: message.text
  };
}
