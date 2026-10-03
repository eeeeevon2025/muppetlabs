// Shared icons + tiny UI primitives. Loaded into window so all jsx files can use.
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ──────────────────────────────────────────── Icons ────
const Icon = ({ d, size = 16, stroke = 1.75, fill = 'none', children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children || <path d={d}/>}
  </svg>
);
const IGoal = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></Icon>;
const IMonitor = (p) => <Icon {...p}><path d="M3 12h4l2-7 4 14 2-7h6"/></Icon>;
const IInbox = (p) => <Icon {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></Icon>;
const IBeaker = (p) => <Icon {...p}><path d="M9 3h6"/><path d="M10 3v8L4 21h16L14 11V3"/></Icon>;
const ISpark = (p) => <Icon {...p}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></Icon>;
const IPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IClose = (p) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>;
const IChevronRight = (p) => <Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>;
const IChevronLeft = (p) => <Icon {...p}><path d="m15 18-6-6 6-6"/></Icon>;
const IChevronDown = (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>;
const ICheck = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>;
const ITrendUp = (p) => <Icon {...p}><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></Icon>;
const ITrendDown = (p) => <Icon {...p}><path d="M22 17 13.5 8.5 8.5 13.5 2 7"/><path d="M16 17h6v-6"/></Icon>;
const IAlert = (p) => <Icon {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></Icon>;
const IInfo = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></Icon>;
const ISearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></Icon>;
const IFilter = (p) => <Icon {...p}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></Icon>;
const ISettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
const IBolt = (p) => <Icon {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></Icon>;
const IInbox2 = (p) => <Icon {...p} fill="currentColor" stroke="none"><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4z"/></Icon>;
const IUsers = (p) => <Icon {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const IBook = (p) => <Icon {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>;
const IConvo = (p) => <Icon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>;
const IFlow = (p) => <Icon {...p}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h6a3 3 0 0 1 3 3v6"/></Icon>;
const ICheckCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></Icon>;
const ICircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/></Icon>;
const ISave = (p) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></Icon>;
const IRefresh = (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></Icon>;
const ITrash = (p) => <Icon {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></Icon>;
const IExternal = (p) => <Icon {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></Icon>;
const ICopy = (p) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>;
const IFlag = (p) => <Icon {...p}><path d="M4 22V4a1 1 0 0 1 1-1h13l-3 5 3 5H5"/></Icon>;
const IThumbDown = (p) => <Icon {...p}><path d="M10 15v4a3 3 0 0 0 6 0v-4h4a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6.5L4 11v4z"/></Icon>;
const IBell = (p) => <Icon {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></Icon>;
const IRobot = (p) => <Icon {...p}><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 2v4M8 14h.01M16 14h.01M9 18h6"/></Icon>;
const IWand = (p) => <Icon {...p}><path d="m3 21 9-9M9.5 6.5 11 5l1.5 1.5L11 8zM18.5 13.5 20 12l1.5 1.5L20 15zM14 3l1.5 1.5M19 8l1.5 1.5"/></Icon>;
const ITarget = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></Icon>;
const ILink = (p) => <Icon {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Icon>;
const IGrid = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Icon>;
const IClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Icon>;
const IMail = (p) => <Icon {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></Icon>;
const ICalendar = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Icon>;

Object.assign(window, {
  React, useState, useEffect, useRef, useMemo, useCallback,
  Icon, IGoal, IMonitor, IInbox, IBeaker, ISpark, IPlus, IClose, IChevronRight,
  IChevronLeft, IChevronDown, ICheck, ITrendUp, ITrendDown, IAlert, IInfo,
  ISearch, IFilter, ISettings, IBolt, IInbox2, IUsers, IBook, IConvo, IFlow,
  ICheckCircle, ICircle, ISave, IRefresh, ITrash, IExternal, ICopy, IFlag,
  IThumbDown, IBell, IRobot, IWand, ITarget, ILink, IGrid, IClock, IMail, ICalendar,
});

// ──────────────────────────────────────────── Sparkline ────
function Sparkline({ data, color = 'var(--blue-70)', height = 36, fill = true }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
  const area = `${path} L${w} ${height} L0 ${height} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      {fill && <path d={area} fill={color} opacity="0.12"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
}

// ──────────────────────────────────────────── Drawer ────
function Drawer({ open, onClose, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>
      <aside className={'drawer' + (wide ? ' drawer--wide' : '')} role="dialog" aria-modal="true">
        {children}
      </aside>
    </>
  );
}

// ──────────────────────────────────────────── Modal ────
function Modal({ open, onClose, children, wide, dismissOnBackdrop = true }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={dismissOnBackdrop ? onClose : undefined}>
      <div className={'modal' + (wide ? ' modal--wide' : '')} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────── Tooltip helper ────
function Hint({ children, label }) {
  return (
    <span title={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'help' }}>
      {children}
      <IInfo size={12} stroke={2} style={{ color: 'var(--gray-85)' }}/>
    </span>
  );
}

// ──────────────────────────────────────────── Toast ────
const ToastContext = React.createContext(null);
function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, kind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setItems((l) => [...l, { id, msg, kind }]);
    setTimeout(() => setItems((l) => l.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 100 }}>
        {items.map((it) => (
          <div key={it.id} style={{
            background: it.kind === 'success' ? 'var(--green-90)' : it.kind === 'error' ? 'var(--red-90)' : 'var(--gray-130)',
            color: 'white', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            boxShadow: '0 8px 24px rgba(15,30,55,0.2)', display: 'flex', alignItems: 'center', gap: 8
          }}>
            {it.kind === 'success' && <ICheck size={14} stroke={2.5}/>}
            {it.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
const useToast = () => React.useContext(ToastContext);

Object.assign(window, { Sparkline, Drawer, Modal, Hint, ToastProvider, useToast });
