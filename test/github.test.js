import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRepoPath, summarizeRun } from "../src/github.js";

test("parseRepoPath accepts GitHub owner and repo svg route", () => {
  assert.deepEqual(parseRepoPath("/facebook/react.svg"), {
    owner: "facebook",
    repo: "react",
  });
  assert.deepEqual(parseRepoPath("/choihooo/hods.svg"), {
    owner: "choihooo",
    repo: "hods",
  });
});

test("parseRepoPath rejects non-svg and unsafe paths", () => {
  assert.equal(parseRepoPath("/facebook/react"), null);
  assert.equal(parseRepoPath("/../../x.svg"), null);
  assert.equal(parseRepoPath("/owner/repo/name.svg"), null);
});

test("summarizeRun maps completed success", () => {
  assert.equal(
    summarizeRun({
      status: "completed",
      conclusion: "success",
      name: "CI",
      updated_at: "2026-05-16T00:00:00Z",
    }).state,
    "success",
  );
});

test("summarizeRun maps active workflow as in progress", () => {
  assert.equal(
    summarizeRun({
      status: "in_progress",
      conclusion: null,
      name: "CI",
      updated_at: "2026-05-16T00:00:00Z",
    }).state,
    "in_progress",
  );
});

test("summarizeRun maps failed conclusion", () => {
  const summary = summarizeRun({
    status: "completed",
    conclusion: "failure",
    name: "Typecheck",
    updated_at: "2026-05-16T00:00:00Z",
  });

  assert.equal(summary.state, "failure");
  assert.match(summary.line2, /Typecheck/);
});
