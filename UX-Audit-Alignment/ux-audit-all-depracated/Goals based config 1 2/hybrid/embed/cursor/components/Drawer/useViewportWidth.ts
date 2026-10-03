import { useEffect, useState } from 'react';

const useViewportWidth = () => {
  const [vw, setVw] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => setVw(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return vw;
};

export default useViewportWidth;
