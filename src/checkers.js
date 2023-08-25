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
 * @param {number} [min=process.env.MIN] - The minimum value of the range
 * @param {number} [max=process.env.MAX] - The maximum value of the range
 * @return {boolean} Returns true if the input value is within the range, otherwise false
 */
exports.checkRange = (value, min = process.env.MIN, max = process.env.MAX) => {
  const IS_NUMBER_OK = (typeof value === "number" && value >= min && value <= max);
  const IS_STRING_OK = (typeof value === "string" && value.length >= min && value.length <= max);

  return IS_NUMBER_OK || IS_STRING_OK;
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
