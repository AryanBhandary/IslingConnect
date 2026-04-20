const test = require("node:test");
const assert = require("node:assert/strict");

const bcrypt = require("bcryptjs");
const User = require("../src/models/userModel");
const { login } = require("../src/controllers/authController");
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
