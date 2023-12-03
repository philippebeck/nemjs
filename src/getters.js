//! ******************** GETTERS ********************

/**
 * ? GET ARRAY FROM STRING
 * * Splits a string using comma as a delimiter & returns the resulting array
 * * If the first element of the array is an empty string, it is removed
 *
 * @param {string} string - The input string to split
 * @return {Array} - An array of string elements split from the input string
 */
exports.getArrayFromString = (string) => {
  const array = string.split(",");

  if (array[0] === "") array.shift();

  return array;
}

/**
 * ? GET ARRAY WITH USERNAME
 * * Maps array's user IDs to their respective usernames from `users` & 
 * * appends the username to the `user` field of each item in `array` that has a matching user ID
 * * Returns a new array with the updated `user` fields
 *
 * @param {Array} array - The array of items to update
 * @param {Array} users - The array of users to use as a reference for updating `array`
 * @return {Array} A new array with the updated `user` fields
 */
exports.getArrayWithUsername = (array, users) => {
  const userMap = new Map(users.map(user => [user.id.toString(), user.name]));

  return array.map(item => {
    const username = userMap.get(item.user);

    if (username) item.user = `${username}-${item.user}`;

    return item;
  });
}

/**
 * ? GET NAME
 * * Returns a modified string with accents removed,
 * * spaces replaced with hyphens & all characters in lowercase
 *
 * @param {string} name - the original string
 * @return {string} the modified string 
 */
exports.getName = (name) => {
  const accents = require("remove-accents");

  return accents.remove(name).replace(/ /g, "-").toLowerCase();
}

/**
 * ? GET POSTER NAME
 * * Returns a string with the name of a poster image
 *
 * @param {string} name - the name of the poster
 * @return {string} a string with the name of the poster image
 */
exports.getPosterName = (name) => {

  return this.getName(name) + "-01." + process.env.IMG_EXT;
}

/**
 * ? GET UNIQUE NAME
 * * Returns a unique name by appending the current timestamp to the given name
 *
 * @param {string} name - The name to be made unique
 * @return {string} A unique name generated
 */
exports.getUniqueName = (name) => {

  return this.getName(name) + "-" + Date.now();
}

/**
 * ? GET MAILER
 * * Returns a nodemailer transport object created with the specified host,
 * * port, secure, auth user & auth pass as environment variables
 *
 * @return {Object} nodemailer transport object
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
 * ? GET MESSAGE
 * * Returns an object containing email message details
 *
 * @param {Object} data - An object containing email details
 * @return {Object} An object containing from, to, bcc, subject & html properties
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
 * ? GET PASSWORD
 * * Generates a password using the "generate-password" package 
 *
 * @return {string} The generated password
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
