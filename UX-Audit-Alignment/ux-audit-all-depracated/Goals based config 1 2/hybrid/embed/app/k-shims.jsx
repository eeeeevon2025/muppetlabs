// Lightweight shims for komponentsV2 components used by cursor/ sources.
// Each is registered onto window so the bundle's `window.X` destructuring picks it up.

(() => {
  const { useState, useRef, useEffect, useCallback, Children, cloneElement, isValidElement, useId } = React;

  const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  // ─── Icon ───────────────────────────────────────────────────────────────
  // Minimal SVG icons keyed by name. Falls back to text glyph for unknown names.
  const ICON_SIZES = { xSmall: 12, small: 14, medium: 16, large: 20, xLarge: 28 };
  function Icon({ type, size = 'medium', color, style }) {
    const px = typeof size === 'number' ? size : (ICON_SIZES[size] ?? 16);
    const sw = px < 14 ? 1.6 : 1.75;
    const stroke = color || 'currentColor';
    const common = {
      width: px, height: px, viewBox: '0 0 24 24', fill: 'none',
      stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
      style: { display: 'inline-block', flexShrink: 0, ...style },
    };
    switch (type) {
      case 'check':         return <svg {...common}><polyline points="4 12 10 18 20 6"/></svg>;
      case 'pen':           return <svg {...common}><path d="M14 4l6 6L8 22H2v-6z"/></svg>;
      case 'plus':          return <svg {...common}><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>;
      case 'chevron-left':  return <svg {...common}><polyline points="15 5 8 12 15 19"/></svg>;
      case 'chevron-right': return <svg {...common}><polyline points="9 5 16 12 9 19"/></svg>;
      case 'chevron-down':  return <svg {...common}><polyline points="5 9 12 16 19 9"/></svg>;
      case 'chevron-up':    return <svg {...common}><polyline points="5 15 12 8 19 15"/></svg>;
      case 'arrow-right':   return <svg {...common}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>;
      case 'arrow-left':    return <svg {...common}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="10 6 4 12 10 18"/></svg>;
      case 'xmark':
      case 'close':         return <svg {...common}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>;
      case 'alarm':         return <svg {...common}><path d="M5 17h14l-1.5-3V10a5.5 5.5 0 0 0-11 0v4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
      case 'sliders':       return <svg {...common}><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="9" cy="8" r="2"/><circle cx="15" cy="16" r="2"/></svg>;
      case 'sidebar-flip':  return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/></svg>;
      case 'search':        return <svg {...common}><circle cx="11" cy="11" r="6"/><line x1="16" y1="16" x2="21" y2="21"/></svg>;
      case 'trash':         return <svg {...common}><polyline points="4 7 20 7"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4h6v3"/></svg>;
      case 'info':          return <svg {...common}><circle cx="12" cy="12" r="9"/><line x1="12" y1="10" x2="12" y2="17"/><circle cx="12" cy="7" r="0.5" fill={stroke}/></svg>;
      case 'warning':       return <svg {...common}><path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="15"/><circle cx="12" cy="18" r="0.5" fill={stroke}/></svg>;
      default:              return <svg {...common}><circle cx="12" cy="12" r="4"/></svg>;
    }
  }

  // ─── Buttons ────────────────────────────────────────────────────────────
  function buttonBaseStyle({ size, disabled }) {
    const pad = size === 'small' ? '6px 12px' : '9px 16px';
    const fs = size === 'small' ? 12 : 13;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pad,
      borderRadius: 6,
      fontSize: fs,
      fontWeight: 600,
      fontFamily: FF,
      letterSpacing: '0.005em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      whiteSpace: 'nowrap',
      lineHeight: 1.2,
      transition: 'background 0.12s, border-color 0.12s, color 0.12s',
    };
  }

  function ButtonPrimary({ children, onClick, icon, size, disabled, type = 'button', style }) {
    return (
      <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        ...buttonBaseStyle({ size, disabled }),
        background: 'var(--blue-80, #005bd8)',
        color: '#fff',
        border: '1px solid var(--blue-80, #005bd8)',
        ...style,
      }}>
        {icon && <Icon type={icon} size={size === 'small' ? 'xSmall' : 'small'}/>}
        {children}
      </button>
    );
  }

  function ButtonSecondary({ children, onClick, icon, size, disabled, type = 'button', style }) {
    return (
      <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        ...buttonBaseStyle({ size, disabled }),
        background: '#fff',
        color: 'var(--gray-130, #161b25)',
        border: '1px solid var(--gray-40, #dce0e9)',
        ...style,
      }}>
        {icon && <Icon type={icon} size={size === 'small' ? 'xSmall' : 'small'}/>}
        {children}
      </button>
    );
  }

  function ButtonText({ children, onClick, icon, size, disabled, type = 'button', style }) {
    return (
      <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        ...buttonBaseStyle({ size, disabled }),
        background: 'transparent',
        color: 'var(--blue-80, #005bd8)',
        border: '1px solid transparent',
        padding: size === 'small' ? '4px 6px' : '6px 8px',
        ...style,
      }}>
        {icon && <Icon type={icon} size={size === 'small' ? 'xSmall' : 'small'}/>}
        {children}
      </button>
    );
  }

  function IconButton({ icon, onClick, size = 'medium', tooltip, disabled, style }) {
    const dim = size === 'small' ? 28 : 32;
    return (
      <button
        type="button"
        title={tooltip}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={{
          width: dim, height: dim,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: 6,
          color: 'var(--gray-110, #3f444f)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          ...style,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gray-25, #f2f3f7)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <Icon type={icon} size={size === 'small' ? 'small' : 'medium'}/>
      </button>
    );
  }

  // ─── Pill ────────────────────────────────────────────────────────────────
  function Pill({ type = 'default', message, removeIcon }) {
    const tokens = {
      default: { bg: 'var(--gray-25, #f2f3f7)', fg: 'var(--gray-115, #2e333d)', border: 'var(--gray-35, #e2e5ed)' },
      alert:   { bg: 'var(--yellow-15, #fffde5)', fg: 'var(--yellow-115, #584e1c)', border: 'var(--yellow-40, #fced92)' },
      info:    { bg: 'var(--blue-15, #dbe7ff)',    fg: 'var(--blue-100, #00349a)',  border: 'var(--blue-25, #bbd1ff)' },
      error:   { bg: 'var(--red-15, #ffe8e9)',     fg: 'var(--red-90, #9e181e)',    border: 'var(--red-30, #ffaaad)' },
      success: { bg: 'var(--green-15, #dbf5e0)',   fg: 'var(--green-90, #005d24)',  border: 'var(--green-30, #75d58a)' },
    };
    const t = tokens[type] || tokens.default;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 4,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: FF,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {removeIcon && <Icon type="warning" size={10} color={t.fg}/>}
        {message}
      </span>
    );
  }

  // ─── InputSearch ─────────────────────────────────────────────────────────
  function InputSearch({ value, onChange, onClear, placeholder }) {
    const [focused, setFocused] = useState(false);
    return (
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: 32,
        background: '#fff',
        border: `1px solid ${focused ? 'var(--blue-80, #005bd8)' : 'var(--gray-40, #dce0e9)'}`,
        borderRadius: 6,
        boxShadow: focused ? '0 0 0 3px rgba(0,91,216,0.12)' : 'none',
        transition: 'border-color 0.12s, box-shadow 0.12s',
      }}>
        <div style={{ paddingLeft: 8, color: 'var(--gray-80, #7c8596)', display: 'flex' }}>
          <Icon type="search" size="small"/>
        </div>
        <input
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            padding: '0 8px', fontSize: 13, fontFamily: FF, color: 'var(--gray-130, #161b25)',
            minWidth: 0,
          }}
        />
        {value && (
          <button type="button" onClick={onClear} aria-label="Clear" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '0 8px', color: 'var(--gray-80, #7c8596)', display: 'flex',
          }}>
            <Icon type="xmark" size="xSmall"/>
          </button>
        )}
      </div>
    );
  }

  // ─── Tabs / Tab ──────────────────────────────────────────────────────────
  function Tab(props) {
    // Placeholder — only used to enumerate children; rendered by Tabs.
    return null;
  }

  function Tabs({ activeTab = 0, onTabChange, tabListContainerClassName, children }) {
    const tabs = Children.toArray(children).filter(isValidElement);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
        <div className={tabListContainerClassName} style={{ borderBottom: '1px solid var(--gray-30, #e8eaf0)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 0 0 2px' }}>
            {tabs.map((tab, i) => {
              const { title, count } = tab.props || {};
              const on = i === activeTab;
              return (
                <button key={i} type="button" onClick={() => onTabChange?.(i)} style={{
                  position: 'relative',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 16px 14px',
                  border: 'none', background: 'none', cursor: 'pointer',
                  fontFamily: FF, fontSize: 14,
                  fontWeight: on ? 600 : 500,
                  color: on ? 'var(--gray-130, #161b25)' : 'var(--gray-95, #5f6675)',
                  borderBottom: on ? '2px solid var(--blue-80, #005bd8)' : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'color 0.12s',
                }}>
                  {title}
                  {count > 0 && (
                    <span style={{
                      minWidth: 18, height: 18, padding: '0 6px', borderRadius: 999,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: on ? 'var(--blue-80, #005bd8)' : 'var(--gray-25, #f2f3f7)',
                      color: on ? '#fff' : 'var(--gray-100, #545b68)',
                      fontSize: 10, fontWeight: 700,
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {tabs[activeTab]?.props?.children}
        </div>
      </div>
    );
  }

  // ─── PopoverMenu ─────────────────────────────────────────────────────────
  // Minimal: shows target, on click opens a small floating panel with `children`.
  function PopoverMenu({ target, children, targetAttachment }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    useEffect(() => {
      function onDown(e) {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
      }
      if (open) document.addEventListener('mousedown', onDown);
      return () => document.removeEventListener('mousedown', onDown);
    }, [open]);
    // Intercept target onClick to also toggle.
    const targetEl = isValidElement(target)
      ? cloneElement(target, {
          onClick: (e) => { target.props.onClick?.(e); setOpen(o => !o); },
        })
      : target;
    return (
      <span ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
        {targetEl}
        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            zIndex: 50,
            minWidth: 200,
            background: '#fff',
            border: '1px solid var(--gray-40, #dce0e9)',
            borderRadius: 8,
            boxShadow: '0 10px 24px rgba(15,18,25,0.12)',
            padding: 6,
          }}>
            {children}
          </div>
        )}
      </span>
    );
  }

  // ─── CopilotContainer ────────────────────────────────────────────────────
  // Pass-through wrapper with the AI-assistant chrome the CreateMonitorPanel expects.
  function CopilotContainer({ children, style }) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        height: '100%',
        ...style,
      }}>
        {children}
      </div>
    );
  }

  Object.assign(window, {
    Icon, ButtonPrimary, ButtonSecondary, ButtonText, IconButton,
    Pill, InputSearch, Tabs, Tab, PopoverMenu, CopilotContainer,
  });
})();
