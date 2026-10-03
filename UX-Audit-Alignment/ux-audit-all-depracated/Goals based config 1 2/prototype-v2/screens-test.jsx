// ============================================================
// Test tab, eval categories table with run-all flow
// Mirrors the reference layout: title + subhead + Run All Tests button,
// then a clean tabular layout (Category / Used by / Topics / Status / Last
// run / Score). Run All Tests sequentially "runs" each category with a
// spinner + animated state until all rows complete.
// ============================================================

const TestScreen = ({ automation, navigate, onAdvance, resultsView, detailId }) => {
  const cats = window.MOCK.TEST_CATEGORIES;
  const failingId = "damaged"; // canonical demo failure for the three-ways-forward branch

  // If a category is opened, show its test-case detail instead of the table.
  if (detailId) {
    const cat = cats.find((c) => c.id === detailId);
    if (cat) return <TestCaseDetail cat={cat} automation={automation} navigate={navigate} />;
  }

  // Per-category test state machine.
  // pending = never run / waiting / 'No prior runs'
  // running = currently being evaluated
  // done    = score finalized
  const [rowState, setRowState] = useState(() =>
    Object.fromEntries(cats.map((c) => [c.id, { state: "pending", score: null, lastRun: "No prior runs" }]))
  );

  // Aggregate running flag; true while at least one row is mid-eval.
  const running = Object.values(rowState).some((r) => r.state === "running");
  const allDone = Object.values(rowState).every((r) => r.state === "done");

  // Aggregate counts for the results banner.
  const pass = Object.values(rowState).filter((r) => r.state === "done" && r.score >= 0.7).length;
  const warn = Object.values(rowState).filter((r) => r.state === "done" && r.score >= 0.5 && r.score < 0.7).length;
  const fail = Object.values(rowState).filter((r) => r.state === "done" && r.score < 0.5).length;
  const failingCat = cats.find((c) => c.id === failingId);

  // Run all categories sequentially.
  const runAll = () => {
    // Reset to running-from-scratch
    setRowState(Object.fromEntries(cats.map((c) => [c.id, { state: "pending", score: null, lastRun: "Queued" }])));

    const stepMs = 750;
    cats.forEach((c, i) => {
      // Mark as running after a stagger
      setTimeout(() => {
        setRowState((prev) => ({ ...prev, [c.id]: { ...prev[c.id], state: "running", lastRun: "Running…" } }));
      }, i * stepMs);

      // Complete after this row's running window
      setTimeout(() => {
        setRowState((prev) => ({
          ...prev,
          [c.id]: {
            state: "done",
            score: c.score, // use canonical demo score
            lastRun: "Just now",
          },
        }));
      }, i * stepMs + 650);
    });
  };

  // Run a single category (per-row replay).
  const runOne = (catId) => {
    const c = cats.find((x) => x.id === catId);
    if (!c) return;
    setRowState((prev) => ({ ...prev, [catId]: { ...prev[catId], state: "running", lastRun: "Running…" } }));
    setTimeout(() => {
      setRowState((prev) => ({ ...prev, [catId]: { state: "done", score: c.score, lastRun: "Just now" } }));
    }, 900);
  };

  return (
    <>
      {/* Header, title + subhead + primary action */}
      <div className="test-head">
        <div>
          <h2>Test Cases</h2>
          <p>
            Saved checks that score your AI and gate deploy. Each case grades
            one step of a conversation against the goal this automation drives, so
            a failing case means that goal is at risk.
          </p>
        </div>
        <button
          className="btn brand test-run-btn"
          onClick={runAll}
          disabled={running}
        >
          {running ? (
            <><span className="test-spinner" /> Running…</>
          ) : allDone ? (
            <><Icon name="rotate" size={12} /> Re-run all</>
          ) : (
            <><Icon name="play" size={12} /> Run All Tests</>
          )}
        </button>
      </div>

      {/* Two-kinds-of-testing gloss — kills the Console vs Test Case conflation */}
      <div className="test-kinds-gloss">
        <Icon name="info" size={12} />
        <span>
          <b>Two ways to test.</b> The <b>Test Console</b> (right) is a live sandbox — chat with your AI, nothing is saved or scored. <b>Test Cases</b> (below) are saved checks that score your AI and gate deploy. Results from the Console don't appear here unless you save them as a case.
        </span>
      </div>

      {/* Inline progress bar visible while running */}
      {running && (
        <TestProgress rowState={rowState} cats={cats} />
      )}

      {/* Table */}
      <div className="test-table">
        <div className="test-thead">
          <div className="th cat">Category Name</div>
          <div className="th used">Used by</div>
          <div className="th topics">Topics Covered</div>
          <div className="th status">Status</div>
          <div className="th lastrun">Last run</div>
          <div className="th score">Score</div>
        </div>
        {cats.map((c) => {
          const r = rowState[c.id];
          const scoreClass = r.state === "done" ? (r.score >= 0.7 ? "pass" : r.score >= 0.5 ? "warn" : "fail") : "";
          return (
            <div
              key={c.id}
              className={`test-trow ${r.state}`}
              onClick={() => r.state === "done" ? navigate(`automation:${automation.id}:test:${c.id}`) : null}
            >
              <div className="td cat">
                <span className="test-cat-name">{c.name}</span>
                <span className="test-cat-samples">{c.samples} sample conversations</span>
                {automation.drives?.length > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 10.5, color: "var(--ink-50)" }}>
                    Affects goal: <span className="goal-pill-inline" title={`Goal: ${automation.drives[0]} — this feature rolls up to this goal`}><Icon name="target" size={9} /> {automation.drives[0]}</span>
                  </span>
                )}
              </div>
              <div className="td used">
                {c.audience.map((a) => (
                  <span key={a} className="test-aud-pill">
                    {a === "AIC" ? "Customer AI" : a === "AIR" ? "Rep AI" : a}
                  </span>
                ))}
              </div>
              <div className="td topics">
                {c.topics.map((t) => (
                  <span key={t} className="test-topic-chip">{t}</span>
                ))}
              </div>
              <div className="td status">
                <span className="test-status-pill">{c.status}</span>
              </div>
              <div className="td lastrun">
                {r.state === "running" ? (
                  <span className="test-lastrun-running">
                    <span className="test-spinner sm" /> Running…
                  </span>
                ) : (
                  <span className={r.state === "done" ? "test-lastrun-done" : "test-lastrun-empty"}>
                    {r.lastRun}
                  </span>
                )}
              </div>
              <div className="td score">
                {r.state === "running" ? (
                  <span className="test-score-running">
                    <span className="test-bar"><span className="test-bar-fill" /></span>
                  </span>
                ) : r.state === "done" ? (
                  <span className={`test-score ${scoreClass}`}>
                    {Math.round(r.score * 100)}%
                  </span>
                ) : (
                  <span className="test-score-empty"></span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Results banner, three ways forward, only after all rows complete */}
      {allDone && fail > 0 && (
        <ResultsBanner pass={pass} fail={fail} failingCat={failingCat} navigate={navigate} automation={automation} />
      )}
      {allDone && fail === 0 && (
        <div className="test-all-pass">
          <Icon name="check" size={13} />
          <span>All {pass} categories passing. Ready to deploy.</span>
        </div>
      )}

      {/* Footer */}
      <div className="test-footer">
        <button className="btn ghost" onClick={() => navigate(`automation:${automation.id}:build`)}>
          <Icon name="chevLeft" size={12} /> Back to Build
        </button>
        <button
          className="btn brand"
          disabled={!allDone}
          onClick={onAdvance}
        >
          Continue to Deploy <Icon name="chevRight" size={12} />
        </button>
      </div>
    </>
  );
};

// ----- Inline progress bar (running state) -----
const TestProgress = ({ rowState, cats }) => {
  const total = cats.length;
  const done = Object.values(rowState).filter((r) => r.state === "done").length;
  const currentRunning = cats.find((c) => rowState[c.id].state === "running");
  const pct = Math.round(((done + (currentRunning ? 0.5 : 0)) / total) * 100);

  return (
    <div className="test-progress">
      <div className="test-progress-text">
        <Icon name="play" size={11} />
        <span>
          {currentRunning ? (
            <>Running <b>{currentRunning.name}</b> · {done} of {total} complete</>
          ) : (
            <>{done} of {total} complete</>
          )}
        </span>
      </div>
      <div className="test-progress-bar">
        <div className="test-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// "Three ways forward", appears after a failing run
const ResultsBanner = ({ pass, fail, failingCat, navigate, automation }) => {
  if (!failingCat) return null;
  return (
    <div className="card" style={{ margin: "18px 0", padding: 18, background: "var(--v2-paper)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--bad-bg)", color: "var(--bad)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="warning" size={13} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 14, color: "var(--ink-100)" }}>{pass} pass, {fail} fails</h3>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--ink-60)", letterSpacing: "-0.003em" }}>
            <b style={{ color: "var(--bad)" }}>{failingCat.name}</b> dropped to {Math.round(failingCat.score * 100)}% pass rate.
            Three ways forward.
          </p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultPath
          icon="edit"
          title="Fix it now"
          desc="Jump back to Build, refine procedures or knowledge for damaged items, re-test."
          cta="Back to Build"
          onClick={() => navigate(`automation:${automation.id}:build`)}
        />
        <ResultPath
          icon="filter"
          title="Deploy partial"
          desc="Activate, but exclude the failing category. We'll auto-add a routing rule that hands it off to humans."
          cta="Configure deploy"
          onClick={() => navigate(`automation:${automation.id}:deploy`)}
          recommended
        />
        <ResultPath
          icon="warning"
          title="Override"
          desc="Proceed with the failing category. The goal page will flag it loudly so it isn't forgotten."
          cta="Override & continue"
          variant="danger"
          onClick={() => navigate(`automation:${automation.id}:deploy`)}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// TestCaseDetail — opened from a category row. Teaches the two ideas
// participants missed: (1) a case grades ONE step, not the whole chat,
// and (2) the Input → Expected pairing is what's being checked.
// ---------------------------------------------------------------
const SAMPLE_CASES = {
  "standard-refunds": [
    { setup: "Customer has been chatting about a jacket that didn't fit.", input: "Can I get a refund for order #44120? It's been 9 days.", expect: "Confirms the order is within the 30-day window, then issues the refund and states the timeline.", pass: true },
    { setup: null, input: "I want my money back for the boots I returned last week.", expect: "Looks up the return, confirms it was received, and processes the refund without asking the customer to repeat info.", pass: true },
  ],
  "damaged": [
    { setup: "Customer opened with a photo request earlier in the thread.", input: "My blender arrived cracked. I want a refund.", expect: "Asks for a photo of the damage BEFORE issuing any refund, then escalates if the value is over the ceiling.", pass: false },
    { setup: null, input: "The screen on the monitor I bought is shattered.", expect: "Confirms item condition with a photo, logs the damage reason, and offers replacement or refund.", pass: false },
  ],
  "late-delivery": [
    { setup: null, input: "My order is 3 weeks late, I want a refund.", expect: "Checks carrier status, confirms the delay exceeds policy, and offers a refund or reship.", pass: true },
  ],
  "tracking": [
    { setup: null, input: "Where is my order #88001?", expect: "Looks up live carrier status and shares the ETA, without inventing a date if the carrier is ambiguous.", pass: true },
  ],
  "product": [
    { setup: null, input: "Is the Trailblazer tent waterproof?", expect: "Answers from the product catalog with the spec, and doesn't guess if the spec is missing.", pass: false },
  ],
  "account": [
    { setup: null, input: "I can't log in to my account.", expect: "Verifies identity per policy before sharing or changing any account details.", pass: false },
  ],
};

const TestCaseDetail = ({ cat, automation, navigate }) => {
  const cases = SAMPLE_CASES[cat.id] || [
    { setup: null, input: "Sample customer message for this scenario.", expect: "The behavior the AI should follow for this scenario.", pass: true },
  ];
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <button className="btn ghost sm" onClick={() => navigate(`automation:${automation.id}:test`)}>
          <Icon name="chevLeft" size={12} /> All test cases
        </button>
      </div>

      <div className="test-head">
        <div>
          <h2>{cat.name}</h2>
          <p>
            {cat.samples} saved test case{cat.samples === 1 ? "" : "s"} in this category.
            {automation.drives?.length > 0 && <> Scored against <span className="goal-pill-inline" title={`Goal: ${automation.drives[0]} — this feature rolls up to this goal`}><Icon name="target" size={9} /> {automation.drives[0]}</span>.</>}
          </p>
        </div>
        <button className="btn"><Icon name="plus" size={12} /> Add test case</button>
      </div>

      {/* The two things participants missed, said plainly. */}
      <div className="test-kinds-gloss">
        <Icon name="info" size={12} />
        <span>
          Each test case checks <b>one step</b> of a conversation, not the whole chat. We give the AI an <b>input</b> (a customer message, plus any earlier context) and check that its response matches the <b>expected behavior</b>.
        </span>
      </div>

      <div className="tc-list">
        {cases.map((c, i) => (
          <div key={i} className="tc-card">
            <div className="tc-card-head">
              <span className="tc-card-num">Case {i + 1}</span>
              <span className={`test-score ${c.pass ? "pass" : "fail"}`} style={{ fontSize: 13 }}>
                {c.pass ? "Passing" : "Failing"}
              </span>
            </div>

            {c.setup && (
              <div className="tc-setup">
                <span className="tc-setup-label">Earlier in the conversation</span>
                <span className="tc-setup-text">{c.setup}</span>
              </div>
            )}

            <div className="tc-pair">
              <div className="tc-panel input">
                <div className="tc-panel-label"><Icon name="inbox" size={11} /> Given this input <span className="tc-panel-hint">the graded moment</span></div>
                <div className="tc-panel-body">{c.input}</div>
              </div>
              <div className="tc-pair-arrow"><Icon name="chevRight" size={14} /></div>
              <div className="tc-panel expect">
                <div className="tc-panel-label"><Icon name="check" size={11} /> The AI should</div>
                <div className="tc-panel-body">{c.expect}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const ResultPath = ({ icon, title, desc, cta, onClick, recommended, variant }) => (
  <div style={{
    border: `1px solid ${recommended ? "var(--ink-90)" : "var(--v2-hairline)"}`,
    borderRadius: "var(--r-3)",
    padding: "12px 14px",
    background: recommended ? "var(--v2-paper-2)" : "var(--v2-paper)",
    display: "flex", flexDirection: "column", gap: 8,
    position: "relative",
  }}>
    {recommended && (
      <span style={{ position: "absolute", top: -8, left: 12, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", padding: "1px 7px", borderRadius: 4, background: "var(--ink-100)", color: "#fff" }}>Recommended</span>
    )}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 22, height: 22, borderRadius: 5, background: variant === "danger" ? "var(--bad-bg)" : "var(--v2-paper-2)", color: variant === "danger" ? "var(--bad)" : "var(--ink-70)", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--v2-hairline)" }}>
        <Icon name={icon} size={11} />
      </span>
      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--ink-100)" }}>{title}</h4>
    </div>
    <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-60)", lineHeight: 1.5, letterSpacing: "-0.003em", minHeight: 48 }}>{desc}</p>
    <button className={`btn sm ${recommended ? "primary" : variant === "danger" ? "danger" : ""}`} onClick={onClick} style={{ alignSelf: "flex-start" }}>{cta} <Icon name="chevRight" size={11} /></button>
  </div>
);

Object.assign(window, { TestScreen, TestProgress, ResultsBanner, ResultPath, TestCaseDetail });
