import assert from "node:assert/strict";
import { test } from "node:test";
import { renderSvg } from "../src/render-svg.js";

test("renderSvg returns an animated svg document", () => {
  const svg = renderSvg({
    owner: "choihooo",
    repo: "hods",
    summary: {
      state: "failure",
      line1: "Act I: Build failed.",
      line2: "TypeScript entered angry.",
      workflow: "CI",
    },
  });

  assert.match(svg, /^<\?xml/);
  assert.match(svg, /<svg/);
  assert.match(svg, /@keyframes bobA/);
  assert.match(svg, /choihooo\/hods/);
  assert.match(svg, /TypeScript entered angry/);
});

test("renderSvg escapes XML text", () => {
  const svg = renderSvg({
    owner: "a",
    repo: "b",
    summary: {
      state: "failure",
      line1: "bad <xml>",
      line2: "quote \" amp &",
    },
  });

  assert.match(svg, /bad &lt;xml&gt;/);
  assert.match(svg, /quote &quot; amp &amp;/);
});
