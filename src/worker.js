import { fetchLatestRun, parseRepoPath } from "./github.js";
import { renderSvg } from "./render-svg.js";

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
};

export async function handleRequest(request, env = {}, ctx = {}) {
  const url = new URL(request.url);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    return new Response(readme(), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  }

  const repo = parseRepoPath(url.pathname);
  if (!repo) {
    return new Response("Use /:owner/:repo.svg", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const summary = await fetchLatestRun({
    ...repo,
    token: env.GITHUB_TOKEN,
    fetchImpl: env.fetchImpl,
  });

  const svg = renderSvg({
    ...repo,
    summary,
    theme: url.searchParams.get("theme") === "dark" ? "dark" : "light",
  });

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": cacheControl(summary.state),
    },
  });
}

function cacheControl(state) {
  switch (state) {
    case "success":
      return "public, max-age=300, s-maxage=300";
    case "failure":
      return "public, max-age=120, s-maxage=120";
    case "in_progress":
      return "public, max-age=30, s-maxage=30";
    default:
      return "public, max-age=60, s-maxage=60";
  }
}

function readme() {
  return `Build Failure Theater

Animated SVG README widget for GitHub Actions drama.

Usage:
![Build Failure Theater](https://build-failure-theater.hozorica.com/owner/repo.svg)
`;
}
