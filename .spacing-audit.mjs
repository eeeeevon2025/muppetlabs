// Spacing audit script — run via: npx @framer/agent@latest exec -s 1 < .spacing-audit.mjs

await framer.agent.switchBranch("ab6b1aowl");

const RECRUITER_PAGES = new Set([
  "/",
  "/org-impact",
  "/contact",
  "/about",
  "/work",
  "/recruiter-brief",
  "/hiring-mgr-brief",
  "/founder-brief",
]);

function parsePxValues(str) {
  if (!str || typeof str !== "string") return [];
  return [...str.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map((m) => parseFloat(m[1]));
}

function isOnScale(px) {
  if (px === 0) return true;
  // border hairlines only — not spacing
  if ([0.5, 1, 1.5, 2].includes(Math.abs(px))) return true;
  const rem = Math.abs(px % 8);
  return rem < 0.01 || rem > 7.99;
}

function getBreakpoint(id = "") {
  if (id.startsWith("h8Q9sPSCd")) return "phone";
  if (id.startsWith("Z1LpPdvW7")) return "tablet";
  return "desktop";
}

function walk(node, pagePath, findings) {
  if (!node) return;
  const attrs = node.attributes || {};
  const bp = getBreakpoint(node.id || "");
  for (const field of [
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "gap",
    "margin",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
  ]) {
    const val = attrs[field];
    if (!val) continue;
    for (const px of parsePxValues(String(val))) {
      if (!isOnScale(px)) {
        findings.push({
          page: pagePath,
          breakpoint: bp,
          nodeId: node.id,
          name: node.name,
          field,
          value: val,
          offValue: px,
          nearest: Math.round(px / 8) * 8,
        });
      }
    }
  }
  for (const c of node.children || []) walk(c, pagePath, findings);
}

const webPages = await framer.agent.getNodesOfTypes({ types: ["WebPageNode"] }, {});
const allFindings = [];

for (const page of webPages) {
  const pagePath = page.name?.startsWith("/") ? page.name : `/${page.name}`;
  try {
    const root = await framer.agent.serialize({ id: page.id, depth: 14 }, { pagePath });
    walk(root, pagePath, allFindings);
  } catch (e) {
    console.error("FAIL", pagePath, e.message);
  }
}

// dedupe
const seen = new Set();
const unique = allFindings.filter((f) => {
  const k = `${f.page}|${f.breakpoint}|${f.nodeId}|${f.field}|${f.offValue}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

// aggregate
const byValue = {};
const byBp = { desktop: 0, tablet: 0, phone: 0 };
const byPage = {};

for (const f of unique) {
  byValue[f.offValue] = byValue[f.offValue] || [];
  byValue[f.offValue].push(f);
  byBp[f.breakpoint] = (byBp[f.breakpoint] || 0) + 1;
  byPage[f.page] = (byPage[f.page] || 0) + 1;
}

const recruiterFindings = unique.filter((f) => RECRUITER_PAGES.has(f.page));
const briefFindings = unique.filter((f) => /brief/i.test(f.name || ""));

console.log(JSON.stringify({
  branch: "brief-spacing-normalize (ab6b1aowl)",
  totalOffScale: unique.length,
  pagesScanned: webPages.length,
  byBreakpoint: byBp,
  offScaleValues: Object.keys(byValue).map(Number).sort((a, b) => a - b),
  topPages: Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 15),
  recruiterTotal: recruiterFindings.length,
  briefTotal: briefFindings.length,
  briefFindings,
  byValueSummary: Object.fromEntries(
    Object.keys(byValue)
      .map(Number)
      .sort((a, b) => a - b)
      .map((v) => [
        v,
        {
          count: byValue[v].length,
          samples: byValue[v].slice(0, 5).map((f) => ({
            page: f.page,
            bp: f.breakpoint,
            name: f.name,
            field: f.field,
            value: f.value,
            nearest: f.nearest,
          })),
        },
      ])
  ),
  recruiterByValue: Object.fromEntries(
    [...new Set(recruiterFindings.map((f) => f.offValue))]
      .sort((a, b) => a - b)
      .map((v) => [v, recruiterFindings.filter((f) => f.offValue === v).length])
  ),
}, null, 2));
