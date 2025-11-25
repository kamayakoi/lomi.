/* @proprietary license */

'use client';

import * as React from 'react';

const DEFAULT_MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint = DEFAULT_MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}
