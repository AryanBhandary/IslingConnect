const test = require("node:test");
const assert = require("node:assert/strict");

const jwt = require("jsonwebtoken");
const verifyToken = require("../src/middlewares/authMiddleware");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

test("verifyToken blocks a non-admin token on an admin-only route", () => {
  const originalMethods = {
    verify: jwt.verify,
  };

  jwt.verify = () => ({
    id: "user-1",
    role: "user",
    email: "student@islingtoncollege.edu.np",
  });

  const req = {
    headers: {
      authorization: "Bearer valid-user-token",
    },
  };
  const res = createMockResponse();

  let nextCalled = false;
  verifyToken(["admin"])(req, res, () => {
    nextCalled = true;
  });

  logRes("authMiddleware.verifyToken - admin denied", res);

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { message: "Access Denied" });

  restoreMethods(jwt, { verify: originalMethods.verify });
});
