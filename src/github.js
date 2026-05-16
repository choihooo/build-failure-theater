const GITHUB_API = "https://api.github.com";

export function parseRepoPath(pathname) {
  const match = pathname.match(/^\/([^/]+)\/([^/.]+(?:\.[^/.]+)*)\.svg$/);
  if (!match) return null;

  const [, owner, repo] = match;
  const safe = /^[A-Za-z0-9_.-]+$/;
  if (!safe.test(owner) || !safe.test(repo)) return null;

  return { owner, repo };
}

export function summarizeRun(run) {
  if (!run) {
    return {
      state: "unknown",
      line1: "No stage found.",
      line2: "Actions may be disabled.",
    };
  }

  if (run.status && run.status !== "completed") {
    return {
      state: "in_progress",
      line1: "The build is on stage.",
      line2: "Hold the curtain.",
      workflow: run.name,
      updatedAt: run.updated_at,
    };
  }

  if (run.conclusion === "success") {
    return {
      state: "success",
      line1: "No drama today.",
      line2: "Ship it.",
      workflow: run.name,
      updatedAt: run.updated_at,
    };
  }

  if (run.conclusion) {
    return {
      state: "failure",
      line1: "Act I: Build failed.",
      line2: failureLine(run.conclusion, run.name),
      workflow: run.name,
      updatedAt: run.updated_at,
    };
  }

  return {
    state: "unknown",
    line1: "The script went missing.",
    line2: "GitHub returned no conclusion.",
    workflow: run.name,
    updatedAt: run.updated_at,
  };
}

export async function fetchLatestRun({ owner, repo, token, fetchImpl = fetch }) {
  const response = await fetchImpl(
    `${GITHUB_API}/repos/${owner}/${repo}/actions/runs?per_page=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "build-failure-theater",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!response.ok) {
    return {
      state: "unknown",
      line1: "No stage access.",
      line2: `GitHub returned ${response.status}.`,
    };
  }

  const data = await response.json();
  return summarizeRun(data.workflow_runs?.[0]);
}

function failureLine(conclusion, workflowName) {
  const label = workflowName ? truncate(workflowName, 22) : "CI";

  switch (conclusion) {
    case "cancelled":
      return `${label} left early.`;
    case "timed_out":
      return `${label} missed the cue.`;
    case "skipped":
      return `${label} skipped the scene.`;
    case "action_required":
      return `${label} needs a human.`;
    default:
      return `${label} entered angry.`;
  }
}

function truncate(value, max) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}
