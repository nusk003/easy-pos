import { __version__ } from '@src/constants';
import { cache } from 'swr';

const storage = localStorage;

export const persistSWRReload = (hotelId: string) => {
  cache.keys().forEach((key) => {
    if (key.includes('user')) {
      return;
    }

    cache.delete(key);
  });

  const localCache = JSON.parse(storage.getItem(`swr-${hotelId}`) || '{}');

  Object.entries(localCache).forEach(([key, data]) => {
    cache.set(key, data);
  });

  return cache.subscribe(() => {
    const newStorage: Record<string, any> = {};
    const keys = cache.keys();
    keys.forEach((key) => {
      newStorage[key] = cache.get(key);
    });
    storage.setItem(`swr-${hotelId}`, JSON.stringify(newStorage));
  });
};

export const persistSWR = (hotelId: string) => {
  const version = storage.getItem('version');

  if (version !== __version__) {
    storage.setItem('version', __version__);

    Object.keys(storage).forEach((key) => {
      if (key.includes('swr')) {
        storage.removeItem(key);
      }
    });
  }

  return persistSWRReload(hotelId);
};
