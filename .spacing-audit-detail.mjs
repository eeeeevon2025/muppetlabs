await framer.agent.switchBranch("ab6b1aowl");

function parsePx(str) {
  return [...String(str || "").matchAll(/(-?\d+(?:\.\d+)?)px/g)].map((m) => Math.round(parseFloat(m[1])));
}
function isOnScale(px) {
  if (px === 0) return true;
  if ([1, 2].includes(Math.abs(px))) return true;
  const r = Math.abs(px % 8);
  return r < 0.05 || r > 7.95;
}

async function auditPage(pageId, pagePath, bpRoots) {
  const findings = [];
  const root = await framer.agent.serialize({ id: pageId, depth: 18 }, { pagePath });

  function detectBp(node, ancestors = []) {
    const chain = [...ancestors, node?.id || ""];
    for (const [bp, ids] of Object.entries(bpRoots)) {
      if (chain.some((id) => ids.includes(id))) return bp;
    }
    const id = node?.id || "";
    if (id.startsWith("h8Q9sPSCd")) return "phone";
    if (id.startsWith("Z1LpPdvW7")) return "tablet";
    return "desktop";
  }

  function walk(node, ancestors = []) {
    if (!node) return;
    const bp = detectBp(node, ancestors);
    const attrs = node.attributes || {};
    for (const field of ["padding", "gap"]) {
      const val = attrs[field];
      if (!val) continue;
      for (const px of parsePx(val)) {
        if (!isOnScale(px)) {
          findings.push({
            page: pagePath,
            bp,
            name: node.name,
            field,
            value: val,
            off: px,
            nearest: Math.round(px / 8) * 8,
          });
        }
      }
    }
    for (const c of node.children || []) walk(c, [...ancestors, node.id]);
  }
  walk(root);
  return findings;
}

const BP = {
  desktop: ["t0tWztdth", "WQLkyLRf1"],
  tablet: ["dFXzsIo35", "OtBY7c280", "Z1LpPdvW7"],
  phone: ["YCm9xDg6y", "lR10pCW9a", "h8Q9sPSCd"],
};

function summarize(findings) {
  const seen = new Set();
  const unique = findings.filter((f) => {
    const k = JSON.stringify(f);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const byBp = { desktop: 0, tablet: 0, phone: 0 };
  const byVal = {};
  for (const f of unique) {
    byBp[f.bp] = (byBp[f.bp] || 0) + 1;
    byVal[f.off] = (byVal[f.off] || 0) + 1;
  }
  return { total: unique.length, byBp, byVal, unique };
}

const org = summarize(await auditPage("e1TtEv4VN", "/org-impact", BP));
const contact = summarize(await auditPage("mOJId0UL3", "/contact", BP));
const about = summarize(await auditPage("cEzk5uYJv", "/about", BP));

const orgPri = org.unique.filter((f) =>
  /hero|brief|impact|stat|section|cta|contact|header|wrapper|layout|org|testimonial|black|card|proof/i.test(f.name || "")
);

const contactAll = contact.unique;

// black section variants
async function auditNode(id, label) {
  const node = await framer.agent.serialize({ id, depth: 8 }, { pagePath: "/" });
  const out = [];
  function walk(n, bp = "desktop") {
    if (!n) return;
    const nid = n.id || "";
    if (nid.startsWith("h8Q9sPSCd")) bp = "phone";
    else if (nid.startsWith("Z1LpPdvW7")) bp = "tablet";
    const attrs = n.attributes || {};
    for (const field of ["padding", "gap"]) {
      const val = attrs[field];
      if (!val) continue;
      for (const px of parsePx(val)) {
        if (!isOnScale(px)) out.push({ label, bp, name: n.name, field, value: val, off: px, nearest: Math.round(px / 8) * 8 });
      }
    }
    for (const c of n.children || []) walk(c, bp);
  }
  walk(node);
  return out;
}

const blackIds = ["JQa936RwT", "Z1LpPdvW7JQa936RwT", "h8Q9sPSCdJQa936RwT"];
const black = [];
for (const id of blackIds) {
  try {
    black.push(...(await auditNode(id, id)));
  } catch (e) {}
}

console.log(
  JSON.stringify(
    {
      orgImpact: { ...org, prioritySamples: orgPri.slice(0, 30) },
      contact: contactAll,
      about: { total: about.total, byBp: about.byBp, byVal: about.byVal, samples: about.unique.slice(0, 20) },
      blackSection: black,
    },
    null,
    2
  )
);
