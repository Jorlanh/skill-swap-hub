import { Link } from 'react-router-dom';
import { Search, Home, Bell, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { UserService } from '@/services/api';

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Protocolo de recuperação de identidade
    if (token && token !== "null") {
      UserService.getMe() 
        .then(res => setUser(res.data))
        .catch(() => {
          console.warn("Sessão inválida. Limpando reatores...");
          setUser(null);
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const handleLogin = () => {
    // CORREÇÃO TÁTICA: 
    // Em vez de ir direto para o domínio do Auth0, enviamos para o Spring Boot (8080).
    // O Spring iniciará o fluxo OAuth2 com as credenciais seguras que configuramos no properties.
    const authUrl = import.meta.env.VITE_AUTH_URL;
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      console.error("Erro: VITE_AUTH_URL não definida no .env");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-skillswap-teal flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">SkillSwap</span>
        </Link>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Input
              placeholder="Buscar mestre em..."
              className="pr-10 bg-muted border-border rounded-full focus-visible:ring-skillswap-teal"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" title="Home" className="text-foreground hover:text-skillswap-teal transition-all">
            <Home className="h-6 w-6" />
          </Link>
          <Link to="/atividades" title="Notificações" className="text-foreground hover:text-skillswap-teal transition-all">
            <Bell className="h-6 w-6" />
          </Link>

          {user ? (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
              <Link to="/perfil">
                <Avatar className="h-9 w-9 border-2 border-skillswap-teal hover:scale-110 transition-transform">
                  <AvatarImage src={user.avatarUrl || user.profilePicture || "/default-avatar.png"} />
                  <AvatarFallback className="bg-muted font-bold">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-[10px] uppercase font-black text-muted-foreground hover:text-destructive transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 bg-skillswap-teal text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-teal-700 shadow-md transition-all active:scale-95"
            >
              <LogIn size={16} /> Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;