import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Repeat2, ArrowUp, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: any; 
}

const formatNumber = (n: number | undefined | null) => {
  if (n === undefined || n === null) return "0";
  if (n >= 1000) return `${Math.floor(n / 1000)} mil`;
  return n.toString();
};

const PostCard = ({ post }: PostCardProps) => {
  // Mapeamento dinâmico: Prioriza 'user' (do Java) ou 'author' (do Types)
  const author = post.user || post.author || { username: 'Usuário', avatar: '' };
  
  // Tratamento de objeto de comunidade para evitar o crash "Objects are not valid as a React child"
  const renderCommunityName = () => {
    if (!post.community) return null;
    if (typeof post.community === 'object') {
      return post.community.name || post.community.title || "Comunidade";
    }
    return post.community;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar || author.imageUrl || "/default-avatar.png"} />
            <AvatarFallback>{author.username ? author.username[0].toUpperCase() : '?'}</AvatarFallback>
          </Avatar>
          <div>
            {post.community && (
              <p className="text-xs text-muted-foreground font-medium">
                {renderCommunityName()}
              </p>
            )}
            <p className="text-sm font-semibold text-foreground">{author.name || author.username}</p>
            <p className="text-xs text-muted-foreground">@{author.username?.toLowerCase()}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-skillswap-teal text-primary-foreground border-none text-xs hover:opacity-90">
          Juntar-se
        </Button>
      </div>

      <div className="mb-3">
        {post.title && <h3 className="font-bold text-base mb-1">{post.title}</h3>}
        <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
      </div>

      {(post.imageUrl || post.image) && (
        <div className="rounded-lg overflow-hidden mb-3 border border-border">
          <img src={post.imageUrl || post.image} alt="Post content" className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-6 pt-2 border-t border-border">
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.commentsCount)}</span>
        </button>
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Repeat2 className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.repostsCount)}</span>
        </button>
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowUp className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.likesCount)}</span>
        </button>
        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Share className="h-4 w-4" />
          <span className="text-xs">{formatNumber(post.sharesCount)}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;