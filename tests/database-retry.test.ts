import assert from "node:assert/strict";
import test from "node:test";
import { isTransientDatabaseError, withDatabaseRetry } from "../lib/prisma";

test("retries transient Prisma database initialization errors", async () => {
  let attempts = 0;

  const result = await withDatabaseRetry(
    async () => {
      attempts += 1;
      if (attempts === 1) {
        const error = new Error("Can't reach database server at example:5432");
        error.name = "PrismaClientInitializationError";
        throw error;
      }
      return "ok";
    },
    { retries: 2, delayMs: 1 }
  );

  assert.equal(result, "ok");
  assert.equal(attempts, 2);
});

test("does not retry validation or application errors", async () => {
  let attempts = 0;

  await assert.rejects(
    () =>
      withDatabaseRetry(
        async () => {
          attempts += 1;
          throw new Error("invalid form");
        },
        { retries: 2, delayMs: 1 }
      ),
    /invalid form/
  );

  assert.equal(attempts, 1);
});

test("detects transient database connectivity errors", () => {
  const initializationError = new Error("Can't reach database server");
  initializationError.name = "PrismaClientInitializationError";

  assert.equal(isTransientDatabaseError(initializationError), true);
  assert.equal(isTransientDatabaseError(new Error("other")), false);
});
