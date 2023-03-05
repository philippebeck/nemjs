/**
 * GET GENERATE PASSWORD
 * @returns 
 */
exports.getGeneratePass = () => {
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
