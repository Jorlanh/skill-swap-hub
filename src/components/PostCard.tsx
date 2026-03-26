import type { Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Repeat2, ArrowUp, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
}

const formatNumber = (n: number) => {
  if (n >= 1000) return `${Math.floor(n / 1000)} mil`;
  return n.toString();
};

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            {post.community && (
              <p className="text-xs text-muted-foreground">{post.community}</p>
            )}
            <p className="text-sm font-semibold text-foreground">{post.author.username}</p>
            <p className="text-xs text-muted-foreground">{post.author.handle}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-skillswap-teal text-primary-foreground border-none text-xs hover:opacity-90">
          Juntar-se
        </Button>
      </div>

      <p className="text-sm text-foreground mb-3">{post.content}</p>

      {post.image && (
        <div className="rounded-lg overflow-hidden mb-3">
          <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-6 pt-2 border-t border-border">
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.comments)}</span>
        </button>
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Repeat2 className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.shares)}</span>
        </button>
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowUp className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.upvotes)}</span>
        </button>
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Share className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.reposts)}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
