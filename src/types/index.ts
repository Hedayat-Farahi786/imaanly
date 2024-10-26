export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: string;
  following: number;
  followers: number;
  isFollowing: boolean;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  interests: string[];
  language: string;
  timezone: string;
}

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  liked: boolean;
  bookmarked: boolean;
  images?: string[];
  tags?: string[];
  visibility: 'public' | 'private' | 'followers';
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
}

export interface UserStats {
  prayers: {
    total: number;
    streak: number;
    lastPrayer: string;
  };
  quran: {
    versesRead: number;
    bookmarks: number;
    lastRead: string;
  };
  community: {
    posts: number;
    likes: number;
    comments: number;
  };
}