// Summaries and Signals tab content

const SummariesPanel = ({ state, set }) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <SectionTitle>Conversation summaries</SectionTitle>
        </div>
        <div style={{ paddingTop: 4 }}>
          <Toggle on={state.summariesOn} onChange={v => set({ summariesOn: v })} label="Turn on summaries"/>
        </div>
      </div>
      <Description style={{ marginTop: 6, marginBottom: 14 }}>
        Automatically summarize long conversations so reps can catch up in seconds. Summaries refresh after each customer reply.
      </Description>

      <div style={{ borderTop: "1px solid #E8EAF0", margin: "28px 0" }}/>

      <SectionTitle>Customer signals</SectionTitle>
      <Description style={{ marginTop: 6, marginBottom: 14 }}>
        Surface sentiment, urgency, and intent indicators on the conversation timeline. Signals update in real time as new messages arrive.
      </Description>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 620 }}>
        <SignalRow label="Sentiment" desc="Detect positive, neutral, or negative tone." on={state.sigSentiment} onChange={v => set({ sigSentiment: v })}/>
        <SignalRow label="Urgency" desc="Flag conversations needing fast response." on={state.sigUrgency} onChange={v => set({ sigUrgency: v })}/>
        <SignalRow label="Intent" desc="Classify what the customer is trying to do." on={state.sigIntent} onChange={v => set({ sigIntent: v })}/>
        <SignalRow label="Churn risk" desc="Predict likelihood of customer leaving based on history." on={state.sigChurn} onChange={v => set({ sigChurn: v })}/>
      </div>

      <div style={{ height: 80 }}/>
    </div>
  );
};

const SignalRow = ({ label, desc, on, onChange }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px",
    border: "1px solid #E8EAF0",
    borderRadius: 6,
    background: "#fff",
  }}>
    <div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1F242D" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2 }}>{desc}</div>
    </div>
    <Toggle on={on} onChange={onChange}/>
  </div>
);

Object.assign(window, { SummariesPanel });
