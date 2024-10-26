// Social feature types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  groupAdmins?: string[];
}

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'group_invite';
  actor: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'group';
    preview?: string;
  };
  timestamp: string;
  read: boolean;
}

export interface FollowRequest {
  id: string;
  from: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  privacy: 'public' | 'private';
  members: {
    id: string;
    role: 'admin' | 'moderator' | 'member';
  }[];
  memberCount: number;
  posts: string[];
  createdAt: string;
}

// TODO-BACKEND: API Endpoints Documentation

/*
1. Messages API
   - GET /api/messages
     Returns paginated conversations
     Query params: page, limit
     Response: { conversations: Conversation[], total: number }

   - GET /api/messages/:conversationId
     Returns messages for a conversation
     Query params: page, limit
     Response: { messages: Message[], total: number }

   - POST /api/messages
     Send a new message
     Body: { receiverId: string, content: string, attachments?: File[] }
     Response: Message

2. Groups API
   - GET /api/groups
     Returns user's groups
     Query params: page, limit
     Response: { groups: Group[], total: number }

   - POST /api/groups
     Create a new group
     Body: { name: string, description: string, privacy: 'public' | 'private', avatar?: File }
     Response: Group

   - PUT /api/groups/:groupId
     Update group settings
     Body: Partial<Group>
     Response: Group

   - POST /api/groups/:groupId/members
     Add members to group
     Body: { userIds: string[] }
     Response: { success: boolean }

3. Follow System API
   - GET /api/users/:userId/followers
     Returns user's followers
     Query params: page, limit
     Response: { users: User[], total: number }

   - GET /api/users/:userId/following
     Returns users being followed
     Query params: page, limit
     Response: { users: User[], total: number }

   - POST /api/follow/:userId
     Follow a user
     Response: { success: boolean }

   - DELETE /api/follow/:userId
     Unfollow a user
     Response: { success: boolean }

4. Notifications API
   - GET /api/notifications
     Returns user's notifications
     Query params: page, limit
     Response: { notifications: Notification[], total: number }

   - PUT /api/notifications/:notificationId/read
     Mark notification as read
     Response: { success: boolean }

   - PUT /api/notifications/read-all
     Mark all notifications as read
     Response: { success: boolean }

5. Follow Requests API
   - GET /api/follow-requests
     Returns pending follow requests
     Response: { requests: FollowRequest[] }

   - POST /api/follow-requests/:requestId/accept
     Accept a follow request
     Response: { success: boolean }

   - POST /api/follow-requests/:requestId/reject
     Reject a follow request
     Response: { success: boolean }

Authentication:
- All endpoints require a valid JWT token in the Authorization header
- Token format: Bearer <token>
- Implement rate limiting for API endpoints
- Add proper error handling and validation

Database Schema:
- Users collection
- Messages collection
- Conversations collection
- Groups collection
- Notifications collection
- FollowRequests collection
- Posts collection
- Comments collection

Real-time Features (WebSocket):
- Implement WebSocket connection for:
  * Real-time messaging
  * Notification delivery
  * Online status updates
  * Typing indicators
  * Read receipts

Security Considerations:
- Implement proper access control
- Validate file uploads
- Sanitize user input
- Implement request rate limiting
- Add proper error handling
*/