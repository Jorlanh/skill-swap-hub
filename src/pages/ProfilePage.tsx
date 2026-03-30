import { useEffect, useState } from 'react';
import { UserService, AchievementService, PostService } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, MoreHorizontal, Mail, Award, BookOpen, Layers } from 'lucide-react';
import SkillBadge from '@/components/SkillBadge';
import PostCard from '@/components/PostCard';
import RightSidebar from '@/components/RightSidebar';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const tabs = ['Publicações', 'Conquistas', 'Atividade', 'Destaque', 'Comunidades'];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Publicações');
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // 1. Busca dados do usuário logado
        const { data: userData } = await UserService.getMe();
        setUser(userData);

        // 2. Busca conquistas e posts em paralelo (Performance Jarvis)
        const [achRes, postsRes] = await Promise.all([
          AchievementService.getUserAchievements(userData.id),
          PostService.getAll() // No futuro: PostService.getByUser(userData.id)
        ]);

        setAchievements(achRes.data);
        setUserPosts(postsRes.data.filter((p: any) => p.userId === userData.id));
      } catch (error) {
        console.error("Erro na telemetria de perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="flex gap-6 max-w-5xl mx-auto p-4">
      <div className="flex-1 min-w-0">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <Avatar className="h-28 w-28 border-4 border-skillswap-teal ring-4 ring-skillswap-teal/10">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="text-2xl font-bold">{user?.username?.[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
                {user?.username}
                <VerifiedBadge user={user} size={22} />
              </h1>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted"><Mail size={16} /></Button>
                <Button variant="outline" size="sm" className="rounded-full font-bold px-6">Editar Perfil</Button>
              </div>
            </div>
            
            <p className="text-sm text-skillswap-teal font-semibold mb-2">@{user?.username?.toLowerCase()}</p>
            <p className="text-sm text-foreground mb-4 leading-relaxed">{user?.bio || "Ainda não definiu uma bio. Troque habilidades para se destacar!"}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full"><MapPin size={14} /> {user?.location || "Nébula Digital"}</span>
              <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full"><Calendar size={14} /> Membro desde {new Date(user?.createdAt).getFullYear()}</span>
            </div>

            <div className="flex gap-6 pt-2 border-t border-border/50">
              <div className="text-center">
                <p className="font-bold text-lg">{user?.completedSwaps || 0}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-tighter">Trocas</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{user?.swapCoins || 0}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-tighter">SwapCoins</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-48">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 flex items-center gap-1">
              <BookOpen size={12}/> Habilidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.map((s: any) => (
                <SkillBadge key={s.id} skill={s.name} />
              )) || <span className="text-xs text-muted-foreground italic">Nenhuma definida.</span>}
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="flex border-b border-border mb-6 overflow-x-auto sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'text-skillswap-teal border-skillswap-teal'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Conteúdo Dinâmico das Abas */}
        <div className="min-h-[400px]">
          {activeTab === 'Publicações' && (
            <div className="space-y-4">
              {userPosts.length > 0 ? (
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <EmptyState icon={<Layers />} message="Você ainda não publicou nada." />
              )}
            </div>
          )}

          {activeTab === 'Conquistas' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.length > 0 ? achievements.map((ach) => (
                <Card key={ach.id} className="overflow-hidden group hover:border-skillswap-teal transition-all">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="relative mb-3">
                       <Award size={48} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tighter">{ach.name}</span>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full"><EmptyState icon={<Award />} message="Nenhuma conquista desbloqueada ainda." /></div>
              )}
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

const EmptyState = ({ icon, message }: any) => (
  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-border">
    <div className="mb-4 opacity-20">{icon}</div>
    <p className="text-sm font-medium">{message}</p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="max-w-5xl mx-auto p-4 space-y-8 animate-pulse">
    <div className="h-48 bg-muted rounded-2xl" />
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  </div>
);

export default ProfilePage;