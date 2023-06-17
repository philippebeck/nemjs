/*! nemjs v1.6.0 | https://www.npmjs.com/package/nemjs | Apache-2.0 License */

"use strict";

require("dotenv").config();

//! ******************** CHECKERS ********************

/**
 * ? CHECK AUTH
 * * Check if the user is authenticated by validating their token
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 */
exports.checkAuth = (req, res, next) => {
  const jwt   = require("jsonwebtoken");
  const token = req.headers.authorization.split(" ")[1];

  try {
    const tokenData = jwt.verify(token, process.env.JWT);
    const userId    = tokenData.userId;
    req.auth        = { userId };

    if (req.body.userId && req.body.userId !== userId) throw process.env.AUTH_ID;
    next();

  } catch {
    res.status(401).json({ error: new Error(process.env.AUTH_REQ) });
  }
};

/**
 * ? CHECK EMAIL
 * * Validates if the email is in a correct format using email-validator package
 *
 * @param {string} email - The email to be validated
 * @return {boolean} true if email is valid, false otherwise
 */
exports.checkEmail = (email) => {
  const emailValidator = require("email-validator"); 

  if (emailValidator.validate(email)) return true;

  return false;
}

/**
 * ? CHECK PASS
 * * Validates a password using a password validator library. 
 * * The password must conform to the rules set in the password-validator schema
 *
 * @param {string} pass - The password to validate
 * @return {boolean} True if the password is valid, false otherwise
 */
exports.checkPass = (pass) => {
  const passValidator = require("password-validator");
  const schema        = new passValidator();

  schema
    .is().min(process.env.PASS_MIN)
    .is().max(process.env.PASS_MAX)
    .has().uppercase()
    .has().lowercase()
    .has().digits(process.env.PASS_INT)
    .has().not().spaces();

  if (schema.validate(pass)) return true;

  return false;
}


/**
 * ? CHECK RANGE
 * * Checks if the input value is within the range specified by min and max
 *
 * @param {number|string} value - The input value to check
 * @param {string} [message=process.env.MSG] - The message to display if the input value is not in range
 * @param {number} [min=process.env.MIN] - The minimum value of the range
 * @param {number} [max=process.env.MAX] - The maximum value of the range
 * @return {boolean} Returns true if the input value is within the range, otherwise false
 */
exports.checkRange = (value, message = process.env.MSG, min = process.env.MIN, max = process.env.MAX) => {
  const inRange = (typeof value === "number" && value >= min && value <= max) ||
                  (typeof value === "string" && value.length >= min && value.length <= max);

  if (!inRange) alert(`${message} ${min} & ${max}`);

  return inRange;
}

/**
 * ? CHECK URL
 * * Checks if the given URL is a valid URL
 *
 * @param {string} url - The URL to check
 * @return {boolean} Returns true if the given URL is a valid URL, otherwise false
 */
exports.checkUrl = (url) => {
  const validUrl = require("valid-url");

  if (validUrl.isUri(url)) return true;

  return false;
}

//! ******************** GETTERS ********************

/**
 * ? GET ARRAY FROM STRING
 * * Splits a string using comma as a delimiter & returns the resulting array
 * * If the first element of the array is an empty string, it is removed
 *
 * @param {string} string - The input string to split
 * @return {Array} - An array of string elements split from the input string
 */
exports.getArrayFromString = (string) => {
  let array = string.split(",");

  if (array[0] === "") array.shift();

  return array;
}

/**
 * ? GET ARRAY WITH USERNAME
 * * Maps `array`'s user IDs to their respective usernames from `users` & 
 * * appends the username to the `user` field of each item in `array` that has a matching user ID
 * * Returns a new array with the updated `user` fields
 *
 * @param {Array} array - The array of items to update
 * @param {Array} users - The array of users to use as a reference for updating `array`
 * @return {Array} A new array with the updated `user` fields
 */
exports.getArrayWithUsername = (array, users) => {
  const userMap = new Map(users.map(user => [user._id.toString(), user.name]));

  return array.map(item => {
    const username = userMap.get(item.user);

    if (username) item.user = `${username}-${item.user}`;

    return item;
  });
}

