import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Cambio de ruta técnica
import { Heart, FolderKanban, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AliadoHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats] = useState({ 
    totalDonaciones: 0, 
    montoDonado: 0, 
    proyectosApoyados: 0, 
    pendientes: 0 
  });

  const cards = [
    { label: 'Total donado', value: `$${stats.montoDonado.toLocaleString('es-CO')}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Donaciones', value: stats.totalDonaciones, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Proyectos apoyados', value: stats.proyectosApoyados, icon: FolderKanban, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pendientes', value: stats.pendientes, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-1">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Bienvenido a tu cuenta
        </h1>
        <p className="text-slate-500">
          {user?.nombre ? `Hola, ${user.nombre}. ` : ''}Resumen de tu actividad como aliado.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/aliado/donar')} 
          className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-500 hover:shadow-md transition-all text-left group"
        >
          <Heart className="w-8 h-8 text-rose-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Hacer una donación</h3>
          <p className="text-sm text-slate-500">Apoya un proyecto o dona libremente</p>
        </button>
        
        <button 
          onClick={() => navigate('/aliado/proyectos')} 
          className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <FolderKanban className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Ver proyectos</h3>
          <p className="text-sm text-slate-500">Conoce los proyectos activos de la fundación</p>
        </button>
      </div>
    </div>
  );
};

export default AliadoHome;