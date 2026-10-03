// =============================================================
// Advanced — legacy escape hatch. Build / Test / Deploy / Manage Automations
// =============================================================

const Advanced = ({ subtab, setSubtab }) => {
  const tabs = [
    { id: "build",       label: "Build",                  icon: "chat" },
    { id: "test",        label: "Test",                   icon: "flask" },
    { id: "deploy",      label: "Deploy",                 icon: "rocket" },
    { id: "automations", label: "Manage Automations",     icon: "bolt" },
    { id: "settings",    label: "Settings (legacy)",      icon: "cog" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ padding: "26px 36px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{
            fontFamily: "var(--font-sans)", fontWeight: 700,
            fontSize: "var(--text-h1)", lineHeight: "var(--leading-h1)",
            letterSpacing: "-0.01em", color: T.ink, margin: 0,
          }}>Advanced</h1>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            padding: "2px 8px", borderRadius: 999,
            background: "rgba(31,42,46,0.08)", color: T.ink3,
          }}>LEGACY</span>
        </div>
        <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "10px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
          The tool-first surface, preserved for customers with existing automations.
          New work should happen in Goals.
        </p>
      </div>
      <TabBar tabs={tabs} active={subtab} onChange={setSubtab}/>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 36px 60px" }}>
        {subtab === "build"       && <AdvBuild/>}
        {subtab === "test"        && <AdvTest/>}
        {subtab === "deploy"      && <AdvDeploy/>}
        {subtab === "automations" && <AdvAutomations/>}
        {subtab === "settings"    && <AdvSettings/>}
      </div>
    </div>
  );
};

