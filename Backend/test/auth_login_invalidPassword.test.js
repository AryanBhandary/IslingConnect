const test = require("node:test");
const assert = require("node:assert/strict");

const bcrypt = require("bcryptjs");
const User = require("../src/models/userModel");
const { login } = require("../src/controllers/authController");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

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
