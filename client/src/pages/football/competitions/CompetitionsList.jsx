import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Trophy, Calendar } from 'lucide-react';
import { competitionAPI } from '@/api';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils';

const TYPES = ['championnat', 'coupe', 'supercoupe'];

export default function CompetitionsList() {
  const [competitions, setCompetitions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type_competition: '', statut: '' });
  const { user } = useAuthStore();

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const response = await competitionAPI.getAll({ page: pagination.page, limit: pagination.limit, search, ...filters });
      setCompetitions(response.data.data.competitions);
      setPagination(prev => ({ ...prev, ...response.data.data.pagination }));
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, [pagination.page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCompetitions();
  };

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétition?')) return;
    try {
      await competitionAPI.delete(id);
      fetchCompetitions();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getTypeLabel = (type) => {
    const labels = { championnat: 'Championnat', coupe: 'Coupe', supercoupe: 'Supercoupe' };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compétitions</h1>
          <p className="text-slate-500">Gestion des compétitions</p>
        </div>
        {canEdit && (
          <Link to="/competitions/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <Plus className="w-4 h-4" />
            Nouvelle compétition
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une compétition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filters.type_competition}
            onChange={(e) => setFilters(prev => ({ ...prev, type_competition: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les types</option>
            {TYPES.map(type => <option key={type} value={type}>{getTypeLabel(type)}</option>)}
          </select>
          <select
            value={filters.statut}
            onChange={(e) => setFilters(prev => ({ ...prev, statut: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Active</option>
            <option value="cloturee">Clôturée</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
            Rechercher
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Compétition</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Saison</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Équipes</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Période</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Chargement...</td></tr>
              ) : competitions.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Aucune compétition trouvée</td></tr>
              ) : (
                competitions.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{comp.nom_competition}</p>
                          <p className="text-sm text-slate-500">{comp.format_competition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{getTypeLabel(comp.type_competition)}</td>
                    <td className="px-4 py-3 text-slate-600">{comp.saison}</td>
                    <td className="px-4 py-3 text-slate-600">{comp.nombre_equipes || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {formatDate(comp.date_debut)} - {formatDate(comp.date_fin)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${comp.statut === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {comp.statut === 'active' ? 'Active' : 'Clôturée'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/competitions/${comp.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <>
                            <Link to={`/competitions/${comp.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(comp.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
          >
            Précédent
          </button>
          <span className="text-sm text-slate-600">Page {pagination.page} sur {pagination.totalPages}</span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}