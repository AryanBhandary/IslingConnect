const test = require("node:test");
const assert = require("node:assert/strict");

const crypto = require("crypto");
const LostFoundItem = require("../src/models/LostFoundItem");
const HandoverRecord = require("../src/models/HandoverRecord");
const {
  generateClaimCode,
  verifyClaim,
} = require("../src/controllers/uploadItemController");
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

test("verifyClaim accepts a valid reclaim code and records the handover", async () => {
  const originalMethods = {
    findById: LostFoundItem.findById,
    save: HandoverRecord.prototype.save,
  };

  let handoverSaved = false;
  const item = {
    _id: "item-1",
    itemName: "Wallet",
    user: { toString: () => "owner-1" },
    claimCode: "ABCD1234",
    status: "pending",
    reclaimer: null,
    async save() {
      return this;
    },
  };

  LostFoundItem.findById = async (id) => {
    assert.equal(id, "item-1");
    return item;
  };
  HandoverRecord.prototype.save = async function saveRecord() {
    handoverSaved = true;
    assert.equal(this.itemName, "Wallet");
  };

  const req = {
    body: {
      itemId: "item-1",
      claimCode: "ABCD1234",
    },
    user: { id: "claimer-1" },
  };
  const res = createMockResponse();

  await verifyClaim(req, res);

  logRes("uploadItemController.verifyClaim - valid", res);

  assert.equal(res.statusCode, 200);
  assert.equal(item.status, "returned");
  assert.equal(item.reclaimer, "claimer-1");
  assert.equal(item.claimCode, null);
  assert.equal(handoverSaved, true);

  restoreMethods(LostFoundItem, { findById: originalMethods.findById });
  restoreMethods(HandoverRecord.prototype, { save: originalMethods.save });
});

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
