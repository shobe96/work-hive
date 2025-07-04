export interface RegisterRequest {
  user: UserInfo;
  session: SessionInfo;
  weakPassword: WeakPasswordInfo;
  // Optional: Add a top-level status or metadata if needed in the future
}

export interface UserInfo {
  id?: string;
  aud?: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string | null;
  created_at?: string;
}

export interface SessionInfo {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
  refresh_token?: string;
  user?: UserInfo; // optional nested user data
}

export interface WeakPasswordInfo {
  message: string;
  reasons: string[];
}
