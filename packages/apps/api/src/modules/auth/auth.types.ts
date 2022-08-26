export enum CookieName {
  User = 'uid',
  Guest = 'gid',
}

export type Cookies = Partial<Record<CookieName, string>> | undefined;

export interface JWTPayload {
  t: string;
  iss?: string;
}

export interface UserSession {
  userId: string;
  payload?: JWTPayload;
  hotel?: string;
  group?: string;
}

export interface GuestSession {
  guestId: string;
  anonAuth: boolean;
  payload?: JWTPayload;
  hotel?: string;
  group?: string;
  deviceId: string;
}

export interface UserLoginSession {
  userId: string;
  payload?: JWTPayload;
}

export interface GuestLoginSession {
  guestId: string;
  deviceId: string;
  payload?: JWTPayload;
  sessionId: string;
}

export interface WSAuthSession {
  sessionId: string;
  hotel: string;
}

export type Session =
  | UserSession
  | GuestSession
  | UserLoginSession
  | GuestLoginSession;

export interface APIKeyPayload {
  key: string;
  id: string;
  iss: string;
}

export interface RefreshTokenSession {
  userId: string;
  marketplaceId: string;
  refreshToken: true;
}

export interface AccessTokenSession extends UserSession {
  hotel?: string;
  marketplaceId: string;
  accessToken: true;
}
