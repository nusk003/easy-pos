import { useEffect, useState } from 'react';

const getOnlineStatus = (): boolean => {
  return typeof navigator !== 'undefined' &&
    typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
};

export const useOnlineStatus = (): boolean => {
  const [onlineStatus, setOnlineStatus] = useState(getOnlineStatus());

  const setOnline = () => setOnlineStatus(true);
  const setOffline = () => setOnlineStatus(false);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return onlineStatus;
};
