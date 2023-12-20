//! ******************** CHECKERS ********************

const jwt = require("jsonwebtoken");

const { 
  checkAuth, 
  checkEmail, 
  checkPass, 
  checkRange, 
  checkUrl 
} = require("../src/checkers");

const originalEnv = process.env;

global.alert = jest.fn();

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    AUTH_ID: "Invalid Id !",
    AUTH_REQ: "Invalid Request !",
    JWT: "your-json-web-token",
    JWT_DURATION: "72h",
    MAX: 50,
    MIN: 2,
    PASS_INT: 1,
    PASS_MAX: 50,
    PASS_MIN: 8,
  };
});

afterEach(() => {
  process.env = originalEnv;
});

/**
 * ? CHECK AUTH
 */
describe("checkAuth()", () => {
  const next = jest.fn();

  test("should return 401 if the token is invalid", () => {
    const req = { headers: { authorization: "Bearer invalid_token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jwt.verify = jest.fn(() => { 
      throw new Error() 
    });

    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: new Error(process.env.AUTH_REQ) });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if the userId in the request body is different from the one in the token", () => {
    const req = {
      headers: { authorization: "Bearer valid_token" },
      body: { userId: "invalid_userid" }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jwt.verify = jest.fn(() => ({ userId: "valid_userid" }));
    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: new Error(process.env.AUTH_REQ) });
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw an error when an invalid token is provided", () => {
    const req = { headers: { authorization: "Bearer invalidToken" } };
    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    };

    jwt.verify = jest.fn().mockImplementationOnce(() => { 
      throw new Error() 
    });

    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: new Error(process.env.AUTH_REQ) });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next() if the userId matches", () => {
    const token = jwt.sign(
      { userId: "1" },
      process.env.JWT,
      { expiresIn: process.env.JWT_DURATION }
    );

    const req = {
      headers: { authorization: `Bearer ${token}` },
      body: { userId: "1" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = () => {};

    expect(checkAuth(req, res, next)).toStrictEqual(undefined);
  });
});

/**
 * ? CHECK EMAIL
 */
describe("checkEmail()", () => {

  test("returns true when given a valid email", () => {
    expect(checkEmail("hello@example.com")).toStrictEqual(true);
  });

  test("returns false when given an invalid email format", () => {
    expect(checkEmail("notanemail")).toStrictEqual(false);
  });

  test("returns false when given an empty string", () => {
    expect(checkEmail("")).toStrictEqual(false);
  });
});

/**
 * ? CHECK PASS
 */
describe("checkPass()", () => {

  test("returns true for a valid password", () => {
    const validPass = "Abcdef1!";
    const isValid = checkPass(validPass);

    expect(isValid).toStrictEqual(true);
  });

  test("returns false for a password that is too short", () => {
    const invalidPass = "Abc1!";
    const isValid = checkPass(invalidPass);

    expect(isValid).toStrictEqual(false);
  });

  test("returns false for a password that is too long", () => {
    const invalidPass = "Abcdef1!".repeat(100);
    const isValid = checkPass(invalidPass);

    expect(isValid).toStrictEqual(false);
  });

  test("returns false for a password without an uppercase letter", () => {
    const invalidPass = "abcdef1!";
    const isValid = checkPass(invalidPass);

    expect(isValid).toStrictEqual(false);
  });

  test("returns false for a password without a lowercase letter", () => {
    const invalidPass = "ABCDEF1!";
    const isValid = checkPass(invalidPass);

    expect(isValid).toStrictEqual(false);
  });

  test("returns false for a password without a digit", () => {
    const invalidPass = "Abcdefgh!";
    const isValid = checkPass(invalidPass);

    expect(isValid).toStrictEqual(false);
  });

  test("returns false for a password with spaces", () => {
    const invalidPass = "Abcdef1! ";
    const isValid = checkPass(invalidPass);

    expect(isValid).toStrictEqual(false);
  });
});

/**
 * ? CHECK RANGE
 */
describe("checkRange()", () => {
  test("should return true if value is within the specified range", () => {

    expect(checkRange(3)).toBe(true);
    expect(checkRange(50)).toBe(true);
    expect(checkRange("aA")).toBe(true);
    expect(checkRange("abcdefghijklmnopqrstuvwxyz")).toBe(true);
  });

  test("should return false if value is not within the specified range", () => {

    expect(checkRange(1)).toBe(false);
    expect(checkRange(51)).toBe(false);
    expect(checkRange("")).toBe(false);
    expect(checkRange("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe(false);
  });
});

/**
 * ? CHECK URL
 */
describe("checkUrl()", () => {

  test("returns true for a valid URL", () => {
    expect(checkUrl("https://www.example.com")).toBe(true);
  });

  test("returns false for a non-URL string", () => {
    expect(checkUrl("not a url")).toBe(false);
  });

  test("returns false for an empty string", () => {
    expect(checkUrl("")).toBe(false);
  });

  test("returns false for a null value", () => {
    expect(checkUrl(null)).toBe(false);
  });

  test("returns false for an undefined value", () => {
    expect(checkUrl(undefined)).toBe(false);
  });
});
