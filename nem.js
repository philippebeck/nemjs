/*! nemjs v1.4.1 | https://www.npmjs.com/package/nemjs | Apache-2.0 License */

"use strict";

require("dotenv").config();

//! ******************** CHECKERS ********************

/**
 * CHECK AUTHENTICATION
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.checkAuth = (req, res, next) => {
  const jwt = require("jsonwebtoken");

  try {
    const token     = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, process.env.JWT);
    const userId    = tokenData.userId;

    req.auth = { userId };

    if (req.body.userId && req.body.userId !== userId) {
      throw process.env.AUTH_ID;
      
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error(process.env.AUTH_REQ) });
  }
};

/**
 * CHECK EMAIL
 * @param {string} email 
 * @returns {boolean}
 */
exports.checkEmail = (email) => {
  const emailValidator = require("email-validator"); 

  if (emailValidator.validate(email)) {
    return true;
  }

  return false;
}

/**
 * CHECK NUMBER
 * @param {number} number
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
exports.checkNumber = (
  number, 
  min = process.env.NUM_MIN, 
  max = process.env.NUM_MAX
  ) => {

  number = Number(number);

  if (number >= min && number <= max) {
    return true;
  }

  return false;
}

/**
 * CHECK PASSWORD
 * @param {string} pass 
 * @returns {boolean}
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

  if (schema.validate(pass)) {
    return true;
  }

  return false;
}

/**
 * CHECK STRING
 * @param {string} string
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
exports.checkString = (
  string, 
  min = process.env.STRING_MIN,
  max = process.env.STRING_MAX
  ) => {

  string = String(string);

  if (string.length >= min && string.length <= max) {
    return true;
  }

  return false;
}

/**
 * CHECK URL
 * @param {string} url 
 * @returns {boolean}
 */
exports.checkUrl = (url) => {
  const validUrl = require("valid-url");

  if (validUrl.isUri(url)) {
    return true;
  }

  return false;
}

//! ******************** GETTERS ********************

/**
 * GET ARRAY FROM STRING
 * @param {string} string 
 * @returns {array}
 */
exports.getArrayFromString = (string) => {
  let array = string.split(",");

  if (array[0] === "") { 
    array.shift();
  }

  return array;
}

/**
 * GET ARRAY WITH USERNAME
 * @param {array} array 
 * @param {array} users 
 * @returns {array}
 */
exports.getArrayWithUsername = (array, users) => {
  for (let item of array) {
    for (let user of users) {

      if (item.user === user._id.toString()) {
        item.user = user.name + "-" + item.user;
      }
    }
  }

  return array;
}

/**
 * GET NAME
 * @param {string} name 
 * @returns {string}
 */
exports.getName = (name) => {
  const accents = require("remove-accents");

  name = accents
    .remove(name)
    .replace(/ /g, "-")
    .toLowerCase();

  return name;
}

/**
 * GET POSTER NAME
 * @param {string} name 
 * @returns {string}
 */
exports.getPosterName = (name) => {

  return this.getName(name) + "-01." + process.env.IMG_EXT;
}

/**
 * GET UNIQUE NAME
 * @param {string} name 
 * @returns {string}
 */
exports.getUniqueName = (name) => {

  return this.getName(name) + "-" + Date.now();
}

/**
 * GET MAILER
 * @returns {object}
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
 * GET MESSAGE
 * @param {object} data 
 * @returns {object}
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
 * GET PASSWORD
 * @returns {string}
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
 * SET AUTHENTICATION
 * @param {string} pass 
 * @param {object} user 
 * @param {object} res 
 * @returns {object}
 */
exports.setAuth = (pass, user, res) => {
  const bcrypt  = require("bcrypt");
  const jwt     = require("jsonwebtoken");

  if (!user) {
    return res.status(404).json({ error: process.env.LOGIN_EMAIL });
  }

  bcrypt
    .compare(pass, user.pass)
    .then((valid) => {

      if (!valid) {
        return res.status(401).json({ error: process.env.LOGIN_PASS });
      }

      res.status(200).json({
        userId: user._id,
        token: jwt.sign(
          { userId: user._id },
          process.env.JWT,
          { expiresIn: process.env.JWT_DURATION }
        )
      });
    })
    .catch((error) => res.status(400).json({ error }));
}

/**
 * SET IMAGE
 * @param {string} input 
 * @param {string} output 
 */
exports.setImage = (input, output) => {
  const sharp = require('sharp');

  sharp(process.env.IMG_URL + input)
    .toFormat(process.env.IMG_EXT)
    .toFile(output);
}

/**
 * SET THUMBNAIL
 * @param {string} input 
 * @param {string} output 
 * @param {number} width 
 * @param {number} height 
 */
exports.setThumbnail = (
  input, 
  output, 
  width = process.env.THUMB_WIDTH, 
  height = process.env.THUMB_HEIGHT
  ) => {

  const sharp = require('sharp');

  sharp(process.env.IMG_URL + input)
    .resize(
      parseInt(width, 10), 
      parseInt(height, 10),
      { 
        fit: process.env.THUMB_FIT,
        position: process.env.THUMB_POSITION 
      }
    )
    .toFormat(process.env.THUMB_EXT)
    .toFile(output);
}

/*! Author: Philippe Beck <philippe@philippebeck.net> | Updated: 13th May 2023 */