import { mockPosts } from '@/data/mockData';
import PostCard from '@/components/PostCard';
import RightSidebar from '@/components/RightSidebar';
import { ChevronRight } from 'lucide-react';

const trendingImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1461896836934-bd45ba8c3e7c?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=300&h=200&fit=crop',
];

const FeedPage = () => {
  return (
    <div className="flex gap-6 max-w-5xl mx-auto">
      <div className="flex-1 min-w-0">
        {/* Trending */}
        <h2 className="font-display font-bold text-xl text-foreground mb-4">Em alta</h2>
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {trendingImages.map((img, i) => (
            <div key={i} className="relative shrink-0 w-40 h-28 rounded-xl overflow-hidden">
              <img src={img} alt="Trending" className="w-full h-full object-cover" />
            </div>
          ))}
          <button className="shrink-0 flex items-center justify-center w-10 h-28 bg-muted rounded-xl">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select className="text-sm bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground">
            <option>Ordenar por</option>
          </select>
          <select className="text-sm bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground">
            <option>País</option>
          </select>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
};

export default FeedPage;
