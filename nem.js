"use strict";

/**
 * CHECK AUTH
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
 * @param {object} req 
 * @param {object} res 
 * @param {object} user 
 * @returns 
 */
exports.checkLogin = (req, res, user) => {
  const bcrypt  = require("bcrypt");
  const jwt     = require("jsonwebtoken");

  if (!user) {
    return res.status(401).json({ error: process.env.LOGIN_EMAIL });
  }

  bcrypt
    .compare(req.body.pass, user.pass)
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
 * CHECK USER
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
exports.checkUser = (req, res) => {
  const emailValidator  = require("email-validator"); 
  const passValidator   = require("password-validator");
  const schema          = new passValidator();

  schema
    .is().min(process.env.PASS_MIN)
    .is().max(process.env.PASS_MAX)
    .has().uppercase()
    .has().lowercase()
    .has().digits(process.env.PASS_INT)
    .has().not().spaces();

  if (!emailValidator.validate(req.body.email)) {
    return res.status(401).json({ message: process.env.USER_EMAIL });
  }

  if (!schema.validate(req.body.pass)) {
    return res.status(401).json({ message: process.env.USER_PASS });
  }
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