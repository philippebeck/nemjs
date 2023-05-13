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

  return this.getName(name) + "-01." + process.env.IMG_EXT;
}

/**
 * GET UNIQUE NAME
 * @param {string} name 
 * @returns {string}
 */
exports.getUniqueName = (name) => {

  return this.getName(name) + "-" + Date.now();
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

  return nodemailer.createTransport(transport);
}

/**
 * GET MESSAGE
 * @param {object} data 
 * @returns {object}
 */
exports.getMessage = (data) => {

  return { 
    from: process.env.MAIL_USER, 
    to: data.email, 
    bcc: process.env.MAIL_USER,
    subject: data.subject, 
    html: data.html
  };
}

/**
 * GET PASSWORD
 * @returns {string}
 */
exports.getPassword = () => {
  const generator = require("generate-password");

  return generator.generate({
    length: process.env.GENERATE_LENGTH,
    numbers: process.env.GENERATE_NUMBERS,
    symbols: process.env.GENERATE_SYMBOLS,
    strict: process.env.GENERATE_STRICT
  });
}
