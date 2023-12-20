//! ******************** SETTERS ********************

/**
 * ? SET AUTH
 * * Sets authentication for a user with provided credentials
 * @param {string} pass - The password of the user
 * @param {Object} user - The user object to authenticate
 * @param {Object} res - The response object to send the result
 * @return {Object} The result of the authentication process
 */
exports.setAuth = async (password, user, res) => {
  const { JWT, JWT_DURATION, LOGIN_EMAIL, LOGIN_PASS } = process.env;
  const { id, pass } = user ?? {};

  const bcrypt  = require("bcrypt");
  const jwt     = require("jsonwebtoken");

  if (!user) return res.status(404).json({ error: LOGIN_EMAIL });

  try {
    const valid = await bcrypt.compare(password, pass);
    if (!valid) return res.status(401).json({ error: LOGIN_PASS });

    const token = jwt.sign({ userId: id }, JWT, { expiresIn: JWT_DURATION });
    return res.status(200).json({ userId: id, token });

  } catch (error) { return res.status(400).json({ error })};
}

/** 
 * ? SET IMAGE
 * * Sets the image output to a new file format and saves it in a specified location
 * @param {string} input - the name and path of the input file
 * @param {string} output - the name and path of the output file
 */
exports.setImage = async (input, output) => {
  const { IMG_EXT, IMG_URL } = process.env;
  const sharp = require("sharp");

  await sharp(IMG_URL + input)
    .toFormat(IMG_EXT)
    .toFile(IMG_URL + output);
};

/**
 * ? SET THUMBNAIL
 * * Sets the thumbnail of an image with the specified width, height & format
 * @param {string} input - The path or URL of the image file
 * @param {string} output - The path where the thumbnail will be saved
 * @param {number} [width=process.env.THUMB_WIDTH] - The width of the thumbnail
 * @param {number} [height=process.env.THUMB_HEIGHT] - The height of the thumbnail
 */
exports.setThumbnail = (input, output, width = process.env.THUMB_WIDTH, height = process.env.THUMB_HEIGHT) => {
  const { IMG_EXT, IMG_URL, THUMB_FIT, THUMB_POSITION, THUMB_URL } = process.env;
  const sharp = require("sharp");

  sharp(IMG_URL + input)
    .resize(parseInt(width, 10), parseInt(height, 10), { fit: THUMB_FIT, position: THUMB_POSITION })
    .toFormat(IMG_EXT)
    .toFile(THUMB_URL + output);
}
