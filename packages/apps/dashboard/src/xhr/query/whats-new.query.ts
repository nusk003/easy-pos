import axios from 'axios';
import useSWR from 'swr';

export interface WhatsNewItem {
  headline: string;
  description: string;
  link: string;
}

export interface WhatsNew {
  date?: string;
  data?: Array<WhatsNewItem>;
}

const sheet =
  process.env.REACT_APP_STAGE === 'production' ? 'Production' : 'Staging';

export const useWhatsNew = (fetch = true) => {
  const { data } = useSWR<WhatsNew>(
    fetch
      ? `https://sheets.googleapis.com/v4/spreadsheets/1JFn_BtqLmDSLlDH0cBe8CjXZTVqost8B9ENc2KxpUQ4/values/${sheet}!A:C?key=AIzaSyA5V16SelVp66UGRNvQxd7K-R7_RU4LxvQ`
      : null,
    (url) => {
      return axios
        .get(url)
        .then((response) => {
          const values: Array<[string, string, string]> =
            response.data.values.slice(3);
          const date = response.data.values[0][1];

          const data: Array<WhatsNewItem> = [];

          values.forEach((item) => {
            data.push({
              headline: item[0],
              description: item[1],
              link: item[2],
            });
          });

          return { data, date };
        })
        .catch(() => ({ data: [], date: '' }));
    }
  );

  return data;
};
