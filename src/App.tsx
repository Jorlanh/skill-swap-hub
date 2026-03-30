import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/layouts/MainLayout";
import FeedPage from "@/pages/FeedPage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import SearchPage from "@/pages/SearchPage";
import CommunitiesPage from "@/pages/CommunitiesPage";
import FinancePage from "@/pages/FinancePage";
import ActivitiesPage from "@/pages/ActivitiesPage";
import ProposalsPage from "@/pages/ProposalsPage";
import PreferencesPage from "@/pages/PreferencesPage";
import SettingsPage from "@/pages/SettingsPage";
import CoursesPage from "@/pages/CoursesPage";
import RankingsPage from "@/pages/RankingsPage";
import NotFound from "./pages/NotFound";
import AdminConsole from "@/pages/AdminConsole";
import { ChatbotELOS } from "@/components/ChatbotELOS"; 
import AuthPage from "@/pages/AuthPage";
import { requestNotificationPermission, onMessageListener } from './lib/messaging';

const queryClient = new QueryClient();

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Usamos um estado para o auth para que o componente re-renderize ao logar/deslogar
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Listener para mudanças no localStorage (caso o login aconteça em outra aba ou via evento)
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    
    if (isAuthenticated) {
      requestNotificationPermission();
      onMessageListener();
    }
    
    return () => window.removeEventListener('storage', checkAuth);
  }, [isAuthenticated]);

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      action();
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors />
        {/* Ativação das flags do v7 para limpar o console */}
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          
          {showAuthModal && (
            <AuthPage isModal onClose={() => setShowAuthModal(false)} />
          )}

          <Routes>
            <Route path="/login" element={<AuthPage />} />
            
            <Route element={<MainLayout requireAuth={requireAuth} />}>
              <Route path="/" element={<FeedPage />} />
              <Route path="/mensagens" element={<ChatPage />} />
              
              {/* Rota dinâmica calibrada para o ProfilePage que corrigimos */}
              <Route path="/perfil/:username?" element={<ProfilePage />} />
              
              <Route path="/busca" element={<SearchPage />} />
              <Route path="/comunidades" element={<CommunitiesPage />} />
              <Route path="/financeiro" element={<FinancePage />} />
              <Route path="/atividades" element={<ActivitiesPage />} />
              <Route path="/propostas" element={<ProposalsPage />} />
              <Route path="/preferencias" element={<PreferencesPage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
              <Route path="/cursos" element={<CoursesPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/uniaosinistrabahvas" element={<AdminConsole />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>

          {isAuthenticated && <ChatbotELOS />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;