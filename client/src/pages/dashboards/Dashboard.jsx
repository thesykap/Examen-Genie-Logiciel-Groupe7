import { useEffect } from 'react';
import { useAuthStore, useDashboardStore } from '@/store';
import { Users, Shirt, Trophy, Calendar, Activity, UserCheck } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value || '-'}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, description, path }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { stats, fetchStats, isLoading } = useDashboardStore();

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-500 animate-pulse">Chargement des statistiques...</div>
        </div>
      );
    }

    switch (user?.role) {
      case 'super_admin':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Super Admin</h1>
              <p className="text-slate-500 mt-1">Statistiques globales du système</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                icon={Users} 
                label="Utilisateurs" 
                value={stats?.utilisateurs_par_role?.reduce((sum, r) => sum + r.count, 0)}
                color="bg-blue-50 text-blue-600" 
              />
              <StatCard 
                icon={Shirt} 
                label="Clubs" 
                value={stats?.total_clubs} 
                color="bg-emerald-50 text-emerald-600" 
              />
              <StatCard 
                icon={Trophy} 
                label="Compétitions Actives" 
                value={stats?.total_competitions_actives} 
                color="bg-purple-50 text-purple-600" 
              />
              <StatCard 
                icon={Calendar} 
                label="Matchs à Venir" 
                value={stats?.matchs_a_venir} 
                color="bg-orange-50 text-orange-600" 
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Répartition par rôle</h2>
              <div className="space-y-3">
                {stats?.utilisateurs_par_role?.map((item) => (
                  <div key={item.role} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 capitalize">{item.role.replace('_', ' ')}</span>
                    <span className="text-sm font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RoleCard 
                icon={Users} 
                title="Gestion des Utilisateurs" 
                description="Ajouter, modifier, supprimer des utilisateurs et gérer les rôles"
                path="/admin/users"
              />
              <RoleCard 
                icon={Shirt} 
                title="Gestion des Clubs" 
                description="Gérer les clubs de football"
                path="/clubs"
              />
            </div>
          </div>
        );

      case 'admin_sportif':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin Sportif</h1>
              <p className="text-slate-500 mt-1">Gestion du football national</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Shirt} label="Clubs" value="3" color="bg-blue-50 text-blue-600" />
              <StatCard icon={Users} label="Joueurs" value="8" color="bg-green-50 text-green-600" />
              <StatCard icon={Trophy} label="Compétitions" value="2" color="bg-purple-50 text-purple-600" />
              <StatCard icon={Calendar} label="Matchs" value="3" color="bg-orange-50 text-orange-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RoleCard icon={Shirt} title="Clubs" description="Gérer les clubs" path="/clubs" />
              <RoleCard icon={Users} title="Joueurs" description="Gérer les joueurs" path="/joueurs" />
              <RoleCard icon={Trophy} title="Compétitions" description="Gérer les compétitions" path="/competitions" />
              <RoleCard icon={Calendar} title="Matchs" description="Gérer les matchs" path="/matchs" />
            </div>
          </div>
        );

      case 'responsable_club':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Responsable Club</h1>
              <p className="text-slate-500 mt-1">Gestion de votre club</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Users} label="Joueurs" value="0" color="bg-blue-50 text-blue-600" />
              <StatCard icon={Calendar} label="Matchs à venir" value="0" color="bg-green-50 text-green-600" />
              <StatCard icon={Activity} label="Dernière activité" value="-" color="bg-purple-50 text-purple-600" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Mon Club</h2>
              <p className="text-slate-500">Aucun club associé pour le moment.</p>
            </div>
          </div>
        );

      case 'arbitre':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Arbitre</h1>
              <p className="text-slate-500 mt-1">Vos matchs assignés</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Calendar} label="Matchs Assignés" value="0" color="bg-blue-50 text-blue-600" />
              <StatCard icon={Calendar} label="Matchs à venir" value="0" color="bg-green-50 text-green-600" />
              <StatCard icon={Activity} label="Matchs terminés" value="0" color="bg-purple-50 text-purple-600" />
            </div>
          </div>
        );

      case 'visiteur':
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Public</h1>
              <p className="text-slate-500 mt-1">Bienvenue sur le système de gestion du football</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Shirt} label="Clubs" value="3" color="bg-blue-50 text-blue-600" />
              <StatCard icon={Trophy} label="Compétitions" value="2" color="bg-purple-50 text-purple-600" />
              <StatCard icon={Calendar} label="Matchs" value="3" color="bg-orange-50 text-orange-600" />
              <StatCard icon={Trophy} label="Trophées" value="0" color="bg-yellow-50 text-yellow-600" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {renderDashboard()}
    </div>
  );
}
