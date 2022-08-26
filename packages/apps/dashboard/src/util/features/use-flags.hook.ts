import axios from 'axios';
import useSWR from 'swr';
import { fallbackFlags } from './fallback-flags';
import { flags as developmentFlags } from './flags';

const sheet =
  process.env.REACT_APP_STAGE === 'production'
    ? "'cloud-console-production'"
    : "'cloud-console-staging'";

export const useFlags = () => {
  const { data } = useSWR<typeof fallbackFlags>(
    `https://sheets.googleapis.com/v4/spreadsheets/18KaELF8m6UHLnATxr7hoCzC4Z1Fb6tcW1GQ1yOSRhDY/values/${sheet}!A:B?key=AIzaSyA5V16SelVp66UGRNvQxd7K-R7_RU4LxvQ`,
    (url) => {
      if (process.env.REACT_APP_STAGE === 'development') {
        return developmentFlags;
      }

      return axios
        .get(url)
        .then((response) => {
          const values: Array<[keyof typeof fallbackFlags, string]> =
            response.data.values.slice(1);

          const data: Partial<typeof fallbackFlags> = {};

          values.forEach(([feature, value]) => {
            data[feature] = value === '1';
          });

          return data as typeof fallbackFlags;
        })
        .catch(() => {
          return fallbackFlags;
        });
    }
  );

  return data || fallbackFlags;
};
