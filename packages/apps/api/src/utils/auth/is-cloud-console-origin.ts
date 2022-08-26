import { __dev__ } from '@src/constants';

export const isCloudConsoleOrigin = (origin: string | undefined) => {
  return (
    origin?.includes('app.hotelmanager.co') ||
    (__dev__ && origin?.includes(':3000'))
  );
};
