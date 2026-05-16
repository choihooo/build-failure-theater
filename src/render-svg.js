const THEMES = {
  light: {
    bg: "#f8fafc",
    stage: "#e2e8f0",
    border: "#0f172a",
    text: "#0f172a",
    muted: "#475569",
    actorA: "#2563eb",
    actorB: "#dc2626",
    bubble: "#ffffff",
  },
  dark: {
    bg: "#020617",
    stage: "#0f172a",
    border: "#38bdf8",
    text: "#e2e8f0",
    muted: "#94a3b8",
    actorA: "#38bdf8",
    actorB: "#fb7185",
    bubble: "#111827",
  },
};

const STATE_LABEL = {
  success: "success",
  failure: "failure",
  in_progress: "running",
  unknown: "unknown",
};

export function renderSvg({ owner, repo, summary, theme = "light" }) {
  const colors = THEMES[theme] ?? THEMES.light;
  const state = summary.state ?? "unknown";
  const repoLabel = `${owner}/${repo}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="180" viewBox="0 0 640 180" role="img" aria-labelledby="title desc">
  <title id="title">Build Failure Theater for ${escapeXml(repoLabel)}</title>
  <desc id="desc">${escapeXml(summary.line1)} ${escapeXml(summary.line2)}</desc>
  <style>
    .title { font: 700 18px ui-monospace, SFMono-Regular, Menlo, monospace; fill: ${colors.text}; }
    .meta { font: 500 12px ui-monospace, SFMono-Regular, Menlo, monospace; fill: ${colors.muted}; }
    .dialog { font: 700 15px ui-sans-serif, system-ui, sans-serif; fill: ${colors.text}; }
    .small { font: 600 11px ui-monospace, SFMono-Regular, Menlo, monospace; fill: ${colors.muted}; }
    .actor-a { animation: bobA 1.8s ease-in-out infinite; transform-origin: 135px 125px; }
    .actor-b { animation: bobB 1.6s ease-in-out infinite; transform-origin: 505px 125px; }
    .bubble-a { animation: talkA 4s ease-in-out infinite; transform-origin: 250px 74px; }
    .bubble-b { animation: talkB 4s ease-in-out infinite; transform-origin: 398px 111px; }
    .curtain { animation: curtain 3.5s ease-in-out infinite; }
    @keyframes bobA { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes bobB { 0%, 100% { transform: translateY(-3px); } 50% { transform: translateY(2px); } }
    @keyframes talkA { 0%, 45%, 100% { opacity: 1; transform: scale(1); } 60%, 90% { opacity: .75; transform: scale(.98); } }
    @keyframes talkB { 0%, 35%, 100% { opacity: .75; transform: scale(.98); } 55%, 85% { opacity: 1; transform: scale(1); } }
    @keyframes curtain { 0%, 100% { opacity: .35; } 50% { opacity: .6; } }
    @media (prefers-reduced-motion: reduce) {
      .actor-a, .actor-b, .bubble-a, .bubble-b, .curtain { animation: none; }
    }
  </style>

  <rect width="640" height="180" rx="16" fill="${colors.bg}" />
  <rect x="8" y="8" width="624" height="164" rx="13" fill="none" stroke="${colors.border}" stroke-opacity=".24" />
  <path class="curtain" d="M20 28 C90 58 140 18 205 42 L205 158 L20 158 Z" fill="${colors.actorB}" opacity=".22" />
  <path class="curtain" d="M620 28 C550 58 500 18 435 42 L435 158 L620 158 Z" fill="${colors.actorA}" opacity=".18" />

  <text x="28" y="34" class="title">Build Failure Theater</text>
  <text x="28" y="54" class="meta">${escapeXml(repoLabel)} · ${escapeXml(STATE_LABEL[state] ?? state)}</text>

  <rect x="70" y="132" width="500" height="16" rx="8" fill="${colors.stage}" />
  <ellipse cx="320" cy="150" rx="240" ry="13" fill="${colors.border}" opacity=".08" />

  <g class="bubble-a">
    <rect x="206" y="61" width="250" height="38" rx="12" fill="${colors.bubble}" stroke="${colors.border}" stroke-opacity=".18" />
    <path d="M224 96 L204 113 L238 99 Z" fill="${colors.bubble}" stroke="${colors.border}" stroke-opacity=".18" />
    <text x="224" y="85" class="dialog">${escapeXml(truncate(summary.line1, 34))}</text>
  </g>

  <g class="bubble-b">
    <rect x="268" y="106" width="270" height="38" rx="12" fill="${colors.bubble}" stroke="${colors.border}" stroke-opacity=".18" />
    <path d="M512 141 L538 158 L495 144 Z" fill="${colors.bubble}" stroke="${colors.border}" stroke-opacity=".18" />
    <text x="286" y="130" class="dialog">${escapeXml(truncate(summary.line2, 36))}</text>
  </g>

  <g class="actor-a">
    <circle cx="135" cy="114" r="24" fill="${colors.actorA}" />
    <circle cx="126" cy="108" r="3" fill="${colors.bg}" />
    <circle cx="144" cy="108" r="3" fill="${colors.bg}" />
    <path d="M126 122 Q135 129 145 122" fill="none" stroke="${colors.bg}" stroke-width="3" stroke-linecap="round" />
    <rect x="111" y="134" width="48" height="14" rx="7" fill="${colors.actorA}" />
  </g>

  <g class="actor-b">
    <circle cx="505" cy="114" r="24" fill="${colors.actorB}" />
    <circle cx="496" cy="108" r="3" fill="${colors.bg}" />
    <circle cx="514" cy="108" r="3" fill="${colors.bg}" />
    <path d="M496 123 Q505 116 515 123" fill="none" stroke="${colors.bg}" stroke-width="3" stroke-linecap="round" />
    <rect x="481" y="134" width="48" height="14" rx="7" fill="${colors.actorB}" />
  </g>

  <text x="28" y="158" class="small">latest workflow${summary.workflow ? `: ${escapeXml(truncate(summary.workflow, 44))}` : ""}</text>
</svg>`;
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function truncate(value, max) {
  const text = String(value ?? "");
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}
