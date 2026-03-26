import { currentUser, mockPosts } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, MoreHorizontal, Mail } from 'lucide-react';
import SkillBadge from '@/components/SkillBadge';
import PostCard from '@/components/PostCard';
import RightSidebar from '@/components/RightSidebar';
import { useState } from 'react';

const tabs = ['Publicações', 'Conquistas', 'Atividade', 'Destaque', 'Comunidades'];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Publicações');

  return (
    <div className="flex gap-6 max-w-5xl mx-auto">
      <div className="flex-1 min-w-0">
        {/* Profile header */}
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display font-bold text-xl text-foreground">{currentUser.username}</h1>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">Editar</Button>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{currentUser.handle}</p>
            <p className="text-sm text-foreground mb-3">{currentUser.bio}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {currentUser.location}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Desde {currentUser.joinDate}</span>
            </div>
            <div className="flex gap-4 text-sm">
              <span><strong className="text-foreground">{currentUser.following}</strong> <span className="text-muted-foreground">Seguindo</span></span>
              <span><strong className="text-foreground">{currentUser.followers}</strong> <span className="text-muted-foreground">Seguidores</span></span>
            </div>
          </div>

          {/* Skills */}
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-foreground mb-2">Habilidades</h3>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {currentUser.skills.map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-foreground border-foreground'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {mockPosts.filter(p => p.author.handle === '@leonSilva').length > 0
            ? mockPosts.map((post) => <PostCard key={post.id} post={post} />)
            : mockPosts.map((post) => <PostCard key={post.id} post={post} />)
          }
        </div>
      </div>

      <RightSidebar />
    </div>
  );
};

export default ProfilePage;
