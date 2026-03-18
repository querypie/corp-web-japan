export interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  picture?: {
    data: {
      url: string;
      is_silhouette: boolean;
    };
  };
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  picture?: {
    data: {
      url: string;
      is_silhouette: boolean;
    };
  };
}

export interface FacebookPagesResponse {
  data: FacebookPage[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}

export interface FacebookPostResponse {
  id: string;
}

export interface FacebookPhotoResponse {
  id: string;
  post_id?: string;
}
