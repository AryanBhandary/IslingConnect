const createMockResponse = () => {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return res;
};

const redactSensitive = (payload) => {
  if (!payload || typeof payload !== "object") return payload;
  if (Object.prototype.hasOwnProperty.call(payload, "token")) {
    return { ...payload, token: "<redacted>" };
  }
  return payload;
};

const logRes = (label, res) => {
  // Used for documentation evidence: prints what the controller returned.
  console.log(`[TEST OUTPUT] ${label}`, {
    statusCode: res.statusCode,
    body: redactSensitive(res.body),
  });
};

const restoreMethods = (target, originals) => {
  Object.entries(originals).forEach(([key, value]) => {
    target[key] = value;
  });
};

module.exports = {
  createMockResponse,
  logRes,
  restoreMethods,
};
