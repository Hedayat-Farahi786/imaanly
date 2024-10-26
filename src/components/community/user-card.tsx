import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
    isFollowing: boolean;
  };
}

export default function UserCard({ user }: UserCardProps) {
  const handleFollow = () => {
    // API call to follow/unfollow user
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <Link
            to={`/profile/${user.username}`}
            className="font-semibold hover:underline"
          >
            {user.name}
          </Link>
          <p className="text-sm text-muted-foreground">{user.bio}</p>
        </div>
      </div>
      <Button
        variant={user.isFollowing ? "secondary" : "default"}
        size="sm"
        onClick={handleFollow}
      >
        {user.isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}