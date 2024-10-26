import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PostCard from '@/components/community/post-card';
import CreatePostDialog from '@/components/community/create-post-dialog';
import UserCard from '@/components/community/user-card';
import { mockApi } from '@/lib/mock-api';

const suggestedUsers = [
  {
    id: '2',
    name: 'Aisha Rahman',
    username: 'aisha',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    bio: 'Sharing Islamic knowledge and daily reflections',
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Omar Khan',
    username: 'omar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    bio: 'Student of knowledge | Sharing Quranic insights',
    isFollowing: true,
  },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => mockApi.getPosts(),
  });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow Muslims and share your journey
            </p>
          </div>
          <CreatePostDialog />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts and people..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              <TabsContent value="feed" className="space-y-4 mt-0">
                {isLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      Loading posts...
                    </CardContent>
                  </Card>
                ) : posts?.posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No posts yet</p>
                      <Button variant="link" className="mt-2">
                        Create your first post
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  posts?.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="following" className="mt-0">
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Follow some users to see their posts here
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discover" className="mt-0">
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Discover new content and users
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Connections</CardTitle>
                  <CardDescription>
                    People you might want to follow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestedUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Groups</CardTitle>
                  <CardDescription>
                    Join discussions on various topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    Islamic History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    Quran Study Circle
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    New Muslims
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </section>
    </div>
  );
}