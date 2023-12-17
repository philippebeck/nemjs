/*! nemjs v2.1.0 | https://www.npmjs.com/package/nemjs | Apache-2.0 License */

"use strict";

require("dotenv").config();

//! ******************** CHECKERS ********************

/**
 * ? CHECK AUTH
 * * Check if the user is authenticated by validating their token
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
exports.checkAuth = (req, res, next) => {
  const { AUTH_ID, AUTH_REQ, JWT } = process.env;
  const { body, headers } = req;

  const jwt   = require("jsonwebtoken");
  const token = headers.authorization.split(" ")[1];
  
  try {
    const tokenData = jwt.verify(token, JWT);
    const userId    = tokenData.userId;
    req.auth        = { userId };

    if (body.userId && body.userId !== userId) throw AUTH_ID;
    next();

  } catch {
    res.status(401).json({ error: new Error(AUTH_REQ) });
  }
};

/**
 * ? CHECK EMAIL
 * * Validates if the email is in a correct format using email-validator package
 * @param {string} email - The email to be validated
 * @return {boolean} Returns true if email is valid, false otherwise
 */
exports.checkEmail = (email) => {
  const emailValidator = require("email-validator");

  return emailValidator.validate(email);
}

/**
 * ? CHECK PASS
 * * Validates a password using a password validator library. 
 * * The password must conform to the rules set in the password-validator schema
 * @param {string} pass - The password to validate
 * @return {boolean} Returns true if password is valid, false otherwise
 */
exports.checkPass = (pass) => {
  const { PASS_INT, PASS_MAX, PASS_MIN } = process.env;

  const passValidator = require("password-validator");
  const schema = new passValidator();

  schema
    .is().min(PASS_MIN)
    .is().max(PASS_MAX)
    .has().uppercase()
    .has().lowercase()
    .has().digits(PASS_INT)
    .has().not().spaces();

  return schema.validate(pass);
}

/**
 * ? CHECK RANGE
 * * Checks if the input value is within the range specified by min & max
 * @param {number|string} value - The input value to check
 * @param {number} [min=process.env.MIN] - The minimum value of the range
 * @param {number} [max=process.env.MAX] - The maximum value of the range
 * @return {boolean} Returns true if value is within the range, false otherwise
 */
exports.checkRange = (value, min = process.env.MIN, max = process.env.MAX) => {
  const IS_NUMBER = (typeof value === "number" && value >= min && value <= max);
  const IS_STRING = (typeof value === "string" && value.length >= min && value.length <= max);

  return IS_NUMBER || IS_STRING;
}

/**
 * ? CHECK URL
 * * Checks if the given URL is a valid URL
 * @param {string} url - The URL to check
 * @return {boolean} Returns true if URL is valid, false otherwise
 */
exports.checkUrl = (url) => {
  const validUrl = require("valid-url");
  if (validUrl.isUri(url)) return true;

  return false;
}

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

//! ******************** SETTERS ********************

/**
 * ? SET AUTH
 * * Sets authentication for a user with provided credentials
 * @param {string} pass - The password of the user
 * @param {Object} user - The user object to authenticate
 * @param {Object} res - The response object to send the result
 * @return {Object} The result of the authentication process
 */
exports.setAuth = async (password, user, res) => {
  const { JWT, JWT_DURATION, LOGIN_EMAIL, LOGIN_PASS } = process.env;
  const { id, pass } = user;

  const bcrypt  = require("bcrypt");
  const jwt     = require("jsonwebtoken");

  if (!user) return res.status(404).json({ error: LOGIN_EMAIL });

  try {
    const valid = await bcrypt.compare(password, pass);
    if (!valid) return res.status(401).json({ error: LOGIN_PASS });

    const token = jwt.sign({ userId: id }, JWT, { expiresIn: JWT_DURATION });
    return res.status(200).json({ userId: id, token });

  } catch (error) { return res.status(400).json({ error })};
}

/** 
 * ? SET IMAGE
 * * Sets the image output to a new file format and saves it in a specified location
 * @param {string} input - the name and path of the input file
 * @param {string} output - the name and path of the output file
 */
exports.setImage = async (input, output) => {
  const { IMG_EXT, IMG_URL } = process.env;
  const sharp = require("sharp");

  await sharp(IMG_URL + input)
    .toFormat(IMG_EXT)
    .toFile(IMG_URL + output);
};

/**
 * ? SET THUMBNAIL
 * * Sets the thumbnail of an image with the specified width, height & format
 * @param {string} input - The path or URL of the image file
 * @param {string} output - The path where the thumbnail will be saved
 * @param {number} [width=process.env.THUMB_WIDTH] - The width of the thumbnail
 * @param {number} [height=process.env.THUMB_HEIGHT] - The height of the thumbnail
 */
exports.setThumbnail = (input, output, width = process.env.THUMB_WIDTH, height = process.env.THUMB_HEIGHT) => {
  const { IMG_EXT, IMG_URL, THUMB_FIT, THUMB_POSITION, THUMB_URL } = process.env;
  const sharp = require("sharp");

  sharp(IMG_URL + input)
    .resize(parseInt(width, 10), parseInt(height, 10), { fit: THUMB_FIT, position: THUMB_POSITION })
    .toFormat(IMG_EXT)
    .toFile(THUMB_URL + output);
}

/*! Author: Philippe Beck <philippe@philippebeck.net> | Updated: 17th Dec 2023 */