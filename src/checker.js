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
exports.checkNumber = (number, min = process.env.NUM_MIN, max = process.env.NUM_MAX) => {
  if (typeof number === "number" && number >= min && number <= max) {

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
exports.checkString = (string, min = process.env.STRING_MIN, max = process.env.STRING_MAX) => {
  if (typeof string === "string" && string.length >= min && string.length <= max) {

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
