import { Link } from 'react-router-dom';
import { Search, Home, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { currentUser } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-skillswap-teal flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground">SkillSwap</span>
        </Link>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Input
              placeholder="Buscar por..."
              className="pr-10 bg-muted border-border rounded-full"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            <Home className="h-6 w-6" />
          </Link>
          <Link to="/atividades" className="text-foreground hover:text-primary transition-colors">
            <Bell className="h-6 w-6" />
          </Link>
          <Link to="/perfil">
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
