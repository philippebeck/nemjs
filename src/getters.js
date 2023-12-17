//! ******************** GETTERS ********************

/**
 * ? GET NAME
 * * Returns a modified string with accents removed,
 * * spaces replaced with hyphens & all characters in lowercase
 * @param {string} name - the original string
 * @return {string} the modified string 
 */
exports.getName = (name) => {
  const accents = require("remove-accents");

  return accents.remove(name).replace(/ /g, "-").toLowerCase();
}

/**
 * ? GET POSTER NAME
 * * Returns a string with the name of a poster image
 * @param {string} name - the name of the poster
 * @return {string} a string with the name of the poster image
 */
exports.getPosterName = (name) => {
  const { IMG_EXT } = process.env;

  return this.getName(name) + "-01." + IMG_EXT;
}

/**
 * ? GET MAILER
 * * Returns a nodemailer transport object created with the specified host,
 * * port, secure, auth user & auth pass as environment variables
 * @return {Object} nodemailer transport object
 */
exports.getMailer = () => {
  const { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_SECURE, MAIL_USER } = process.env;
  const nodemailer = require("nodemailer");

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    auth: { user: MAIL_USER, pass: MAIL_PASS }
  });
}

/**
 * ? GET MESSAGE
 * * Returns an object containing email message details
 * @param {Object} data - An object containing email details
 * @return {Object} An object containing from, to, bcc, subject & html properties
 */
exports.getMessage = (data) => {
  const { MAIL_USER } = process.env;

  return { 
    from: MAIL_USER, 
    to: data.email, 
    bcc: MAIL_USER,
    subject: data.subject, 
    html: data.html
  };
}

/**
 * ? GET PASSWORD
 * * Generates a password using the "generate-password" package 
 * @return {string} The generated password
 */
exports.getPassword = () => {
  const { GENERATE_LENGTH, GENERATE_NUMBERS, GENERATE_SYMBOLS, GENERATE_STRICT } = process.env;
  const generator = require("generate-password");

  return generator.generate({
    length: GENERATE_LENGTH,
    numbers: GENERATE_NUMBERS,
    symbols: GENERATE_SYMBOLS,
    strict: GENERATE_STRICT
  });
}
