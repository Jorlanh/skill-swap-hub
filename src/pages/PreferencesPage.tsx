import { Switch } from '@/components/ui/switch';
import { ChevronRight, Mail, Bell, Moon, Contrast, Type } from 'lucide-react';

const PreferencesPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-skillswap-card-bg rounded-2xl p-6">
        {/* Notifications */}
        <h2 className="font-display font-semibold text-foreground mb-4">Notificações</h2>
        <div className="space-y-2 mb-8">
          <button className="w-full flex items-center justify-between bg-muted rounded-xl px-4 py-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-foreground" />
              <span className="text-sm font-semibold text-foreground">Preferências de E-mail</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
          <button className="w-full flex items-center justify-between bg-muted rounded-xl px-4 py-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="text-sm font-semibold text-foreground">Notificação do Aplicativo</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Display */}
        <h2 className="font-display font-semibold text-foreground mb-4">Exibição e Interface</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-foreground" />
              <span className="text-sm font-semibold text-foreground">Modo Escuro</span>
            </div>
            <Switch />
          </div>
          <button className="w-full flex items-center justify-between bg-muted rounded-xl px-4 py-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-3">
              <Contrast className="h-5 w-5 text-foreground" />
              <span className="text-sm font-semibold text-foreground">Tema personalizado</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
          <button className="w-full flex items-center justify-between bg-muted rounded-xl px-4 py-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-3">
              <Type className="h-5 w-5 text-foreground" />
              <span className="text-sm font-semibold text-foreground">Tamanho da fonte</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
