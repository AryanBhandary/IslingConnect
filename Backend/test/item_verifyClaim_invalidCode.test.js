const test = require("node:test");
const assert = require("node:assert/strict");

const LostFoundItem = require("../src/models/LostFoundItem");
const { verifyClaim } = require("../src/controllers/uploadItemController");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

test("verifyClaim rejects an invalid reclaim code", async () => {
  const originalMethods = {
    findById: LostFoundItem.findById,
  };

  LostFoundItem.findById = async () => ({
    _id: "item-1",
    user: { toString: () => "owner-1" },
    claimCode: "ABCD1234",
    status: "pending",
  });

  const req = {
    body: {
      itemId: "item-1",
      claimCode: "WRONG999",
    },
    user: { id: "claimer-1" },
  };
  const res = createMockResponse();

  await verifyClaim(req, res);

  logRes("uploadItemController.verifyClaim - invalid", res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: "Invalid claim code" });

  restoreMethods(LostFoundItem, { findById: originalMethods.findById });
});
