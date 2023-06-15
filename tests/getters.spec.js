//! ******************** GETTERS ********************

const assert      = require("assert");
const nodemailer  = require("nodemailer");

const { 
  getArrayFromString, 
  getArrayWithUsername, 
  getName, 
  getPosterName, 
  getUniqueName, 
  getMailer, 
  getMessage, 
  getPassword 
} = require('../src/getters');

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    IMG_EXT: "webp",
    MAIL_HOST: "mail.test.com",
    MAIL_PASS: "your-password",
    MAIL_PORT: 25,
    MAIL_SECURE: false,
    MAIL_USER: "user@mail.com",
    GENERATE_LENGTH: 12,
    GENERATE_NUMBERS: true,
    GENERATE_SYMBOLS: true,
    GENERATE_STRICT: true,
  };
});

afterEach(() => {
  process.env = originalEnv;
});

/**
 * ? GET ARRAY FROM STRING
 */
describe('getArrayFromString()', () => {

  test('should split a string using comma as a delimiter', () => {
    const input = 'a,b,c';
    const expected = ['a', 'b', 'c'];
    expect(getArrayFromString(input)).toEqual(expected);
  });

  test('should remove the first element if it is an empty string', () => {
    const input = ',a,b,c';
    const expected = ['a', 'b', 'c'];
    expect(getArrayFromString(input)).toEqual(expected);
  });

  test('should return an empty array if an empty string is passed', () => {
    const input = '';
    const expected = [];
    expect(getArrayFromString(input)).toEqual(expected);
  });
});

/**
 * ? GET ARRAY WITH USERNAME
 */
describe('getArrayWithUsername()', () => {
  const users = [
    { _id: '1', name: 'Alice' },
    { _id: '2', name: 'Bob' },
    { _id: '3', name: 'Charlie' },
  ];

  const inputArray = [
    { user: '1', text: 'Hello' },
    { user: '2', text: 'World' },
    { user: '4', text: 'Goodbye' },
  ];

  test('returns an empty array when given an empty array', () => {
    expect(getArrayWithUsername([], users)).toEqual([]);
  });

  test('returns the original array when given an empty users array', () => {
    expect(getArrayWithUsername(inputArray, [])).toEqual(inputArray);
  });

  test('returns a new array with updated user fields', () => {
    const outputArray = getArrayWithUsername(inputArray, users);
    expect(outputArray).not.toBe(inputArray);
    expect(outputArray).toEqual([
      { user: 'Alice-1', text: 'Hello' },
      { user: 'Bob-2', text: 'World' },
      { user: '4', text: 'Goodbye' },
    ]);
  });

  test('updates user fields for matching user IDs', () => {
    const outputArray = getArrayWithUsername(inputArray, users);
    expect(outputArray[0].user).toEqual('Alice-1');
    expect(outputArray[1].user).toEqual('Bob-2');
  });

  test('does not update user fields for non-matching user IDs', () => {
    const outputArray = getArrayWithUsername(inputArray, users);
    expect(outputArray[2].user).toEqual('4');
  });

  test('appends the username to the user field for matching user IDs', () => {
    const outputArray = getArrayWithUsername(inputArray, users);
    expect(outputArray[0].user).toEqual('Alice-1');
    expect(outputArray[1].user).toEqual('Bob-2');
  });

  test('does not append the username to the user field for non-matching user IDs', () => {
    const outputArray = getArrayWithUsername(inputArray, users);
    expect(outputArray[2].user).toEqual('4');
  });
});

/**
 * ? GET NAME
 */
describe("getName()", () => {

  test("should remove accents, replace spaces with hyphens, and convert everything to lowercase", () => {
    const input = "Rénée Joséphine ñoño";
    const expectedOutput = "renee-josephine-nono";
    const actualOutput = getName(input);
    assert.strictEqual(actualOutput, expectedOutput);
  });

  test("should return an empty string if the input is an empty string", () => {
    const input = "";
    const expectedOutput = "";
    const actualOutput = getName(input);
    assert.strictEqual(actualOutput, expectedOutput);
  });

  test("should handle an input string with no accents and no spaces", () => {
    const input = "foobar";
    const expectedOutput = "foobar";
    const actualOutput = getName(input);
    assert.strictEqual(actualOutput, expectedOutput);
  });
});

/**
 * ? GET POSTER NAME
 */
describe('getPosterName()', () => {

  test('returns a string with the name of the poster image', () => {
    const name = 'poster';
    expect(getPosterName(name)).toBe(`${name}-01.${process.env.IMG_EXT}`);
  });
});

/**
 * ? GET UNIQUE NAME
 */
describe('getUniqueName()', () => {

  test('should append timestamp to the given name', () => {
    const name = 'test';
    const uniqueName = getUniqueName(name);
    const timestamp = Date.now();
    expect(uniqueName).toMatch(new RegExp(`${name}-${timestamp}$`));
  });

  test('should return a string', () => {
    const uniqueName = getUniqueName('test');
    expect(typeof uniqueName).toEqual('string');
  });
});

/**
 * ? GET MAILER
 */
describe("getMailer()", () => {

  test("should set the correct host, port, secure, user & pass from environment variables", () => {
    process.env.MAIL_HOST = "smtp.example.com";
    process.env.MAIL_PORT = 465;
    process.env.MAIL_SECURE = true;
    process.env.MAIL_USER = "username";
    process.env.MAIL_PASS = "password";

    const transport = getMailer();

    expect(transport.options.host).toEqual(process.env.MAIL_HOST);
    expect(transport.options.port).toEqual(process.env.MAIL_PORT);
    expect(transport.options.secure).toEqual(process.env.MAIL_SECURE);
    expect(transport.options.auth.user).toEqual(process.env.MAIL_USER);
    expect(transport.options.auth.pass).toEqual(process.env.MAIL_PASS);
  });
});

/**
 * ? GET MESSAGE
 */
describe('getMessage()', () => {

  test('should return an object with from, to, bcc, subject and html properties', () => {
    const data = {
      email: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML Body</p>'
    };

    const message = getMessage(data);

    assert.strictEqual(typeof message, 'object');
    assert.strictEqual(typeof message.from, 'string');
    assert.strictEqual(typeof message.to, 'string');
    assert.strictEqual(typeof message.bcc, 'string');
    assert.strictEqual(typeof message.subject, 'string');
    assert.strictEqual(typeof message.html, 'string');
  });

  test('should set the from property to the value of the MAIL_USER environment variable', () => {
    const data = {
      email: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML Body</p>'
    };

    process.env.MAIL_USER = 'test@example.org';
    const message = getMessage(data);

    assert.strictEqual(message.from, 'test@example.org');
  });
});

/**
 * ? GET PASSWORD
 */
describe('getPassword()', () => {

  test('returns a string', () => {
    const password = getPassword();

    assert.equal(typeof password, 'string');
  });

  test('returns a password with the correct length', () => {
    const length = 10;
    process.env.GENERATE_LENGTH = length;
    const password = getPassword();

    assert.equal(password.length, length);
  });

  test('returns a password without numbers if the numbers option is false', () => {
    process.env.GENERATE_NUMBERS = false;
    const password = getPassword();

    assert.ok(!/\d/.test(password));
  });

  test('returns a password without symbols if the symbols option is false', () => {
    process.env.GENERATE_SYMBOLS = false;
    const password = getPassword();

    assert.ok(!/[!@#$%^&*(),.?":{}|<>]/.test(password));
  });
});
