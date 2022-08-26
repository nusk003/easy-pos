import { useEffect } from 'react';

const handleUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = '';
};

export const usePreventUnload = (enabled: boolean | undefined = undefined) => {
  useEffect(() => {
    if (enabled !== false) {
      window.addEventListener('beforeunload', handleUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [enabled]);
};
