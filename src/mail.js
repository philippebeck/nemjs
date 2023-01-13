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
 * @param {object} req 
 * @returns 
 */
exports.createMessage = (req) => {
  const host = req.get("host");

  return { 
    from: process.env.MAIL_USER, 
    to: req.body.email, 
    bcc: process.env.MAIL_USER,
    subject: `${host} : ${req.body.title}`, 
    text: req.body.message
  };
}
