import { NavLink } from '@/components/NavLink';
import {
  User, MessageSquare, FileText, Settings, Sun, BookOpen, DollarSign, Home, Users, Menu, X, Trophy
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const sidebarLinks = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/rankings', label: 'Rankings', icon: Trophy },
  { to: '/perfil', label: 'Perfil', icon: User },
  { to: '/mensagens', label: 'Mensagens', icon: MessageSquare },
  { to: '/propostas', label: 'Propostas', icon: FileText },
  { to: '/comunidades', label: 'Comunidades', icon: Users },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
  { to: '/preferencias', label: 'Preferências', icon: Sun },
  { to: '/cursos', label: 'Meus cursos', icon: BookOpen },
  { to: '/financeiro', label: 'Financeiro', icon: DollarSign },
];

const AppSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, visible on desktop */}
      <aside className={`
        hidden lg:block sticky top-0 left-0 z-40 h-screen w-52 pt-6 px-2 
        bg-card border-r border-border
      `}>
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              activeClassName="bg-muted text-foreground font-medium"
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
