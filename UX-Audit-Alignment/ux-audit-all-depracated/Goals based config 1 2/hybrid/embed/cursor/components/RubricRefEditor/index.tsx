import { useState, useEffect, useRef } from 'react';

import { REF_LIB, REF_TYPE_META, type RubricRef, type RubricRefType } from '../../data/rubricRefs';

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const BORDER = '#dce0e9';

export interface RubricRefEditorProps {
  refs: RubricRef[];
  onChange: (next: RubricRef[]) => void;
  onWriteRubric?: () => void;
  onClickRubricRef?: () => void;
}

const RubricRefEditor = ({ refs, onChange, onWriteRubric, onClickRubricRef }: RubricRefEditorProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && e.target instanceof Node && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const m = query.match(/^\/(kb|tool|procedure)?:?(.*)$/i);
  const ns = m && m[1] ? (m[1].toLowerCase() as RubricRefType) : null;
  const filter = (m ? m[2] : query).toLowerCase().trim();
  const namespaces: RubricRefType[] = ns ? [ns] : ['kb', 'tool', 'procedure'];

  const suggestions: { type: RubricRefType; slug: string; label: string }[] = [];
  namespaces.forEach((type) => {
    REF_LIB[type].forEach((item) => {
      if (refs.some((r) => r.type === type && r.slug === item.slug)) return;
      const hay = `${item.slug} ${item.label}`.toLowerCase();
      if (!filter || hay.includes(filter)) suggestions.push({ type, slug: item.slug, label: item.label });
    });
  });
  const top = suggestions.slice(0, 6);

  const add = (s: { type: RubricRefType; slug: string }) => {
    onChange([...refs, { type: s.type, slug: s.slug }]);
    setQuery('');
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const remove = (idx: number) => onChange(refs.filter((_, i) => i !== idx));

  return (
    <div
      ref={containerRef}
      style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px dashed #E8EBF0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <span
          style={{
            font: '500 10px/14px Inter,sans-serif',
            color: '#8A94A6',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginRight: 4,
          }}
        >
          Related guidance
        </span>
        {refs.map((r, idx) => {
          const meta = REF_TYPE_META[r.type] || REF_TYPE_META.kb;
          const isRubric = r.type === 'rubric';
          return (
            <span
              key={`${r.type}:${r.slug}:${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 4px 2px 8px',
                background: meta.bg,
                border: `1px solid ${meta.border}`,
                borderRadius: 5,
                font: '600 11px/14px ui-monospace,SFMono-Regular,monospace',
                color: meta.color,
              }}
            >
              {isRubric && onClickRubricRef ? (
                <button
                  type="button"
                  onClick={onClickRubricRef}
                  title={`View rubric: ${r.slug}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    font: '600 11px/14px ui-monospace,SFMono-Regular,monospace',
                    color: meta.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ opacity: 0.75 }}>/{meta.label}:</span>
                  {r.slug}
                  <span style={{ fontSize: 9, opacity: 0.75 }}>↗</span>
                </button>
              ) : (
                <>
                  <span style={{ opacity: 0.75 }}>/{meta.label}:</span>
                  {r.slug}
                </>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                title="Remove"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 3px',
                  color: meta.color,
                  opacity: 0.6,
                  fontSize: 13,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          );
        })}
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={refs.length ? 'Search for guidance…' : 'Search for guidance, tools, or procedures'}
            style={{
              padding: '3px 8px',
              borderRadius: 5,
              border: '1px dashed #DCE0E9',
              font: '500 11px/14px ui-monospace,SFMono-Regular,monospace',
              color: '#5A6478',
              outline: 'none',
              background: '#fff',
              minWidth: refs.length ? 140 : 240,
              fontFamily: 'ui-monospace,SFMono-Regular,monospace',
            }}
          />
          {open && (query.startsWith('/') || query === '') && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                zIndex: 50,
                minWidth: 280,
                maxHeight: 240,
                overflowY: 'auto',
                background: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                boxShadow: '0 6px 22px rgba(15,18,25,0.14)',
                padding: 4,
                fontFamily: FF,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onWriteRubric?.();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '6px 8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: 4,
                  fontFamily: FF,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    font: '600 10px/14px Inter,sans-serif',
                    color: '#1C6EF2',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 4,
                    padding: '1px 6px',
                    minWidth: 60,
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  rubric
                </span>
                <span style={{ font: '600 12px/16px Inter,sans-serif', color: '#1C6EF2' }}>Write custom rubric</span>
                <span style={{ font: '400 11px/14px Inter,sans-serif', color: '#8A94A6', marginLeft: 'auto' }}>
                  Create from scratch
                </span>
              </button>
              <div style={{ borderTop: `1px solid #F0F2F6`, margin: '4px 0' }} />
              {top.length === 0 ? (
                <div style={{ padding: '8px 10px', font: '400 11px/16px Inter,sans-serif', color: '#8A94A6' }}>
                  No matches. Try <code style={{ color: '#1C6EF2' }}>/kb:</code>,{' '}
                  <code style={{ color: '#1C6EF2' }}>/tool:</code>, or{' '}
                  <code style={{ color: '#1C6EF2' }}>/procedure:</code>
                </div>
              ) : (
                top.map((s) => {
                  const meta = REF_TYPE_META[s.type];
                  return (
                    <button
                      key={`${s.type}:${s.slug}`}
                      type="button"
                      onClick={() => add(s)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                        padding: '6px 8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: 4,
                        fontFamily: FF,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F4F5F7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span
                        style={{
                          font: '600 10px/14px Inter,sans-serif',
                          color: meta.color,
                          background: meta.bg,
                          border: `1px solid ${meta.border}`,
                          borderRadius: 4,
                          padding: '1px 6px',
                          minWidth: 60,
                          textAlign: 'center',
                        }}
                      >
                        {meta.label}
                      </span>
                      <span style={{ font: '600 12px/16px ui-monospace,SFMono-Regular,monospace', color: '#1A1D23' }}>
                        {s.slug}
                      </span>
                      <span style={{ font: '400 11px/14px Inter,sans-serif', color: '#8A94A6', marginLeft: 'auto' }}>
                        {s.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RubricRefEditor;