/**
 * ? GET NAME
 * * Returns a modified string with accents removed,
 * * spaces replaced with hyphens & all characters in lowercase
 *
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
 *
 * @param {string} name - the name of the poster
 * @return {string} a string with the name of the poster image
 */
exports.getPosterName = (name) => {

  return this.getName(name) + "-01." + process.env.IMG_EXT;
}

/**
 * ? GET UNIQUE NAME
 * * Returns a unique name by appending the current timestamp to the given name
 *
 * @param {string} name - The name to be made unique
 * @return {string} A unique name generated
 */
exports.getUniqueName = (name) => {

  return this.getName(name) + "-" + Date.now();
}

/**
 * ? GET MAILER
 * * Returns a nodemailer transport object created with the specified host,
 * * port, secure, auth user & auth pass as environment variables
 *
 * @return {Object} nodemailer transport object
 */
exports.getMailer = () => {
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
 * ? GET MESSAGE
 * * Returns an object containing email message details
 *
 * @param {Object} data - An object containing email details
 * @return {Object} An object containing from, to, bcc, subject & html properties
 */
exports.getMessage = (data) => {

  return { 
    from: process.env.MAIL_USER, 
    to: data.email, 
    bcc: process.env.MAIL_USER,
    subject: data.subject, 
    html: data.html
  };
}

/**
 * ? GET PASSWORD
 * * Generates a password using the "generate-password" package 
 *
 * @return {string} The generated password
 */
exports.getPassword = () => {
  const generator = require("generate-password");

  return generator.generate({
    length: process.env.GENERATE_LENGTH,
    numbers: process.env.GENERATE_NUMBERS,
    symbols: process.env.GENERATE_SYMBOLS,
    strict: process.env.GENERATE_STRICT
  });
}

//! ******************** SETTERS ********************

/**
 * ? SET AUTH
 * * Sets authentication for a user with provided credentials
 *
 * @param {string} pass - The password of the user
 * @param {object} user - The user object to authenticate
 * @param {object} res - The response object to send the result
 * @return {object} The result of the authentication process
 */
exports.setAuth = async (pass, user, res) => {
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");

  if (!user) return res.status(404).json({ error: process.env.LOGIN_EMAIL });

  try {
    const valid = await bcrypt.compare(pass, user.pass);

    if (!valid) return res.status(401).json({ error: process.env.LOGIN_PASS });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: process.env.JWT_DURATION }
    );

    return res.status(200).json({ userId: user._id, token });

  } catch (error) {
    return res.status(400).json({ error });
  }
}

/** 
 * ? SET IMAGE
 * * Sets the image output to a new file format and saves it in a specified location
 *
 * @param {string} input - the name and path of the input file
 * @param {string} output - the name and path of the output file
 * @returns {Promise<void>} A Promise that resolves when the image is saved in the new format
 */
exports.setImage = async (input, output) => {
  const sharp = require("sharp");

  await sharp(process.env.IMG_URL + input)
    .toFormat(process.env.IMG_EXT)
    .toFile(output);
};

/**
 * ? SET THUMBNAIL
 * * Sets the thumbnail of an image with the specified width, height & format
 *
 * @param {string} input - The path or URL of the image file
 * @param {string} output - The path where the thumbnail will be saved
 * @param {number} [width=process.env.THUMB_WIDTH] - The width of the thumbnail
 * @param {number} [height=process.env.THUMB_HEIGHT] - The height of the thumbnail
 */
exports.setThumbnail = (
  input, 
  output, 
  width = process.env.THUMB_WIDTH, 
  height = process.env.THUMB_HEIGHT
  ) => {
  const sharp = require("sharp");

  sharp(`${process.env.IMG_URL}${input}`)
    .resize(parseInt(width, 10), parseInt(height, 10), { 
      fit: process.env.THUMB_FIT, 
      position: process.env.THUMB_POSITION 
    })
    .toFormat(process.env.THUMB_EXT)
    .toFile(output);
}

/*! Author: Philippe Beck <philippe@philippebeck.net> | Updated: 17th Jun 2023 */