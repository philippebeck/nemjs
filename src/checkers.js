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
