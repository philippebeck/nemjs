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
 * GENERATE PASSWORD
 * @returns 
 */
exports.generatePass = () => {
  const generator = require("generate-password");

  let pass = generator.generate({
    length: process.env.GENERATE_LENGTH,
    numbers: process.env.GENERATE_NUMBERS,
    symbols: process.env.GENERATE_SYMBOLS,
    strict: process.env.GENERATE_STRICT
  });

  return pass;
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