//! ******************** SETTERS ********************

const assert  = require('assert');
const bcrypt  = require('bcrypt');
const fs      = require('fs');
const jwt     = require('jsonwebtoken');
const path    = require('path');
const process = require('process');
const sharp   = require('sharp');

const { 
  setAuth, 
  setImage, 
  setThumbnail
} = require('../src/setters');

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    IMG_EXT: "webp",
    IMG_URL: "https://piscium.photos/",
    JWT: "your-json-web-token",
    JWT_DURATION: "72h",
    LOGIN_EMAIL: "User not found !",
    LOGIN_PASS: "Incorrect password !",
    THUMB_EXT: "webp",
    THUMB_FIT: "cover",
    THUMB_HEIGHT: 200,
    THUMB_POSITION: "center",
    THUMB_WIDTH: 200,
  };
});

afterEach(() => {
  process.env = originalEnv;
});

/**
 * ? SET AUTH
 */
describe('setAuth()', () => {

  test('should return 404 if user is null', async () => {
    const pass = 'password';
    const user = null;

    const res = {
      status: (code) => ({ json: (response) => {
          assert.equal(code, 404);
          assert.deepEqual(response, { error: process.env.LOGIN_EMAIL });
        }
      })
    };

    await setAuth(pass, user, res);
  });

  test('should return 401 if password is invalid', async () => {
    const pass = 'invalid-password';
    const user = { pass: await bcrypt.hash('password', 10) };

    const res = {
      status: (code) => ({ json: (response) => {
          assert.equal(code, 401);
          assert.deepEqual(response, { error: process.env.LOGIN_PASS });
        }
      })
    };

    await setAuth(pass, user, res);
  });

  test('should return 200 with token and user id if authentication is successful', async () => {
    const pass = 'password';
    const user = { _id: '123', pass: await bcrypt.hash('password', 10) };

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: process.env.JWT_DURATION }
    );

    const res = {
      status: (code) => ({ json: (response) => {
          assert.equal(code, 200);
          assert.deepEqual(response, { userId: user._id, token });
        }
      })
    };

    await setAuth(pass, user, res);
  });

  test('should return 400 if an error occurs', async () => {
    const pass = 'password';
    const user = { _id: '123', pass: await bcrypt.hash('password', 10) };

    const res = {
      status: (code) => ({ json: (response) => {
          assert.equal(code, 400);
        }
      })
    };

    const originalBcryptCompare = bcrypt.compare;
    bcrypt.compare = () => { throw new Error('an error occurred') };

    await setAuth(pass, user, res);
    bcrypt.compare = originalBcryptCompare;
  });

});

/**
 * ? SET IMAGE
 */
describe('setImage()', () => {

});

/**
 * ? SET THUMBNAIL
 */
describe('setThumbnail()', () => {

});
