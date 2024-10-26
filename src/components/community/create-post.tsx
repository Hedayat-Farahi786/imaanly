import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Image, Send, X } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostProps {
  onPost: (content: string, images: File[]) => void;
  replyTo?: {
    id: string;
    author: {
      username: string;
    };
  };
}

export default function CreatePost({ onPost, replyTo }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      toast.error('You can only upload up to 4 images');
      return;
    }

    setImages([...images, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newPreviews[index] && URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return;

    onPost(content, images);
    setIsOpen(false);
    setContent('');
    setImages([]);
    setPreviews([]);
    toast.success('Post created successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{replyTo ? 'Reply' : 'Create Post'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{replyTo ? 'Reply to Post' : 'Create Post'}</DialogTitle>
          <DialogDescription>
            {replyTo ? `Replying to @${replyTo.author.username}` : 'Share your thoughts with the community'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="rounded-lg object-cover w-full h-32"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={images.length >= 4}
              >
                <Image className="h-4 w-4" />
              </Button>
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
            <Button onClick={handleSubmit} disabled={!content.trim() && images.length === 0}>
              <Send className="mr-2 h-4 w-4" />
              {replyTo ? 'Reply' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}