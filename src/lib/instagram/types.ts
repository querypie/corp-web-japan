export interface InstagramShortLivedTokenResponse {
  access_token: string;
  user_id: number;
}

export interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramUserProfile {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
  account_type: string;
}

export interface InstagramMediaContainerResponse {
  id: string;
}

export interface InstagramPublishResponse {
  id: string;
}

export interface InstagramContainerStatus {
  status_code: "EXPIRED" | "ERROR" | "FINISHED" | "IN_PROGRESS" | "PUBLISHED";
  status?: string;
}
