//! ******************** GETTERS ********************

const { 
  getArrayFromString, 
  getArrayWithUsername, 
  getName, 
  getPosterName, 
  getUniqueName, 
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
 * ? GET ARRAY FROM STRING
 */
describe("getArrayFromString()", () => {

  test("should split a string using comma as a delimiter", () => {
    const input = "a,b,c";
    const expected = ["a", "b", "c"];

    expect(getArrayFromString(input)).toStrictEqual(expected);
  });

  test("should remove the first element if it is an empty string", () => {
    const input = ",a,b,c";
    const expected = ["a", "b", "c"];

    expect(getArrayFromString(input)).toStrictEqual(expected);
  });

  test("should return an empty array if an empty string is passed", () => {
    const input = "";
    const expected = [];

    expect(getArrayFromString(input)).toStrictEqual(expected);
  });
});

/**
 * ? GET ARRAY WITH USERNAME
 */
describe("getArrayWithUsername()", () => {
  const inputArray = [
    { user: "1", text: "Hello" },
    { user: "2", text: "World" },
    { user: "4", text: "Goodbye" },
  ];

  const users = [
    { _id: "1", name: "Alice" },
    { _id: "2", name: "Bob" },
    { _id: "3", name: "Charlie" },
  ];

  const outputArray = getArrayWithUsername(inputArray, users);

  test("returns an empty array when given an empty array", () => {
    expect(getArrayWithUsername([], users)).toStrictEqual([]);
  });

  test("returns the original array when given an empty users array", () => {
    expect(getArrayWithUsername(inputArray, [])).toStrictEqual(inputArray);
  });

  test("returns a new array with updated user fields", () => {
    expect(outputArray).not.toBe(inputArray);
    expect(outputArray).toStrictEqual([
      { user: "Alice-1", text: "Hello" },
      { user: "Bob-2", text: "World" },
      { user: "4", text: "Goodbye" },
    ]);
  });

  test("appends the username to the user field for matching user IDs", () => {
    expect(outputArray[0].user).toStrictEqual("Alice-1");
    expect(outputArray[1].user).toStrictEqual("Bob-2");
  });

  test("does not append the username to the user field for non-matching user IDs", () => {
    expect(outputArray[2].user).toStrictEqual("4");
  });
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
 * ? GET UNIQUE NAME
 */
describe("getUniqueName()", () => {

  test("should append timestamp to the given name", () => {
    const name = "test";
    const uniqueName = getUniqueName(name);
    const timestamp = Date.now();

    expect(uniqueName).toMatch(new RegExp(`${name}-${timestamp}$`));
  });

  test("should return a string", () => {
    const uniqueName = getUniqueName("test");

    expect(typeof uniqueName).toStrictEqual("string");
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
