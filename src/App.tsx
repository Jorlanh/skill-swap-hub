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
import NotFound from "./pages/NotFound.tsx";
import AdminConsole from "@/pages/AdminConsole";
import OAuth2RedirectHandler from "@/components/auth/OAuth2RedirectHandler"; // IMPORTADO
import { ChatbotELOS } from "@/components/ChatbotELOS"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<FeedPage />} />
            {/* ROTA DE CALLBACK OAUTH2 */}
            <Route path="/oauth2/callback" element={<OAuth2RedirectHandler />} />
            
            <Route path="/mensagens" element={<ChatPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
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
        <ChatbotELOS /> 
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;