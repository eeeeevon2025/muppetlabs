import { type ReactNode, useEffect, useState } from 'react';

import useViewportWidth from './useViewportWidth';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Drawer = ({ open, onClose, children }: DrawerProps) => {
  const vw = useViewportWidth();
  const drawerWidth = vw < 400 ? '100vw' : vw < 720 ? '90vw' : '67vw';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setVisible(true), 10);
      return () => window.clearTimeout(t);
    }
    setVisible(false);
    return undefined;
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 38, 0.4)',
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 240ms ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: drawerWidth,
          background: '#fff',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 30px rgba(15,30,55,0.15)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Drawer;
