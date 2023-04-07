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
  let posterName = getName(name) + "-01." + process.env.IMG_EXT;

  return posterName;
}

/**
 * GET UNIQUE NAME
 * @param {string} name 
 * @returns {string}
 */
exports.getUniqueName = (name) => {
  let uniqueName = getName(name) + "-" + Date.now();

  return uniqueName;
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

  let mailer = nodemailer.createTransport(transport);

  return mailer;
}

/**
 * GET MESSAGE
 * @param {object} data 
 * @returns {object}
 */
exports.getMessage = (data) => {

  let message = { 
    from: process.env.MAIL_USER, 
    to: data.email, 
    bcc: process.env.MAIL_USER,
    subject: data.subject, 
    html: data.html
  };

  return message;
}

/**
 * GET PASSWORD
 * @returns {string}
 */
exports.getPassword = () => {
  const generator = require("generate-password");

  let password = generator.generate({
    length: process.env.GENERATE_LENGTH,
    numbers: process.env.GENERATE_NUMBERS,
    symbols: process.env.GENERATE_SYMBOLS,
    strict: process.env.GENERATE_STRICT
  });

  return password;
}
