// ============================================================
// Test tab — eval categories table
// ============================================================

const TestScreen = ({ automation, navigate, onAdvance }) => {
  const cats = window.MOCK.TEST_CATEGORIES;
  const pass = cats.filter((c) => c.score >= 0.7).length;
  const warn = cats.filter((c) => c.score >= 0.5 && c.score < 0.7).length;
  const fail = cats.filter((c) => c.score < 0.5).length;

  return (
    <>
      <div className="card-row" style={{ marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "var(--gray-120)" }}>Test Categories</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--gray-95)" }}>
            Run AI against sample conversations grouped by scenario. Each category is scored against your configuration.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, fontSize: 12, marginRight: 8 }}>
            <span className="chip green">{pass} pass</span>
            <span className="chip yellow">{warn} warning</span>
            <span className="chip red">{fail} fail</span>
          </div>
          <button className="btn"><Icon name="plus" size={13} /> Add category</button>
          <button className="btn primary"><Icon name="play" size={13} /> Run all tests</button>
        </div>
      </div>

      <div className="table" style={{ marginBottom: 18 }}>
        <div className="eval-row" style={{ background: "var(--gray-20)", padding: "10px 18px", minHeight: 38, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-90)", cursor: "default", borderBottom: "1px solid var(--gray-30)" }}>
          <div>Category</div>
          <div>Audience · Topics</div>
          <div>Status</div>
          <div>Last run</div>
          <div>Score</div>
        </div>
        {cats.map((c) => (
          <div key={c.id} className="eval-row" onClick={() => navigate(`automation:${automation.id}:test:${c.id}`)}>
            <div>
              <div className="name">{c.name}</div>
              <small style={{ display: "block", color: "var(--gray-90)", fontSize: 11.5, marginTop: 2 }}>{c.samples} sample conversations</small>
            </div>
            <div>
              <div className="audience-tags">
                {c.audience.map((a) => <AudienceChip key={a} audience={a} />)}
              </div>
              <small style={{ display: "block", color: "var(--gray-90)", fontSize: 11.5, marginTop: 3 }}>{c.topics.join(", ")}</small>
            </div>
            <div><span className={`status ${c.status}`}>{c.status}</span></div>
            <div style={{ fontSize: 12, color: "var(--gray-95)" }}>{c.lastRun}</div>
            <div>
              <span className={`score ${c.score >= 0.7 ? "pass" : c.score >= 0.5 ? "warn" : "fail"}`}>
                {c.score >= 0.7 ? "Pass" : c.score >= 0.5 ? "Warn"  : "Fail"} · {Math.round(c.score * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn ghost" onClick={() => navigate(`automation:${automation.id}:build`)}>
          <Icon name="chevLeft" size={13} /> Back to Build
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {automation.firstRunMode ? (
            <button className="btn primary" onClick={onAdvance}>
              Continue to Deploy <Icon name="chevRight" size={13} />
            </button>
          ) : (
            <button className="btn">Continue to Deploy <Icon name="chevRight" size={13} /></button>
          )}
        </div>
      </div>
    </>
  );
};

Object.assign(window, { TestScreen });
