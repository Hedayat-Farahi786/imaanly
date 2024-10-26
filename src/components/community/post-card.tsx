import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Share2,
  Bookmark,
  Flag,
  Pencil,
  Trash,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PostCardProps {
  post: {
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
    replyTo?: {
      id: string;
      author: {
        username: string;
      };
    };
  };
  currentUserId?: string;
  onDelete?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
}

export default function PostCard({ post, currentUserId, onDelete, onLike, onComment }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.(post.id);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    onComment?.(post.id, comment);
    setComment('');
    toast.success('Comment added');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        text: `${post.content}\n\nShared from ${window.location.origin}`,
        url: `${window.location.origin}/post/${post.id}`,
      });
    } catch (error) {
      toast.error('Unable to share post');
    }
  };

  const handleDelete = () => {
    onDelete?.(post.id);
    toast.success('Post deleted');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/profile/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {currentUserId === post.author.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDelete}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {post.replyTo && (
          <p className="text-sm text-muted-foreground">
            Replying to @{post.replyTo.author.username}
          </p>
        )}
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.images && post.images.length > 0 && (
          <div className="grid gap-2 grid-cols-2">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleLike}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isLiked && "fill-primary text-primary"
                )}
              />
              {likesCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              post.bookmarked && "text-primary"
            )}
          >
            <Bookmark className={cn(
              "h-4 w-4",
              post.bookmarked && "fill-current"
            )} />
          </Button>
        </div>

        {showComments && (
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={handleComment}>Post</Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}