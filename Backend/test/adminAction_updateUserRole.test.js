const test = require("node:test");
const assert = require("node:assert/strict");

const User = require("../src/models/userModel");
const { updateUserRole } = require("../src/controllers/adminActionsController");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

test("updateUserRole persists the requested role update", async () => {
  const originalMethods = {
    findByIdAndUpdate: User.findByIdAndUpdate,
  };

  let capturedArgs;
  User.findByIdAndUpdate = async (...args) => {
    capturedArgs = args;
    return {
      _id: "user-42",
      username: "Test User",
      role: "lf_admin",
    };
  };

  const req = {
    params: { id: "user-42" },
    body: { role: "lf_admin" },
  };
  const res = createMockResponse();

  await updateUserRole(req, res);

  logRes("adminActionsController.updateUserRole", res);

  assert.deepEqual(capturedArgs, [
    "user-42",
    { role: "lf_admin" },
    { new: true },
  ]);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.role, "lf_admin");

  restoreMethods(User, { findByIdAndUpdate: originalMethods.findByIdAndUpdate });
});
