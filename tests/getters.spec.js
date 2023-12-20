//! ******************** GETTERS ********************

const { 
  getName, 
  getPosterName, 
  getMailer, 
  getMessage, 
  getPassword 
} = require("../src/getters");

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
 * ? GET NAME
 */
describe("getName()", () => {

  test("should remove accents, replace spaces with hyphens & convert everything to lowercase", () => {
    const input = "Rénée Joséphine ñoño";
    const expectedOutput = "renee-josephine-nono";
    const actualOutput = getName(input);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should return an empty string if the input is an empty string", () => {
    const input = "";
    const expectedOutput = "";
    const actualOutput = getName(input);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should handle an input string with no accents & no spaces", () => {
    const input = "foobar";
    const expectedOutput = "foobar";
    const actualOutput = getName(input);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });
});

/**
 * ? GET POSTER NAME
 */
describe("getPosterName()", () => {

  test("returns correct poster name with .jpg extension", () => {
    const name = "poster1";
    process.env.IMG_EXT = "jpg";

    expect(getPosterName(name)).toStrictEqual("poster1-01.jpg");
  });

  test("returns correct poster name with .png extension", () => {
    const name = "poster2";
    process.env.IMG_EXT = "png";

    expect(getPosterName(name)).toStrictEqual("poster2-01.png");
  });

  test("returns correct poster name with empty string extension", () => {
    const name = "poster3";
    process.env.IMG_EXT = "";

    expect(getPosterName(name)).toStrictEqual("poster3-01.");
  });

  test("returns a string with the name of the poster image", () => {
    const name = "poster";

    expect(getPosterName(name)).toBe(`${name}-01.${process.env.IMG_EXT}`);
  });
});

/**
 * ? GET MAILER
 */
describe("getMailer()", () => {

  test("should set the correct host, port, secure, user & pass from environment variables", () => {
    const transport = getMailer();

    expect(transport.options.host).toStrictEqual(process.env.MAIL_HOST);
    expect(transport.options.port).toStrictEqual(process.env.MAIL_PORT);
    expect(transport.options.secure).toStrictEqual(process.env.MAIL_SECURE);
    expect(transport.options.auth.user).toStrictEqual(process.env.MAIL_USER);
    expect(transport.options.auth.pass).toStrictEqual(process.env.MAIL_PASS);
  });
});

/**
 * ? GET MESSAGE
 */
describe("getMessage()", () => {

  test("returns an object with the expected properties", () => {
    const data = { email: "test@example.com", subject: "Test Subject", html: "<p>Test HTML</p>" };
    const result = getMessage(data);

    expect(result).toHaveProperty("from", process.env.MAIL_USER);
    expect(result).toHaveProperty("to", data.email);
    expect(result).toHaveProperty("bcc", process.env.MAIL_USER);
    expect(result).toHaveProperty("subject", data.subject);
    expect(result).toHaveProperty("html", data.html);
  });

  test("returns an object with default bcc when email is not provided", () => {
    const data = { subject: "Test Subject", html: "<p>Test HTML</p>" };
    const result = getMessage(data);

    expect(result).toHaveProperty("from", process.env.MAIL_USER);
    expect(result).toHaveProperty("to", undefined);
    expect(result).toHaveProperty("bcc", process.env.MAIL_USER);
    expect(result).toHaveProperty("subject", data.subject);
    expect(result).toHaveProperty("html", data.html);
  });
});

/**
 * ? GET PASSWORD
 */
describe("getPassword()", () => {

  test("returns a string", () => {
    const password = getPassword();

    expect(typeof password).toStrictEqual("string");
  });

  test("returns a password with the correct length", () => {
    const length = 10;
    process.env.GENERATE_LENGTH = length;
    const password = getPassword();

    expect(password.length).toStrictEqual(length);
  });

  test("returns a password without numbers if the numbers option is false", () => {
    process.env.GENERATE_NUMBERS = false;
    const password = getPassword();

    expect(!/\d/.test(password)).toStrictEqual(true);
  });

  test("returns a password without symbols if the symbols option is false", () => {
    process.env.GENERATE_SYMBOLS = false;
    const password = getPassword();

    expect(!/[!@#$%^&*(),.?":{}|<>]/.test(password)).toStrictEqual(true);
  });
});
