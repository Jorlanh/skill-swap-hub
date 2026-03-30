import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserService, AchievementService, PostService, ProfileService } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Mail, Award, BookOpen, Layers, Users, Edit3, Camera, Lock, Unlock, Send, Star, GraduationCap, Image as ImageIcon, Trash2 } from 'lucide-react';
import SkillBadge from '@/components/SkillBadge';
import PostCard from '@/components/PostCard';
import RightSidebar from '@/components/RightSidebar';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const tabs = ['Publicações', 'Cursos', 'Conquistas', 'Atividade', 'Comunidades'];

const ProfilePage = () => {
  const { username: urlUsername } = useParams(); 
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Publicações');
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Estados de Edição
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado de Habilidades
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      // 1. Busca meus dados para saber quem sou
      const { data: meData } = await UserService.getMe();
      const myId = meData.userId || meData.id;
      
      let targetUser;

      // 2. Define o alvo (se não houver username na URL, é o meu perfil)
      if (!urlUsername || urlUsername === meData.username) {
        targetUser = meData;
        setIsOwnProfile(true);
        if (!urlUsername) navigate(`/perfil/${meData.username}`, { replace: true });
      } else {
        setIsOwnProfile(false);
        // Busca perfil público via ProfileService (Conecta com @GetMapping("/user/{userId}") ou similar)
        const { data: publicProfile } = await ProfileService.get(urlUsername);
        targetUser = publicProfile;
      }

      setUser(targetUser);
      const targetId = targetUser.userId || targetUser.id;

      // Sincroniza campos de edição
      setEditName(targetUser.name || "");
      setEditUsername(targetUser.username || "");
      setEditBio(targetUser.profile?.description || targetUser.bio || "");
      setEditLocation(targetUser.profile?.location || targetUser.location || "");
      setIsPrivate(targetUser.profile?.isPrivate || false);
      setSkillsList(targetUser.skills?.map((s: any) => s.name) || []);

      // 3. Busca Dados Relacionados do Banco Real
      if (targetId) {
        const [achRes, postsRes] = await Promise.allSettled([
          AchievementService.getUserAchievements(targetId),
          PostService.getAll() 
        ]);

        if (achRes.status === 'fulfilled') setAchievements(achRes.value.data || []);
        
        if (postsRes.status === 'fulfilled') {
          // Filtra no frontend apenas o que pertence ao ID do perfil carregado
          const allPosts = Array.isArray(postsRes.value.data) ? postsRes.value.data : [];
          setUserPosts(allPosts.filter((p: any) => (p.user?.userId === targetId || p.userId === targetId)));
        }
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      toast.error("Não foi possível conectar com o banco de dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProfileData(); }, [urlUsername]);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skillsList.includes(skillInput.trim())) {
        setSkillsList([...skillsList, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      await UserService.updateProfile({ 
        name: editName,
        username: editUsername,
        description: editBio, 
        location: editLocation,
        skills: skillsList 
      });
      
      toast.success("Perfil sincronizado no PostgreSQL!");
      setIsEditing(false);
      
      if (editUsername !== user.username) {
        navigate(`/perfil/${editUsername}`);
      } else {
        loadProfileData();
      }
    } catch (error) {
      toast.error("Erro ao salvar alterações no servidor.");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const loading = toast.loading("Enviando imagem para o banco...");
        await UserService.updateAvatar(e.target.files[0]);
        toast.dismiss(loading);
        toast.success("Avatar atualizado!");
        loadProfileData();
      } catch (error) {
        toast.error("Erro no upload.");
      }
    }
  };

  const togglePrivacy = async () => {
    try {
      const newStatus = !isPrivate;
      await UserService.togglePrivacy(newStatus);
      setIsPrivate(newStatus);
      toast.success(newStatus ? "Privacidade Ativada" : "Perfil Público");
    } catch (error) {
      toast.error("Erro ao alterar privacidade.");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      await PostService.create(formData);
      setNewPostContent("");
      toast.success("Publicado com sucesso!");
      loadProfileData(); 
    } catch (error) {
      toast.error("Erro ao salvar postagem.");
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="flex gap-6 max-w-5xl mx-auto p-4">
      <div className="flex-1 min-w-0">
        
        {/* CABEÇALHO INTEGRADO */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="relative group shrink-0">
            <Avatar className="h-28 w-28 border-4 border-skillswap-teal ring-4 ring-skillswap-teal/10">
              <AvatarImage src={user?.profile?.imageUrl || user?.avatarUrl} />
              <AvatarFallback className="text-3xl font-bold bg-muted">{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-card border-border">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mr-2 h-4 w-4" /> <span>Atualizar foto</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" /> <span>Remover foto</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
          </div>
          
          <div className="flex-1 w-full min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2 truncate">
                {user?.name || user?.username}
                <VerifiedBadge user={user} size={22} />
              </h1>
              
              <div className="flex gap-2 shrink-0">
                {!isOwnProfile && <Button variant="outline" size="sm" className="rounded-full font-bold px-4 border-skillswap-teal text-skillswap-teal">Seguir</Button>}
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted"><Mail size={16} /></Button>
                
                {isOwnProfile && (
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full font-bold px-4 flex gap-2 border-skillswap-teal text-skillswap-teal">
                        <Edit3 size={14} /> Editar Perfil
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border-border bg-card max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                        <DialogDescription>Dados reais persistidos no PostgreSQL.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Nome</label>
                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Username</label>
                            <Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Habilidades (Enter)</label>
                          <Input placeholder="Ex: React, Java..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} />
                          <div className="flex flex-wrap gap-2 mt-2">
                            {skillsList.map((skill) => (
                              <span key={skill} className="bg-skillswap-teal/20 text-skillswap-teal px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-red-500 hover:text-white transition-colors" onClick={() => removeSkill(skill)}>
                                {skill} &times;
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Biografia</label>
                          <Textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className="resize-none" rows={3} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Localização</label>
                          <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {isPrivate ? <Lock size={16} className="text-skillswap-teal" /> : <Unlock size={16} />}
                            <span className="text-sm font-bold">Perfil Privado</span>
                          </div>
                          <Button variant={isPrivate ? "default" : "outline"} size="sm" onClick={togglePrivacy} className={isPrivate ? "bg-skillswap-teal" : ""}>
                            {isPrivate ? "Ativado" : "Desativado"}
                          </Button>
                        </div>
                      </div>
                      <Button onClick={handleSaveProfile} className="w-full bg-skillswap-teal hover:bg-teal-700 text-white font-bold h-12">Salvar no Banco</Button>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            
            <p className="text-sm text-skillswap-teal font-semibold mb-2">@{user?.username?.toLowerCase()}</p>
            <p className="text-sm text-foreground mb-4 leading-relaxed max-w-lg break-words italic">
              {user?.profile?.description || user?.bio || "Ainda não definiu uma bio no banco de dados."}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground mb-4">
              <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><MapPin size={12} /> {user?.profile?.location || user?.location || "Nárnia"}</span>
              <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><Calendar size={12} /> Membro Ativo</span>
            </div>

            <div className="flex gap-6 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="font-bold text-lg">{user?.followers || 0}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{user?.following || 0}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Seguindo</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-skillswap-teal">{user?.swapCoins || 0}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">SwapCoins</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-56 shrink-0 space-y-6">
            <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-4">Reputação</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1"><GraduationCap size={14} className="text-skillswap-teal"/> Professor</span>
                  <div className="flex items-center gap-1">{user?.ratings?.teacher || "0.0"} <Star size={12} className="fill-yellow-400 text-yellow-400" /></div>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1"><BookOpen size={14} className="text-skillswap-teal"/> Aluno</span>
                  <div className="flex items-center gap-1">{user?.ratings?.student || "0.0"} <Star size={12} className="fill-yellow-400 text-yellow-400" /></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 flex items-center gap-1"><Award size={12}/> Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.length > 0 ? user.skills.map((s: any) => (
                  <SkillBadge key={s.id || s.name} skill={s.name} />
                )) : <span className="text-[10px] text-muted-foreground">Nenhuma definida.</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ABAS */}
        <div className="flex border-b border-border mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-8 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab ? 'text-skillswap-teal border-skillswap-teal' : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FEED REAL */}
        <div className="min-h-[400px]">
          {activeTab === 'Publicações' && (
            <div className="space-y-4">
              {isOwnProfile && (
                <div className="bg-card rounded-2xl border border-border p-4 shadow-sm mb-6">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 shrink-0"><AvatarImage src={user?.avatarUrl} /></Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="Compartilhe um novo mestre..." className="resize-none border-transparent bg-muted/30 focus-visible:ring-1 min-h-[80px]" />
                      <div className="flex justify-end">
                        <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="bg-skillswap-teal hover:bg-teal-700 text-white font-bold px-6">Publicar <Send className="ml-2 h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {userPosts.length > 0 ? (
                userPosts.map((post) => <PostCard key={post.postId || post.id} post={post} />)
              ) : (
                <EmptyState icon={<Layers />} message="Nenhuma publicação no banco de dados." />
              )}
            </div>
          )}

          {activeTab === 'Cursos' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><EmptyState icon={<GraduationCap />} message="Nenhum curso registrado." /></div>}
          
          {activeTab === 'Conquistas' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.length > 0 ? achievements.map((ach) => (
                <Card key={ach.id} className="bg-card/50 border-border group hover:border-skillswap-teal transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-skillswap-teal/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {ach.imageUrl ? <img src={ach.imageUrl} className="w-10 h-10 object-contain" /> : <Award size={32} className="text-skillswap-teal" />}
                    </div>
                    <span className="text-sm font-bold">{ach.achievement?.name || "Mestre"}</span>
                  </CardContent>
                </Card>
              )) : <div className="col-span-full"><EmptyState icon={<Award />} message="Sem conquistas ainda." /></div>}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block w-80"><RightSidebar /></div>
    </div>
  );
};

const EmptyState = ({ icon, message }: any) => (
  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/50 rounded-2xl border border-border w-full">
    <div className="mb-4 opacity-30 scale-150">{icon}</div>
    <p className="text-sm font-bold">{message}</p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="max-w-5xl mx-auto p-4 space-y-6 flex gap-6">
    <div className="flex-1"><Skeleton className="h-56 bg-muted rounded-3xl animate-pulse" /><div className="mt-8 space-y-4"><Skeleton className="h-48 w-full rounded-2xl" /><Skeleton className="h-48 w-full rounded-2xl" /></div></div>
    <div className="hidden lg:block w-80"><Skeleton className="h-96 w-full rounded-3xl" /></div>
  </div>
);

export default ProfilePage;