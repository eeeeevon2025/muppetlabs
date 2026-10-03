// AI Agents table

const AGENT_COLORS = {
  customer: { bg: "#3F8CFF", icon: "user" },
  general:  { bg: "#A7B0C0", icon: "bookOpen" },
  knowledge: { bg: "#6E79E0", icon: "bookOpen" },
  task:     { bg: "#3F8CFF", icon: "task" },
};

const AgentRow = ({ agent, onEdit, onDelete }) => (
  <tr
    style={{ borderBottom: "1px solid #E8EAF0", transition: "background 120ms" }}
    onMouseEnter={e => e.currentTarget.style.background = "#FCFDFF"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
  >
    <td style={{ padding: "16px 14px", verticalAlign: "top" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: agent.color, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <RailIcon name={agent.icon} size={14} strokeWidth={2}/>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13, fontWeight: 700, color: "#1F242D",
            marginBottom: 2,
          }}>{agent.name}</div>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12, color: "#697182",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 320,
          }}>{agent.description}</div>
        </div>
      </div>
    </td>
    <td style={{ padding: "16px 14px", verticalAlign: "top", fontSize: 13, color: "#1F242D" }}>
      {agent.klass}
    </td>
    <td style={{ padding: "16px 14px", verticalAlign: "top" }}>
      <span style={{
        display: "inline-block",
        padding: "3px 8px",
        background: "#F2F3F7",
        color: "#5F6675",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        borderRadius: 4,
        maxWidth: 160,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>{agent.model}</span>
    </td>
    <td style={{ padding: "16px 14px", verticalAlign: "top", fontSize: 12, color: "#5F6675", lineHeight: 1.4 }}>
      <div>{agent.createdDate}</div>
      <div>{agent.createdTime}</div>
    </td>
    <td style={{ padding: "16px 14px", verticalAlign: "top", fontSize: 12, color: "#5F6675", lineHeight: 1.4 }}>
      <div>{agent.modifiedDate}</div>
      <div>{agent.modifiedTime}</div>
    </td>
    <td style={{ padding: "16px 14px", verticalAlign: "top", width: 1 }}>
      <div style={{ display: "flex", gap: 6 }}>
        <IconBtn onClick={() => onEdit(agent)} title="Edit">
          <RailIcon name="pencilEdit" size={14} strokeWidth={1.8}/>
        </IconBtn>
        <IconBtn onClick={() => onDelete(agent)} title="Delete">
          <RailIcon name="trash" size={14} strokeWidth={1.8}/>
        </IconBtn>
      </div>
    </td>
  </tr>
);

const IconBtn = ({ children, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 26, height: 26,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: 0, background: "transparent",
      color: "#697182",
      borderRadius: 4, cursor: "pointer",
      transition: "all 120ms",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "#F2F3F7"; e.currentTarget.style.color = "#1F242D"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#697182"; }}
  >{children}</button>
);

const AgentsTable = ({ agents, onEdit, onDelete }) => (
  <div style={{
    border: "1px solid #E8EAF0",
    borderRadius: 6,
    overflow: "hidden",
    background: "#fff",
  }}>
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <colgroup>
        <col/>
        <col style={{ width: 110 }}/>
        <col style={{ width: 170 }}/>
        <col style={{ width: 120 }}/>
        <col style={{ width: 120 }}/>
        <col style={{ width: 80 }}/>
      </colgroup>
      <thead>
        <tr style={{ background: "#F6F7FA", borderBottom: "1px solid #E8EAF0" }}>
          {["AI Agents", "Klass", "Model", "Created At", "Modified At", ""].map((h, i) => (
            <th key={i} style={{
              textAlign: "left",
              padding: "10px 14px",
              fontFamily: "var(--font-sans)",
              fontSize: 12, fontWeight: 600, color: "#5F6675",
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {agents.map(a => (
          <AgentRow key={a.id} agent={a} onEdit={onEdit} onDelete={onDelete}/>
        ))}
      </tbody>
    </table>
  </div>
);

Object.assign(window, { AgentsTable, IconBtn });
