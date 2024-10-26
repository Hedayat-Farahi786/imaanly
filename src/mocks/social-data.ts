import { Message, Conversation, Notification, FollowRequest, Group } from '@/types/social';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: {
      id: 'm1',
      senderId: '2',
      receiverId: '1',
      content: 'Assalamu alaikum brother!',
      timestamp: '2024-03-15T14:30:00Z',
      read: false,
    },
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: '2',
    participants: ['1', '2', '3'],
    lastMessage: {
      id: 'm2',
      senderId: '3',
      receiverId: '1',
      content: 'When is the next Quran study circle?',
      timestamp: '2024-03-15T13:45:00Z',
      read: true,
    },
    unreadCount: 0,
    isGroup: true,
    groupName: 'Quran Study Group',
    groupAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=QSG',
    groupAdmins: ['1'],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'follow',
    actor: {
      id: '2',
      name: 'Aisha Rahman',
      username: 'aisha',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    },
    timestamp: '2024-03-15T15:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'like',
    actor: {
      id: '3',
      name: 'Omar Khan',
      username: 'omar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    },
    target: {
      id: 'p1',
      type: 'post',
      preview: 'Just finished reading Surah Al-Kahf...',
    },
    timestamp: '2024-03-15T14:30:00Z',
    read: false,
  },
];

export const mockFollowRequests: FollowRequest[] = [
  {
    id: '1',
    from: {
      id: '4',
      name: 'Fatima Ali',
      username: 'fatima',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    },
    timestamp: '2024-03-15T12:00:00Z',
    status: 'pending',
  },
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Quran Study Circle',
    description: 'Weekly Quran study and discussion group',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=QSC',
    privacy: 'public',
    members: [
      { id: '1', role: 'admin' },
      { id: '2', role: 'member' },
      { id: '3', role: 'member' },
    ],
    memberCount: 25,
    posts: ['p1', 'p2', 'p3'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Islamic History',
    description: 'Exploring Islamic history and civilization',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=IH',
    privacy: 'public',
    members: [
      { id: '1', role: 'member' },
      { id: '3', role: 'admin' },
    ],
    memberCount: 42,
    posts: ['p4', 'p5'],
    createdAt: '2024-02-01T00:00:00Z',
  },
];