import { mockNotifications } from '@/data/mockData';
import NotificationItem from '@/components/NotificationItem';
import { Home, Flame, ChevronRight } from 'lucide-react';

const ActivitiesPage = () => {
  return (
    <div className="flex gap-6 max-w-5xl mx-auto">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-6">
          <Home className="h-6 w-6 text-foreground" />
          <h1 className="font-display font-bold text-2xl text-foreground">Início</h1>
        </div>

        <div className="space-y-0">
          {mockNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>

      {/* Viral communities sidebar */}
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-display font-semibold text-foreground mb-4">Comunidades virais</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Flame className="h-5 w-5 text-orange-500" />
                <ChevronRight className="h-5 w-5 text-foreground" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ActivitiesPage;
