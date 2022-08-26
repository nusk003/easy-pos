import { Buffer } from 'buffer';

interface ImageOptions {
  key: string | undefined | null;
  config: {
    resize: {
      fit: 'contain' | 'cover' | 'inside' | 'outside';
      width?: number;
      height?: number;
    };
  };
}

const __cloudfront_url__ = 'https://dqzt6uom3izpc.cloudfront.net/';

export const imageSDK = ({ config, key }: ImageOptions) => {
  try {
    if (!key) {
      return '';
    }

    if (!key.includes('amazonaws.com/')) {
      throw new Error('Key does not contain a valid Amazon S3 path');
    }

    if (!key.includes('hm-hotel-assets')) {
      throw new Error('Key does not contain a valid hm-hotel-assets path');
    }

    const imageRequest = JSON.stringify({
      bucket: 'hm-hotel-assets',
      key: key.split('amazonaws.com/')[1],
      edits: config,
    });

    const url = `${__cloudfront_url__}/${Buffer.from(imageRequest).toString(
      'base64'
    )}`;

    return url;
  } catch (err) {
    console.error(err);
    return '';
  }
};
