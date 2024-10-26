import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Globe,
  Link as LinkIcon,
  MapPin,
  Settings,
  UserPlus,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mock-api';
import PostCard from '@/components/community/post-card';
import { currentUser, mockPosts } from '@/mocks/data';
import { toast } from 'sonner';

export default function Profile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => mockApi.getUserProfile(username || currentUser.username),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats', username],
    queryFn: () => mockApi.getUserStats(username || currentUser.username),
  });

  const isOwnProfile = !username || username === currentUser.username;

  const handleFollow = async () => {
    try {
      await mockApi.followUser(profile?.username || '');
      toast.success(`Following ${profile?.name}`);
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  if (profileLoading || statsLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            {isOwnProfile ? (
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button onClick={handleFollow}>
                <UserPlus className="mr-2 h-4 w-4" />
                {profile.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-4 text-center text-muted-foreground">
              {profile.bio}
            </p>
          )}

          <div className="mt-4 flex items-center justify-center space-x-4">
            {profile.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.location}
              </div>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <LinkIcon className="mr-1 h-4 w-4" />
                Website
              </a>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              Joined {new Date(profile.joinedDate).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Your activity overview</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats?.prayers.total}</p>
            <p className="text-sm text-muted-foreground">Prayers Tracked</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats?.quran.versesRead}</p>
            <p className="text-sm text-muted-foreground">Verses Read</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stats?.community.posts}</p>
            <p className="text-sm text-muted-foreground">Posts Shared</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="likes">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No liked posts yet
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No bookmarked posts yet
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}