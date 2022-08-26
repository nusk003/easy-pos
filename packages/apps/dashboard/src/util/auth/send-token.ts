import { sdk } from '@src/xhr/graphql-request';

interface SendTokenOptions {
  email: string;
  verificationTokenOnly?: boolean;
}

export const sendToken = async ({
  email,
  verificationTokenOnly,
}: SendTokenOptions) => {
  await sdk.sendUserToken({ email, verificationTokenOnly });
};
