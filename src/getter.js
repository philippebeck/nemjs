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
 * GET NAME
 * @param {string} name 
 * @returns
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
 * @returns
 */
exports.getPosterName = (name) => {
  let posterName = getName(name) + "-01." + process.env.IMG_EXT;

  return posterName;
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
