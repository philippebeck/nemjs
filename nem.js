/*! nemjs v0.4.2 | https://www.npmjs.com/package/nemjs | Apache-2.0 License */

"use strict";

require("dotenv").config();

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
 * CHECK LOGIN
 * @param {string} pass 
 * @param {object} user 
 * @param {object} res 
 * @returns 
 */
exports.checkLogin = (pass, user, res) => {
  const bcrypt  = require("bcrypt");
  const jwt     = require("jsonwebtoken");

  if (!user) {

    return res.status(401).json({ error: process.env.LOGIN_EMAIL });
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
    .catch((error) => res.status(500).json({ error }));
}

/**
 * CHECK EMAIL
 * @param {string} email 
 * @returns 
 */
exports.checkEmail = (email) => {
  const emailValidator  = require("email-validator"); 

  if (!emailValidator.validate(email)) {
    return false;
  }
  return true;
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

  if (!schema.validate(pass)) {
    return false;
  }
  return true;
}

/**
 * CREATE IMAGE
 * @param {string} inputImg 
 * @param {string} outputImg 
 * @returns
 */
exports.createImage = (inputImg, outputImg) => {
  const sharp = require('sharp');

  sharp(process.env.IMG_URL + inputImg)
    .resize(
      parseInt(process.env.IMG_WIDTH, 10), 
      parseInt(process.env.IMG_HEIGHT, 10),
      { 
        fit: process.env.IMG_FIT,
        position: process.env.IMG_POSITION 
      }
    )
    .toFormat(process.env.IMG_EXT)
    .toFile(process.env.IMG_URL + outputImg);
}

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

/*! Author: Philippe Beck <philippe@philippebeck.net> | Updated: 15th Jan 2023 */