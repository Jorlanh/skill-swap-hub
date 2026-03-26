import { useState } from 'react';
import { mockUsers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RatingStars from '@/components/RatingStars';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Trophy } from 'lucide-react';

const skills = ['Ranking Geral', 'Java', 'Culinária', 'Jardinagem', 'Cerâmica', 'Guitarra', 'Bordado', 'Turco'];

const mockRankings = mockUsers
  .filter((u) => u.helpedCount || u.isVerified)
  .concat(mockUsers.slice(0, 5))
  .slice(0, 10)
  .map((u, i) => ({
    user: u,
    avgStars: Math.round((5 - i * 0.3) * 10) / 10,
    totalRatings: Math.max(10, 200 - i * 18),
    position: i + 1,
  }));

const RankingsPage = () => {
  const [selectedSkill, setSelectedSkill] = useState('Ranking Geral');

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          <Trophy className="h-6 w-6 text-skillswap-gold" /> Rankings
        </h1>
        <Select value={selectedSkill} onValueChange={setSelectedSkill}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {skills.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {mockRankings.map(({ user, avgStars, totalRatings, position }) => (
          <div
            key={user.id + position}
            className={`flex items-center gap-4 rounded-xl px-4 py-3 border border-border transition-colors ${
              position <= 3 ? 'bg-skillswap-card-bg' : 'bg-card'
            }`}
          >
            <span className={`font-display font-bold text-lg w-8 text-center ${
              position === 1 ? 'text-skillswap-gold' : position <= 3 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {position}º
            </span>
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-semibold text-foreground truncate">{user.username}</h3>
                {user.isVerified && <VerifiedBadge size={16} />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <RatingStars value={Math.round(avgStars)} readOnly size={14} />
                <span className="text-xs text-muted-foreground">{avgStars.toFixed(1)}</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">{totalRatings} avaliações</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingsPage;
