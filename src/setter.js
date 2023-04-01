//! ******************** SETTERS ********************

/**
 * SET AUTHENTICATION
 * @param {string} pass 
 * @param {object} user 
 * @param {object} res 
 * @returns 
 */
exports.setAuth = (pass, user, res) => {
  const bcrypt  = require("bcrypt");
  const jwt     = require("jsonwebtoken");

  if (!user) {
    return res.status(404).json({ error: process.env.LOGIN_EMAIL });
  }

  bcrypt
    .compare(pass, user.pass)
    .then((valid) => {

      if (!valid) {
        return res.status(401).json({ error: process.env.LOGIN_PASS });
      }

      res.status(200).json({
        userId: user._id,
        token: jwt.sign(
          { userId: user._id },
          process.env.JWT,
          { expiresIn: process.env.JWT_DURATION }
        )
      });
    })
    .catch((error) => res.status(400).json({ error }));
}

/**
 * SET IMAGE
 * @param {string} inputImg 
 * @param {string} outputImg 
 */
exports.setImage = (inputImg, outputImg) => {
  const sharp = require('sharp');

  sharp(process.env.IMG_URL + inputImg)
    .toFormat(process.env.IMG_EXT)
    .toFile(process.env.IMG_URL + outputImg);
}

/**
 * SET THUMBNAIL
 * @param {string} inputImg 
 * @param {string} outputImg 
 * @param {number} width 
 * @param {number} height 
 */
exports.setThumbnail = (
  inputImg, 
  outputImg, 
  width = process.env.THUMB_WIDTH, 
  height = process.env.THUMB_HEIGHT
  ) => {

  const sharp = require('sharp');

  sharp(process.env.IMG_URL + inputImg)
    .resize(
      parseInt(width, 10), 
      parseInt(height, 10),
      { 
        fit: process.env.THUMB_FIT,
        position: process.env.THUMB_POSITION 
      }
    )
    .toFormat(process.env.THUMB_EXT)
    .toFile(process.env.THUMB_URL + outputImg);
}
