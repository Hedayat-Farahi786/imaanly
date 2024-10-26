import { User, Post, UserStats } from '@/types';

export const currentUser: User = {
  id: '1',
  name: 'Abdullah Ahmad',
  username: 'abdullah',
  email: 'abdullah@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah',
  bio: 'Seeking knowledge and sharing insights about Islam',
  location: 'London, UK',
  website: 'https://example.com',
  joinedDate: '2024-01-01',
  following: 245,
  followers: 1234,
  isFollowing: false,
  socialLinks: {
    twitter: 'https://twitter.com/abdullah',
    instagram: 'https://instagram.com/abdullah',
  },
  interests: ['Quran', 'Hadith', 'Islamic History'],
  language: 'en',
  timezone: 'Europe/London',
};

export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just finished reading Surah Al-Kahf. The stories in this surah are truly inspiring! 📖✨',
    author: {
      id: '1',
      name: 'Abdullah Ahmad',
      username: 'abdullah',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah',
    },
    createdAt: '2024-03-15T10:00:00Z',
    likes: 42,
    comments: 5,
    liked: false,
    bookmarked: false,
    tags: ['Quran', 'Reflection'],
    visibility: 'public',
  },
  {
    id: '2',
    content: 'Beautiful sunrise for Fajr prayer today. Alhamdulillah for another blessed day! 🌅',
    author: {
      id: '2',
      name: 'Aisha Rahman',
      username: 'aisha',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    },
    createdAt: '2024-03-15T05:30:00Z',
    likes: 156,
    comments: 12,
    liked: true,
    bookmarked: true,
    images: [
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1000',
    ],
    tags: ['Fajr', 'Gratitude'],
    visibility: 'public',
  },
];

export const mockUserStats: UserStats = {
  prayers: {
    total: 1250,
    streak: 30,
    lastPrayer: '2024-03-15T16:30:00Z',
  },
  quran: {
    versesRead: 2500,
    bookmarks: 45,
    lastRead: '2024-03-15T14:20:00Z',
  },
  community: {
    posts: 87,
    likes: 342,
    comments: 156,
  },
};

// TODO-BACKEND: API Endpoints to implement
/*
1. User Profile API
   GET /api/users/:username
   - Returns user profile data
   - Requires: Authentication token
   - Response: User object

2. User Stats API
   GET /api/users/:username/stats
   - Returns user statistics
   - Requires: Authentication token
   - Response: UserStats object

3. Posts API
   GET /api/posts
   - Returns paginated posts
   - Query params: page, limit, userId, visibility
   - Requires: Authentication token
   - Response: { posts: Post[], total: number, hasMore: boolean }

4. Interactions API
   POST /api/posts/:postId/like
   POST /api/posts/:postId/bookmark
   DELETE /api/posts/:postId
   - Requires: Authentication token
   - Response: Updated Post object

5. Profile Update API
   PUT /api/users/profile
   - Updates user profile information
   - Requires: Authentication token
   - Request body: Partial<User>
   - Response: Updated User object

6. Follow/Unfollow API
   POST /api/users/:username/follow
   DELETE /api/users/:username/follow
   - Requires: Authentication token
   - Response: { following: boolean, followersCount: number }
*/