const AdvBuild = () => {
  const teams = [
    { name: "Roadside Assistant",         status: "Not Deployed", modified: "Mar 11" },
    { name: "Aditya's Customer Support Team", status: "Inactive", modified: "Mar 11" },
    { name: "People Operations Team",     status: "Inactive",     modified: "Mar 11" },
    { name: "E commerce Support",         status: "Inactive",     modified: "Mar 11" },
    { name: "KL Test Team",               status: "Not Deployed", modified: "Mar 11" },
    { name: "2Test",                      status: "Not Deployed", modified: "Mar 11" },
    { name: "Airport Assistant",          status: "Not Deployed", modified: "Mar 11" },
  ];
  return (
    <div>
      <ResHeader title="AI Agents for Customers"
        sub="Manage AI Agent Teams. Access AI Agent Teams to see how they're performing."
        action={<Btn kind="ink" icon="plus" size="sm">Add Team</Btn>}/>
      <Card padding={0} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bgSoft }}>
              {["Team Name","Status","Modified",""].map((h, i) => (
                <th key={i} style={{ padding: "10px 18px", borderBottom: `1px solid ${T.rule}`, textAlign: "left", fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((t, i) => (
              <tr key={i}>
                <td style={tdSt}><span style={{ color: T.blue, fontWeight: 600 }}>{t.name}</span></td>
                <td style={tdSt}>
                  <Chip tone={t.status === "Not Deployed" ? "default" : "default"}>{t.status}</Chip>
                </td>
                <td style={tdSt}>{t.modified}</td>
                <td style={tdSt}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={iconBtnSm} title="Edit"><Icon name="edit" size={12} strokeWidth={1.9}/></button>
                    <button style={iconBtnSm} title="More"><Icon name="moreV" size={12} strokeWidth={2}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdvTest = () => (
  <div>
    <ResHeader title="Test"
      sub="Test categories and evaluations (distinct from M1 Quality Monitors, which evaluate live conversations post-deployment)."/>
    <Card padding={24}>
      <div style={{ textAlign: "center", padding: "30px 20px" }}>
        <Icon name="flask" size={28} strokeWidth={1.7} style={{ color: T.ink4 }}/>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 12 }}>Test categories</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>
          Pre-deployment evaluations preserved as-is from the canonical doc.
        </div>
      </div>
    </Card>
  </div>
);

const AdvDeploy = () => (
  <div>
    <ResHeader title="Deploy"
      sub="Conditions, smart routing, review evaluations. Per-automation deploy surface."/>
    <Card padding={24}>
      <div style={{ textAlign: "center", padding: "30px 20px" }}>
        <Icon name="rocket" size={28} strokeWidth={1.7} style={{ color: T.ink4 }}/>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 12 }}>Deploy settings</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>
          Conditions · Smart Routing · Review Evaluations.
        </div>
      </div>
    </Card>
  </div>
);

const AdvAutomations = () => {
  const rows = [
    { name: "SubSummitDemo",       status: "Deployed",     type: "Conversational", modified: "May 18, 2026", on: true },
    { name: "Sub Summit Demo",     status: "Paused",       type: "Conversational", modified: "May 12, 2026", on: false },
    { name: "Mar 25 Test",         status: "Not deployed", type: "Conversational", modified: "Mar 25, 2026", on: false },
    { name: "Shoptalk Automation 1", status: "Deployed",   type: "Conversational", modified: "Mar 24, 2026", on: true },
    { name: "Auto Test Mar 4",     status: "Deployed",     type: "Conversational", modified: "Mar 04, 2026", on: true },
  ];
  return (
    <div>
      <ResHeader title="AI Automations" sub="View and manage your AI automations."
        action={<Btn kind="ink" icon="plus" size="sm">Add Automation</Btn>}/>
      <Card padding={0} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bgSoft }}>
              {["Name","Status","Type","Modified",""].map((h, i) => (
                <th key={i} style={{ padding: "10px 18px", borderBottom: `1px solid ${T.rule}`, textAlign: "left", fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={tdSt}><span style={{ color: T.blue, fontWeight: 600 }}>{r.name}</span></td>
                <td style={tdSt}>
                  <Chip tone={r.status === "Deployed" ? "success" : r.status === "Paused" ? "warn" : "default"}>{r.status}</Chip>
                </td>
                <td style={tdSt}>{r.type}</td>
                <td style={tdSt}>{r.modified}</td>
                <td style={tdSt}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Toggle on={r.on} onChange={() => {}}/>
                    <button style={iconBtnSm} title="Edit"><Icon name="edit" size={12} strokeWidth={1.9}/></button>
                    <button style={iconBtnSm} title="Delete"><Icon name="x" size={12} strokeWidth={2.2}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdvSettings = () => (
  <div>
    <ResHeader title="AI Settings (legacy)"
      sub="Legacy AI settings preserved for migration."/>
    <Card padding={24}>
      <div style={{ textAlign: "center", padding: "30px 20px" }}>
        <Icon name="cog" size={28} strokeWidth={1.7} style={{ color: T.ink4 }}/>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 12 }}>Legacy settings</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>
          New configuration belongs in <b>Settings</b> in the main nav.
        </div>
      </div>
    </Card>
  </div>
);

// ── Connections — simple stub ──────────────────────────────
const Connections = () => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff" }}>
    <div style={{ padding: "26px 36px 18px" }}>
      <h1 style={{
        fontFamily: "var(--font-sans)", fontWeight: 700,
        fontSize: "var(--text-h1)", lineHeight: "var(--leading-h1)",
        letterSpacing: "-0.01em", color: T.ink, margin: 0,
      }}>Connections</h1>
      <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "10px 0 0", lineHeight: "var(--leading-body)" }}>
        Integrations and MCP servers, the external systems Kustomer AI calls into.
      </p>
    </div>
    <div style={{ flex: 1, padding: "24px 36px" }}>
      <Card padding={0} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bgSoft }}>
              {["Integration","Auth","Status","Last sync"].map((h, i) => (
                <th key={i} style={{ padding: "10px 18px", borderBottom: `1px solid ${T.rule}`, textAlign: "left", fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Shopify",       auth: "OAuth",   status: "ok",   last: "hourly" },
              { name: "Stripe",        auth: "API key", status: "ok",   last: "hourly" },
              { name: "EasyPost",      auth: "API key", status: "ok",   last: "hourly" },
              { name: "Snowflake",     auth: "OAuth",   status: "warn", last: "daily" },
              { name: "Internal MCP",  auth: "custom",  status: "ok",   last: "live" },
            ].map((r, i) => (
              <tr key={i}>
                <td style={tdSt}><span style={{ fontWeight: 600, color: T.ink }}>{r.name}</span></td>
                <td style={tdSt}>{r.auth}</td>
                <td style={tdSt}>
                  <Chip tone={r.status === "warn" ? "warn" : "success"}>{r.status === "warn" ? "Warning" : "OK"}</Chip>
                </td>
                <td style={tdSt}>{r.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  </div>
);

Object.assign(window, { Advanced, Connections });
