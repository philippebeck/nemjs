/**
 * CREATE IMAGE
 * @param {string} inputImg 
 * @param {string} outputImg 
 * @returns
 */
exports.createImage = (inputImg, outputImg) => {
  const sharp = require('sharp');

  sharp(process.env.IMG_URL + inputImg)
    .resize(
      parseInt(process.env.IMG_WIDTH, 10), 
      parseInt(process.env.IMG_HEIGHT, 10),
      { 
        fit: process.env.IMG_FIT,
        position: process.env.IMG_POSITION 
      }
    )
    .toFormat(process.env.IMG_EXT)
    .toFile(process.env.IMG_URL + outputImg);
}