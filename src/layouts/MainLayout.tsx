import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 min-h-[calc(100vh-57px)] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
