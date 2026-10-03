// ============================================================
// Reporting — Topics report.
// This is the "view" home for Topics (managing the taxonomy lives in
// Settings → Topics). Reinforces: Conversations → Topics → Goals.
// ============================================================

const ReportingScreen = ({ navigate, goals: goalsProp, showAnswers }) => {
  const topics = window.MOCK.TOPICS || [];
  const goals = goalsProp || [];

  // Rank topics by volume, find which goals cover each (label match).
  const ranked = [...topics].sort((a, b) => (b.volume || 0) - (a.volume || 0));
  const maxVol = ranked[0]?.volume || 1;
  const totalConvos = 12481; // demo figure, matches the wizard
  const coveredCount = ranked.filter((t) =>
    goals.some((g) => (g.topics || []).includes(t.label))
  ).length;
  const gapCount = ranked.length - coveredCount;

  const goalsForTopic = (label) =>
    goals.filter((g) => (g.topics || []).includes(label));

  return (
    <>
      <PageHeader
        title="Reporting"
        answers={"Trends across your whole workspace, over time. This is also where Topics live as a report — Performance covers live AI health, Reporting covers the bigger picture."}
        showAnswers={showAnswers}
      />
      <div className="page-body">
        {/* What is this / relationship reinforcement */}
        <div style={{ background: "var(--v2-paper-2)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--v2-hairline-2)", marginBottom: 18, fontSize: 12.5, color: "var(--ink-80)", lineHeight: 1.5 }}>
          <Icon name="info" size={12} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--ink-50)" }} />
          A <b style={{ color: "var(--ink-100)" }}>topic</b> is a group of similar customer conversations, built automatically from your history. Topics power your goal suggestions — use this report to see what customers contact you about and spot gaps a new goal could close. Edit the topic list in <b style={{ color: "var(--ink-100)" }}>Settings → Topics</b>.
        </div>

        {/* Stat strip */}
        <div className="rep-stats">
          <div className="rep-stat">
            <div className="rep-stat-val">{totalConvos.toLocaleString()}</div>
            <div className="rep-stat-lbl">Conversations · last 90 days</div>
          </div>
          <div className="rep-stat">
            <div className="rep-stat-val">{ranked.length}</div>
            <div className="rep-stat-lbl">Topics detected</div>
          </div>
          <div className="rep-stat">
            <div className="rep-stat-val">{coveredCount}</div>
            <div className="rep-stat-lbl">Covered by a goal</div>
          </div>
          <div className="rep-stat">
            <div className="rep-stat-val" style={{ color: gapCount > 0 ? "var(--warn)" : "var(--good)" }}>{gapCount}</div>
            <div className="rep-stat-lbl">No goal yet</div>
          </div>
        </div>

        {/* Topics table */}
        <div className="rep-section-head">
          <h3>Topics</h3>
          <span className="rep-section-meta">Ranked by conversation volume</span>
        </div>
        <div className="rep-table">
          <div className="rep-thead">
            <div className="th">Topic</div>
            <div className="th">Volume</div>
            <div className="th" title="Average handle time — the typical time to resolve one of these conversations">Avg. handle time</div>
            <div className="th">Covered by goal</div>
          </div>
          {ranked.map((t) => {
            const pct = Math.round((t.volume / maxVol) * 100);
            const covering = goalsForTopic(t.label);
            return (
              <div key={t.id} className="rep-trow">
                <div className="td rep-td-name">{t.label}</div>
                <div className="td rep-td-vol">
                  <span className="rep-bar-wrap">
                    <span className="rep-bar" style={{ width: `${pct}%` }}></span>
                  </span>
                  <span className="rep-vol-num mono">{t.volume}%</span>
                </div>
                <div className="td rep-td-aht mono">{t.aht}</div>
                <div className="td rep-td-goal">
                  {covering.length > 0 ? (
                    <div className="rep-goal-chips">
                      {covering.map((g) => (
                        <button
                          key={g.id}
                          className="rep-goal-chip"
                          onClick={() => navigate(`goal:${g.id}`)}
                          title={`Open goal: ${g.name}`}
                        >
                          <Icon name="target" size={10} /> {g.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="rep-goal-gap">
                      <Icon name="warning" size={10} /> No goal yet
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rep-footnote">
          <Icon name="info" size={11} />
          <span>
            Topics with <b>no goal yet</b> are unmanaged demand. Want the AI to take one on?
            <a onClick={() => navigate("goals")}> Create a goal in Goals →</a>
          </span>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { ReportingScreen });
