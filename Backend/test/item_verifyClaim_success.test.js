const test = require("node:test");
const assert = require("node:assert/strict");

const LostFoundItem = require("../src/models/LostFoundItem");
const HandoverRecord = require("../src/models/HandoverRecord");
const { verifyClaim } = require("../src/controllers/uploadItemController");
const { createMockResponse, logRes, restoreMethods } = require("./testHelpers");

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
