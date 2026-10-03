await framer.agent.switchBranch("ab6b1aowl");

const RECRUITER_PAGES = [
  { id: "augiA20Il", path: "/" },
  { id: "e1TtEv4VN", path: "/org-impact" },
  { id: "mOJId0UL3", path: "/contact" },
  { id: "cEzk5uYJv", path: "/about" },
  { id: "Z3XKzkTzs", path: "/work" },
  { id: "A_fyvdXPQ", path: "/recruiter-brief" },
  { id: "QeveHTCVz", path: "/hiring-mgr-brief" },
  { id: "cEBj6qwKd", path: "/founder-brief" },
];

const SPACING_FIELDS = ["padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap"];

function parsePxValues(str) {
  if (!str || typeof str !== "string") return [];
  return [...str.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map((m) => parseFloat(m[1]));
}

function isIntegerPx(px) {
  return Math.abs(px - Math.round(px)) < 0.05;
}

function isOnScale(px) {
  if (px === 0) return true;
  if ([1, 2].includes(Math.abs(Math.round(px)))) return true; // border hairlines in shorthand
  const rem = Math.abs(px % 8);
  return rem < 0.05 || rem > 7.95;
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
  for (const field of SPACING_FIELDS) {
    const val = attrs[field];
    if (!val) continue;
    for (const px of parsePxValues(String(val))) {
      if (!isIntegerPx(px)) continue;
      if (!isOnScale(px)) {
        findings.push({
          page: pagePath,
          breakpoint: bp,
          nodeId: node.id,
          name: node.name,
          field,
          value: val,
          offValue: Math.round(px),
          nearest: Math.round(px / 8) * 8,
        });
      }
    }
  }
  for (const c of node.children || []) walk(c, pagePath, findings);
}

function dedupe(findings) {
  const seen = new Set();
  return findings.filter((f) => {
    const k = `${f.page}|${f.breakpoint}|${f.nodeId}|${f.field}|${f.offValue}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const all = [];
for (const page of RECRUITER_PAGES) {
  const root = await framer.agent.serialize({ id: page.id, depth: 18 }, { pagePath: page.path });
  walk(root, page.path, all);
}

const unique = dedupe(all);
const byBp = { desktop: 0, tablet: 0, phone: 0 };
for (const f of unique) byBp[f.breakpoint]++;

const byValue = {};
for (const f of unique) {
  byValue[f.offValue] = byValue[f.offValue] || [];
  byValue[f.offValue].push(f);
}

const brief = unique.filter((f) => /brief/i.test(f.name || ""));
const sectionPriority = unique.filter((f) =>
  /brief|hero|recruiter|contact|org|impact|cta|testimonial|nav|footer|wrapper|layout|section|black/i.test(f.name || "")
);

console.log(
  JSON.stringify(
    {
      branch: "brief-spacing-normalize",
      scale: "8px increments (8, 16, 24, 32, 40, 64…)",
      recruiterPages: RECRUITER_PAGES.map((p) => p.path),
      totalOffScale: unique.length,
      byBreakpoint: byBp,
      commonOffValues: Object.keys(byValue)
        .map(Number)
        .sort((a, b) => a - b)
        .map((v) => ({ px: v, count: byValue[v].length })),
      briefSection: brief,
      prioritySections: sectionPriority.slice(0, 60),
      allByPage: Object.fromEntries(
        RECRUITER_PAGES.map((p) => [
          p.path,
          {
            total: unique.filter((f) => f.page === p.path).length,
            byBp: ["desktop", "tablet", "phone"].map((bp) => ({
              bp,
              count: unique.filter((f) => f.page === p.path && f.breakpoint === bp).length,
            })),
            topIssues: Object.entries(
              unique
                .filter((f) => f.page === p.path)
                .reduce((acc, f) => {
                  acc[f.offValue] = (acc[f.offValue] || 0) + 1;
                  return acc;
                }, {})
            )
              .map(([px, count]) => ({ px: Number(px), count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 8),
          },
        ])
      ),
    },
    null,
    2
  )
);
