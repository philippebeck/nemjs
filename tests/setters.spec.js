//! ******************** SETTERS ********************

const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const path    = require("path");
const process = require("process");
const sharp   = require("sharp");
const sinon   = require("sinon");

const { 
  setAuth, 
  setImage, 
  setThumbnail
} = require("../src/setters");

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();

  process.env = {
    ...originalEnv,
    IMG_EXT: "webp",
    IMG_URL: "../img/",
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
describe("setAuth()", () => {

  test("should return 404 if user is null", async () => {
    const pass = "password";
    const user = null;

    const res = {
      status: (code) => ({ json: (response) => {
        expect(code).toStrictEqual(404);
        expect(response).toStrictEqual({ error: process.env.LOGIN_EMAIL });
      }})
    };

    await setAuth(pass, user, res);
  });

  test("should return 401 if password is invalid", async () => {
    const pass = "invalid-password";
    const user = { pass: await bcrypt.hash("password", 10) };

    const res = {
      status: (code) => ({ json: (response) => {
          expect(code).toStrictEqual(401);
          expect(response).toStrictEqual({ error: process.env.LOGIN_PASS });
        }
      })
    };

    await setAuth(pass, user, res);
  });

  test("should return 200 with token & user id if authentication is successful", async () => {
    const pass = "password";
    const user = { _id: "123", pass: await bcrypt.hash("password", 10) };

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: process.env.JWT_DURATION }
    );

    const res = {
      status: (code) => ({ json: (response) => {
          expect(code).toStrictEqual(200);
          expect(response).toStrictEqual({ userId: user._id, token });
        }
      })
    };

    await setAuth(pass, user, res);
  });

  test("should return 400 if an error occurs", async () => {
    const pass = "password";
    const user = { _id: "123", pass: await bcrypt.hash("password", 10) };

    const res = {
      status: (code) => ({ json: (response) => {
          expect(code).toStrictEqual(400);
        }
      })
    };

    const originalBcryptCompare = bcrypt.compare;
    bcrypt.compare = () => { 
      throw new Error("an error occurred") 
    };

    await setAuth(pass, user, res);
    bcrypt.compare = originalBcryptCompare;
  });

});

/**
 * ? SET IMAGE
 */
describe("setImage()", () => {
  test("should throw an error if input file does not exist", async () => {
    const inputPath = "nonexistent.jpg";
    const outputPath = path.join(__dirname, "test.webp");
    await expect(setImage(inputPath, outputPath)).rejects.toThrow();
  });
});

/**
 * ? SET THUMBNAIL
 */
describe("setThumbnail()", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(process.env, "IMG_URL").value("img/");
    sandbox.stub(process.env, "THUMB_WIDTH").value(200);
    sandbox.stub(process.env, "THUMB_HEIGHT").value(200);
    sandbox.stub(process.env, "THUMB_FIT").value("cover");
    sandbox.stub(process.env, "THUMB_POSITION").value("center");
    sandbox.stub(process.env, "THUMB_EXT").value("jpeg");
  });

  afterEach(() => {
    sandbox.restore();
  });

  test("should default to the process environment variables for the width & height if none are provided", async () => {
    const input = "test.jpg";
    const output = "img/test_thumb.jpg";
    const resizeSpy = sandbox.spy(sharp.prototype, "resize");
    const toFormatSpy = sandbox.spy(sharp.prototype, "toFormat");
    const toFileSpy = sandbox.spy(sharp.prototype, "toFile");

    await setThumbnail(input, output);

    expect(resizeSpy.calledOnceWithExactly(200, 200, { fit: "cover", position: "center" })).toBe(false);
    expect(toFormatSpy.calledOnceWithExactly("jpeg")).toBe(false);
    expect(toFileSpy.calledOnceWithExactly(output)).toBe(false);
  });
});
