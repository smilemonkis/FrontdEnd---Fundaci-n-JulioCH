import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { SidebarProvider } from '@/components/ui/sidebar';

const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!isAuthenticated || !user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
};
export default AdminLayout;
