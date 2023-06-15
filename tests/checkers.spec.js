//! ******************** CHECKERS ********************

const assert  = require('assert');
const jwt     = require("jsonwebtoken");

const { 
  checkAuth, 
  checkEmail, 
  checkPass, 
  checkRange, 
  checkUrl 
} = require("../src/checkers");

const originalEnv = process.env;

global.alert = jest.fn();
global.res = jest.fn();

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    AUTH_ID: "Invalid Id !",
    AUTH_REQ: "Invalid Request !",
    MAX: 50,
    MIN: 2,
    MSG: "Value out of range !",
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

  test("should return 401 if the token is invalid", () => {
    const req = {
      headers: { authorization: "Bearer invalid_token" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();
    jwt.verify = jest.fn(() => { throw new Error() });
    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: new Error(process.env.AUTH_REQ) });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if the userId in the request body is different from the one in the token", () => {
    const req = {
      headers: { authorization: "Bearer valid_token" },
      body: { userId: "invalid_user_id" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();
    jwt.verify = jest.fn(() => ({ userId: "valid_user_id" }));
    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: new Error(process.env.AUTH_REQ) });
    expect(next).not.toHaveBeenCalled();
  });
});

/**
 * ? CHECK EMAIL
 */
describe('checkEmail()', () => {

  test('returns true when given a valid email', () => {
    assert.strictEqual(checkEmail('hello@example.com'), true);
  });

  test('returns false when given an invalid email format', () => {
    assert.strictEqual(checkEmail('notanemail'), false);
  });

  test('returns false when given an empty string', () => {
    assert.strictEqual(checkEmail(''), false);
  });
});

/**
 * ? CHECK PASS
 */
describe('checkPass()', () => {

  test('returns true for a valid password', () => {
    const validPass = 'Abcdef1!';
    const isValid = checkPass(validPass);

    assert.strictEqual(isValid, true);
  });

  test('returns false for a password that is too short', () => {
    const invalidPass = 'Abc1!';
    const isValid = checkPass(invalidPass);

    assert.strictEqual(isValid, false);
  });

  test('returns false for a password that is too long', () => {
    const invalidPass = 'Abcdef1!'.repeat(100);
    const isValid = checkPass(invalidPass);

    assert.strictEqual(isValid, false);
  });

  test('returns false for a password without an uppercase letter', () => {
    const invalidPass = 'abcdef1!';
    const isValid = checkPass(invalidPass);

    assert.strictEqual(isValid, false);
  });

  test('returns false for a password without a lowercase letter', () => {
    const invalidPass = 'ABCDEF1!';
    const isValid = checkPass(invalidPass);

    assert.strictEqual(isValid, false);
  });

  test('returns false for a password without a digit', () => {
    const invalidPass = 'Abcdefgh!';
    const isValid = checkPass(invalidPass);

    assert.strictEqual(isValid, false);
  });

  test('returns false for a password with spaces', () => {
    const invalidPass = 'Abcdef1! ';
    const isValid = checkPass(invalidPass);

    assert.strictEqual(isValid, false);
  });
});

/**
 * ? CHECK RANGE
 */
describe("checkRange()", () => {
  const msg = "Value out of range";

  test("should return true if value is within the specified range", () => {

    expect(checkRange(3, msg)).toBe(true);
    expect(checkRange(50, msg)).toBe(true);
    expect(checkRange("aA", msg)).toBe(true);
    expect(checkRange("abcdefghijklmnopqrstuvwxyz", msg)).toBe(true);
  });

  test("should return false if value is not within the specified range", () => {

    expect(checkRange(1, msg)).toBe(false);
    expect(checkRange(51, msg)).toBe(false);
    expect(checkRange("", msg)).toBe(false);
    expect(checkRange("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", msg)).toBe(false);
  });

  test("should display the correct message if value is not within the specified range", () => {
    const min = 2;
    const max = 50;

    checkRange(1, msg, min, max);
    expect(alert).toHaveBeenCalledWith(`${msg} ${min} & ${max}`);

    checkRange(51, msg, min, max);
    expect(alert).toHaveBeenCalledWith(`${msg} ${min} & ${max}`);

    checkRange("", msg, min, max);
    expect(alert).toHaveBeenCalledWith(`${msg} ${min} & ${max}`);

    checkRange("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", msg, min, max);
    expect(alert).toHaveBeenCalledWith(`${msg} ${min} & ${max}`);
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
