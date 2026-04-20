const test = require("node:test");
const assert = require("node:assert/strict");

const bcrypt = require("bcryptjs");
const User = require("../src/models/userModel");
const { resetPassword } = require("../src/controllers/authController");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

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
