import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import AliadoSidebar from './AliadoSidebar';
import AliadoTopbar from './AliadoTopbar';
import { SidebarProvider } from '@/components/ui/sidebar';

const AliadoLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'donante_aliado') return <Navigate to="/dashboard" replace />;
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AliadoSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AliadoTopbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
};
export default AliadoLayout;
