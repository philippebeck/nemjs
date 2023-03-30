/*! nemjs v1.3.0 | https://www.npmjs.com/package/nemjs | Apache-2.0 License */

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
 * @returns 
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
 * @returns 
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
 * @returns 
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
 * @returns 
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
 * @returns 
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
 * @returns 
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
 * @returns 
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
 * GET GALLERY COVER NAME
 * @param {string} name 
 * @returns
 */
exports.getGalleryCoverName = (name) => {
  const accents = require("remove-accents");

  return accents
    .remove(name)
    .replace(/ /g, "-")
    .toLowerCase() + "-01." + process.env.IMG_EXT;
}

/**
 * GET GALLERY NAME
 * @param {string} name 
 * @returns
 */
exports.getGalleryName = (name) => {
  const accents = require("remove-accents");

  return accents
    .remove(name)
    .replace(/ /g, "-")
    .toLowerCase();
}

/**
 * GET IMAGE NAME
 * @param {string} name 
 * @returns
 */
exports.getImageName = (name) => {
  const accents = require("remove-accents");

  return accents
    .remove(name)
    .replace(/ /g, "-")
    .toLowerCase() + "-" + Date.now() + "." + process.env.IMG_EXT;
}

/**
 * GET MAILER
 * @returns 
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
 * @param {object} message 
 * @returns 
 */
exports.getMessage = (message) => {

  return { 
    from: process.env.MAIL_USER, 
    to: message.email, 
    bcc: process.env.MAIL_USER,
    subject: message.subject, 
    html: message.html
  };
}

/**
 * GET NEW PASSWORD
 * @returns 
 */
exports.getNewPass = () => {
  const generator = require("generate-password");

  let pass = generator.generate({
    length: process.env.GENERATE_LENGTH,
    numbers: process.env.GENERATE_NUMBERS,
    symbols: process.env.GENERATE_SYMBOLS,
    strict: process.env.GENERATE_STRICT
  });

  return pass;
}

//! ******************** SETTERS ********************

/**
 * SET AUTHENTICATION
 * @param {string} pass 
 * @param {object} user 
 * @param {object} res 
 * @returns 
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
 * @param {string} inputImg 
 * @param {string} outputImg 
 * @param {number} width 
 * @param {number} height 
 */
exports.setImage = (
  inputImg, 
  outputImg, 
  width = process.env.IMG_WIDTH, 
  height = process.env.IMG_HEIGHT
  ) => {

  const sharp = require('sharp');

  sharp(process.env.IMG_URL + inputImg)
    .resize(
      parseInt(width, 10), 
      parseInt(height, 10),
      { 
        fit: process.env.IMG_FIT,
        position: process.env.IMG_POSITION 
      }
    )
    .toFormat(process.env.IMG_EXT)
    .toFile(process.env.IMG_URL + outputImg);
}

/**
 * SET THUMBNAIL
 * @param {string} inputImg 
 * @param {string} outputImg 
 * @param {number} width 
 * @param {number} height 
 */
exports.setThumbnails = (
  inputImg, 
  outputImg, 
  width = process.env.IMG_WIDTH, 
  height = process.env.IMG_HEIGHT
  ) => {

  const sharp = require('sharp');

  sharp(process.env.IMG_URL + inputImg)
    .resize(
      parseInt(width, 10), 
      parseInt(height, 10),
      { 
        fit: process.env.THUMB_FIT,
        position: process.env.THUMB_POSITION 
      }
    )
    .toFormat(process.env.THUMB_EXT)
    .toFile(process.env.THUMB_URL + outputImg);
}

/*! Author: Philippe Beck <philippe@philippebeck.net> | Updated: 30th Mar 2023 */