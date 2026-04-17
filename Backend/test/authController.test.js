const test = require("node:test");
const assert = require("node:assert/strict");

const bcrypt = require("bcryptjs");
const User = require("../src/models/userModel");
const { login, resetPassword } = require("../src/controllers/authController");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

test("login authenticates successfully with a valid password", async () => {
  const originalMethods = {
    findOne: User.findOne,
    compare: bcrypt.compare,
  };

  User.findOne = async ({ email }) => ({
    _id: "user-1",
    username: "Aryan",
    email,
    phone: "9800000000",
    password: "stored-hash",
    role: "user",
  });
  bcrypt.compare = async (password, hash) => password === "correct-password" && hash === "stored-hash";

  process.env.JWT_SECRET = "test-secret";

  const req = {
    body: {
      email: "student@islingtoncollege.edu.np",
      password: "correct-password",
    },
  };
  const res = createMockResponse();

  await login(req, res);

  logRes("authController.login - valid password", res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.role, "user");
  assert.ok(res.body.token, "expected a JWT token in the response");

  restoreMethods(User, { findOne: originalMethods.findOne });
  restoreMethods(bcrypt, { compare: originalMethods.compare });
});

test("login rejects an invalid password", async () => {
  const originalMethods = {
    findOne: User.findOne,
    compare: bcrypt.compare,
  };

  User.findOne = async () => ({
    _id: "user-1",
    username: "Aryan",
    email: "student@islingtoncollege.edu.np",
    phone: "9800000000",
    password: "stored-hash",
    role: "user",
  });
  bcrypt.compare = async () => false;

  const req = {
    body: {
      email: "student@islingtoncollege.edu.np",
      password: "wrong-password",
    },
  };
  const res = createMockResponse();

  await login(req, res);

  logRes("authController.login - invalid password", res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: "Incorrect password" });

  restoreMethods(User, { findOne: originalMethods.findOne });
  restoreMethods(bcrypt, { compare: originalMethods.compare });
});

test("resetPassword hashes and saves the new password after verification", async () => {
  const originalMethods = {
    findOne: User.findOne,
    compare: bcrypt.compare,
    hash: bcrypt.hash,
  };

  let savedPassword;
  const userDoc = {
    email: "student@islingtoncollege.edu.np",
    password: "old-hash",
    async save() {
      savedPassword = this.password;
    },
  };

  User.findOne = async () => userDoc;
  bcrypt.compare = async (input, stored) => input === "old-password" && stored === "old-hash";
  bcrypt.hash = async (input, rounds) => {
    assert.equal(input, "new-password");
    assert.equal(rounds, 10);
    return "new-password-hash";
  };

  const req = {
    body: {
      email: "student@islingtoncollege.edu.np",
      oldPassword: "old-password",
      newPassword: "new-password",
      confirmPassword: "new-password",
    },
  };
  const res = createMockResponse();

  await resetPassword(req, res);

  logRes("authController.resetPassword - success", res);

  assert.equal(res.statusCode, 200);
  assert.equal(savedPassword, "new-password-hash");
  assert.deepEqual(res.body, { message: "Password updated successfully" });

  restoreMethods(User, { findOne: originalMethods.findOne });
  restoreMethods(bcrypt, {
    compare: originalMethods.compare,
    hash: originalMethods.hash,
  });
});
