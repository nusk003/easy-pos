import { useHotel } from '@src/xhr/query';
import React, { useCallback, useEffect } from 'react';
import { useStore } from '@src/store';

require('hacktimer');

export const Title: React.FC = () => {
  const { pageTitle } = useStore(
    useCallback((state) => ({ pageTitle: state.pageTitle }), [])
  );

  const { data: hotel } = useHotel();

  useEffect(() => {
    let title = '';

    title += 'Easy POS';

    if (hotel?.name) {
      title = hotel.name + ' - ' + title;

      if (pageTitle) {
        title = pageTitle + ' - ' + title;
      }
    }

    document.title = title;
  }, [hotel?.name, pageTitle]);

  return null;
};

export const useTitle = () => {
  const { data: hotel } = useHotel();
  const { setPageTitle: setTitle } = useStore(
    useCallback((state) => ({ setPageTitle: state.setPageTitle }), [])
  );

  return {
    setTitle,
    blink: (value: string) => {
      const oldTitle = document.title;

      const blinkInterval = setInterval(() => {
        document.title = `${value} – ${hotel?.name} – Easy POS`;
        setTimeout(() => {
          document.title = oldTitle;
        }, 1000);
      }, 2000);

      const onMouseMove = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.title = oldTitle;
        clearInterval(blinkInterval);
      };

      document.addEventListener('mousemove', onMouseMove);
    },
  };
};
