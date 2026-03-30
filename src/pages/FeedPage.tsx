import { useEffect, useState } from 'react';
import { HomeService } from '@/services/api';
import PostCard from '@/components/PostCard';
import RightSidebar from '@/components/RightSidebar';
import { ChevronRight, BrainCircuit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const FeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const { data } = await HomeService.getTrending();
        
        // Garantir que data é um array antes de ordenar
        const safeData = Array.isArray(data) ? data : [];

        // Algoritmo ELOS: Ordenar por (Likes + Comments + Shares + Reposts)
        const sortedPosts = safeData.sort((a: any, b: any) => {
          const scoreA = (a.likesCount || 0) + (a.commentsCount || 0) + (a.sharesCount || 0) + (a.repostsCount || 0);
          const scoreB = (b.likesCount || 0) + (b.commentsCount || 0) + (b.sharesCount || 0) + (b.repostsCount || 0);
          return scoreB - scoreA;
        });

        setPosts(sortedPosts);
      } catch (error) {
        console.error("Erro ao conectar com o reator backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeed();
  }, []);

  return (
    <div className="flex gap-6 max-w-5xl mx-auto p-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-foreground">Em alta</h2>
          <span className="text-[10px] bg-skillswap-teal/10 text-skillswap-teal px-2 py-1 rounded flex items-center gap-1 font-bold">
            <BrainCircuit size={12} /> ALGORITMO ELOS ATIVO
          </span>
        </div>

        {/* Trending Horizontal */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
           {/* Espaço reservado para Stories/Trends */}
        </div>

        {/* Posts Reais */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.postId || post.id || Math.random()} 
                post={{
                  ...post,
                  // Mapeamento de emergência: se o Java manda 'user', o front usa como 'author'
                  author: post.user || post.author || { name: "Usuário", avatar: "" }
                }} 
              />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum post encontrado no radar.
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default FeedPage;