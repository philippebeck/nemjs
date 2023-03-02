/**
 * CONVERT STRING TO ARRAY
 * @param {string} string 
 * @returns 
 */
exports.stringToArray = (string) => {
  let array = string.split(",");

  if (array[0] === "") { 
    array.shift();
  }

  return array;
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
