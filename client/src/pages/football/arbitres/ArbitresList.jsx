import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, User } from 'lucide-react';
import { arbitreAPI } from '@/api';
import { useAuthStore } from '@/store';

const CATEGORIES = ['National', 'Regional', 'Departemental'];

export default function ArbitresList() {
  const [arbitres, setArbitres] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ categorie: '', region: '' });
  const { user } = useAuthStore();

  const fetchArbitres = async () => {
    setLoading(true);
    try {
      const response = await arbitreAPI.getAll({ page: pagination.page, limit: pagination.limit, search, ...filters });
      setArbitres(response.data.data.arbitres);
      setPagination(prev => ({ ...prev, ...response.data.data.pagination }));
    } catch (error) {
      console.error('Error fetching arbitres:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArbitres();
  }, [pagination.page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchArbitres();
  };

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet arbitre?')) return;
    try {
      await arbitreAPI.delete(id);
      fetchArbitres();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Arbitres</h1>
          <p className="text-slate-500">Gestion des arbitres</p>
        </div>
        {canEdit && (
          <Link to="/arbitres/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <Plus className="w-4 h-4" />
            Nouvel arbitre
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un arbitre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filters.categorie}
            onChange={(e) => setFilters(prev => ({ ...prev, categorie: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Arbitre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Licence</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Région</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Chargement...</td></tr>
              ) : arbitres.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucun arbitre trouvé</td></tr>
              ) : (
                arbitres.map((arbitre) => (
                  <tr key={arbitre.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{arbitre.nom} {arbitre.postnom} {arbitre.prenom}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{arbitre.licence || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{arbitre.categorie || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{arbitre.region || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/arbitres/${arbitre.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <>
                            <Link to={`/arbitres/${arbitre.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(arbitre.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
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