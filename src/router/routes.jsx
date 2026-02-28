import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext"; // Ajustado: estaba en ./ y es ../
import Navbar from "../components/layout/Navbar"; // Ajustado: estaba en @/ o ./
import Footer from "../components/layout/Footer"; // Ajustado

// Páginas - Todas ajustadas a ../pages para salir de la carpeta router
import Index from "../pages/Index";
import Convocatorias from "../pages/Convocatorias";
import ConvocatoriaDetalle from "../pages/ConvocatoriaDetalle";
import Oportunidades from "../pages/Oportunidades";
import OportunidadDetalle from "../pages/OportunidadDetalle";
import Parchate from "../pages/Parchate";
import ActividadDetalle from "../pages/ActividadDetalle";
import Noticias from "../pages/Noticias";
import NoticiaDetalle from "../pages/NoticiaDetalle";
import QuienesSomos from "../pages/QuienesSomos";
import QueHacemos from "../pages/QueHacemos";
import Contacto from "../pages/Contacto";
import Donar from "../pages/Donar";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

// Admin - Ajustadas a ../
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome";
import AdminProyectos from "../pages/admin/AdminProyectos";
import AdminConvocatorias from "../pages/admin/AdminConvocatorias";
import AdminAliados from "../pages/admin/AdminAliados";
import AdminDonaciones from "../pages/admin/AdminDonaciones";
import AdminPerfil from "../pages/admin/AdminPerfil";

// Aliado - Ajustadas a ../
import AliadoLayout from "../components/aliado/AliadoLayout";
import AliadoHome from "../pages/aliado/AliadoHome";
import AliadoPerfil from "../pages/aliado/AliadoPerfil";
import AliadoDonaciones from "../pages/aliado/AliadoDonaciones";
import AliadoProyectos from "../pages/aliado/AliadoProyectos";
import AliadoDonar from "../pages/aliado/AliadoDonar";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

const PublicLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAliado = location.pathname.startsWith('/aliado');
  const isAuth = ['/login', '/registro'].includes(location.pathname);
  const hideChrome = isAdmin || isAliado || isAuth;

  return (
    <>
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/convocatorias" element={<Convocatorias />} />
        <Route path="/convocatorias/:id" element={<ConvocatoriaDetalle />} />
        <Route path="/oportunidades" element={<Oportunidades />} />
        <Route path="/oportunidades/:id" element={<OportunidadDetalle />} />
        <Route path="/parchate" element={<Parchate />} />
        <Route path="/parchate/:id" element={<ActividadDetalle />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/que-hacemos" element={<QueHacemos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/donar" element={<Donar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rutas de Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="proyectos" element={<AdminProyectos />} />
          <Route path="convocatorias" element={<AdminConvocatorias />} />
          <Route path="aliados" element={<AdminAliados />} />
          <Route path="donaciones" element={<AdminDonaciones />} />
          <Route path="perfil" element={<AdminPerfil />} />
        </Route>

        {/* Rutas de Aliado */}
        <Route path="/aliado" element={<AliadoLayout />}>
          <Route index element={<AliadoHome />} />
          <Route path="perfil" element={<AliadoPerfil />} />
          <Route path="donaciones" element={<AliadoDonaciones />} />
          <Route path="proyectos" element={<AliadoProyectos />} />
          <Route path="donar" element={<AliadoDonar />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PublicLayout />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;