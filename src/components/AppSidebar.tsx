import { NavLink } from '@/components/NavLink';
import {
  User, MessageSquare, FileText, Settings, Sun, BookOpen, DollarSign, Home, Users, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const sidebarLinks = [
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

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-52 pt-20 lg:pt-6 px-2 
        bg-card border-r border-border transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              activeClassName="bg-muted text-foreground font-medium"
              onClick={() => setMobileOpen(false)}
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
