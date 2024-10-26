import { User, Post, UserStats } from '@/types';
import { currentUser, mockPosts, mockUserStats } from '@/mocks/data';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getCurrentUser: async (): Promise<User> => {
    await delay(500);
    return currentUser;
  },

  getUserProfile: async (username: string): Promise<User> => {
    await delay(800);
    return currentUser;
  },

  getUserStats: async (username: string): Promise<UserStats> => {
    await delay(600);
    return mockUserStats;
  },

  getPosts: async (page: number = 1, limit: number = 10): Promise<{
    posts: Post[];
    total: number;
    hasMore: boolean;
  }> => {
    await delay(1000);
    return {
      posts: mockPosts,
      total: mockPosts.length,
      hasMore: false,
    };
  },

  likePost: async (postId: string): Promise<Post> => {
    await delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    return {
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
    };
  },

  bookmarkPost: async (postId: string): Promise<Post> => {
    await delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    return {
      ...post,
      bookmarked: !post.bookmarked,
    };
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    await delay(1000);
    return {
      ...currentUser,
      ...data,
    };
  },

  followUser: async (username: string): Promise<{
    following: boolean;
    followersCount: number;
  }> => {
    await delay(500);
    return {
      following: true,
      followersCount: currentUser.followers + 1,
    };
  },
};

// Error simulation for testing error handling
export const simulateError = async (probability: number = 0.1): Promise<void> => {
  if (Math.random() < probability) {
    throw new Error('Simulated API error');
  }
};