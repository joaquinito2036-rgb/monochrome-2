import test from "node:test";
import assert from "node:assert/strict";
import { hasReusableLicense, validateAdminManifest } from "../src/catalog.mjs";

test("accepts reusable Archive licenses", () => {
  assert.equal(hasReusableLicense({ licenseurl: "https://creativecommons.org/licenses/by/4.0/" }), true);
  assert.equal(hasReusableLicense({ licenseurl: "all rights reserved" }), false);
});

test("creates an unapproved RuTracker manifest", () => {
  const item = validateAdminManifest({
    provider: "rutracker",
    title: "Authorized recording",
    sourceUrl: "https://rutracker.org/example",
    rightsBasis: "Owned by uploader with distribution permission"
  });
  assert.equal(item.provider, "rutracker_manifest");
  assert.equal(item.approved, false);
});
