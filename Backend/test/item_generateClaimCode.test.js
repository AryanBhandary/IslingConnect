const test = require("node:test");
const assert = require("node:assert/strict");

const crypto = require("crypto");
const LostFoundItem = require("../src/models/LostFoundItem");
const { generateClaimCode } = require("../src/controllers/uploadItemController");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

test("generateClaimCode stores an uppercase claim code and marks the item pending", async () => {
  const originalMethods = {
    findOne: LostFoundItem.findOne,
    randomBytes: crypto.randomBytes,
  };

  const item = {
    _id: "item-1",
    user: "owner-1",
    status: "active",
    claimCode: null,
    async save() {
      return this;
    },
  };

  LostFoundItem.findOne = async ({ _id, user }) => {
    assert.equal(_id, "item-1");
    assert.equal(user, "owner-1");
    return item;
  };
  crypto.randomBytes = () => Buffer.from("abcd1234", "hex");

  const req = {
    params: { itemId: "item-1" },
    user: { id: "owner-1" },
  };
  const res = createMockResponse();

  await generateClaimCode(req, res);

  logRes("uploadItemController.generateClaimCode", res);

  assert.equal(res.statusCode, 200);
  assert.equal(item.status, "pending");
  assert.equal(item.claimCode, "ABCD1234");
  assert.deepEqual(res.body, {
    claimCode: "ABCD1234",
    message: "Claim code generated",
  });

  restoreMethods(LostFoundItem, { findOne: originalMethods.findOne });
  restoreMethods(crypto, { randomBytes: originalMethods.randomBytes });
});
