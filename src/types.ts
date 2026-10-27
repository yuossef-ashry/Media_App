export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface UserProfile {
  _id: string;
  id?: string;
  name: string;
  username?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  photo?: string;
  cover?: string;
  bookmarks?: unknown[];
  followers?: unknown[];
  following?: string[];
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}

export interface PostUser {
  _id: string;
  id?: string;
  name: string;
  username?: string;
  photo?: string;
  followersCount?: number;
  followingCount?: number;
}

export interface Comment {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  commentCreator: PostUser;
  likes?: string[];
  repliesCount?: number;
}

export interface Post {
  _id: string;
  id?: string;
  body?: string;
  image?: string;
  privacy?: string;
  user: PostUser;
  sharedPost?: Post | null;
  likes?: string[];
  createdAt: string;
  commentsCount?: number;
  topComment?: Comment | null;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
  bookmarked?: boolean;
}

export interface SuggestedFriend extends PostUser {
  mutualFollowersCount?: number;
}
