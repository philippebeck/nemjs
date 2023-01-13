/**
 * CHECK EMAIL
 * @param {string} email 
 * @param {object} res 
 * @returns 
 */
exports.checkEmail = (email, res) => {
  const emailValidator  = require("email-validator"); 

  if (!emailValidator.validate(email)) {

    return res.status(401).json({ message: process.env.USER_EMAIL });
  }
}

/**
 * CHECK PASSWORD
 * @param {string} pass 
 * @param {object} res 
 * @returns 
 */
exports.checkPass = (pass, res) => {
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

    return res.status(401).json({ message: process.env.USER_PASS });
  }
}
