import { UserLoginMutation } from '@hm/sdk';
import { toast } from '@src/components/atoms';
import { sdk } from '@src/xhr/graphql-request';

interface LoginOptions {
  token: string;
}

export const login = async ({
  token,
}: LoginOptions): Promise<UserLoginMutation['userLogin'] | undefined> => {
  const requestHeaders = {
    authorization: `Bearer ${token}`,
  };

  try {
    const response = await sdk.userLogin({}, requestHeaders);
    return response.userLogin;
  } catch {
    toast.warn(
      'Unable to login. The magic link may have expired. Please try again.'
    );
    return undefined;
  }
};
