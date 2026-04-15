import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Check, Medal } from 'lucide-react';
import { resultatAPI, competitionAPI, matchAPI } from '@/api';
import { useAuthStore } from '../../../store';
import { formatDate } from '../../../utils';

export default function ResultatsList() {
  const [resultats, setResultats] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ competition_id: '', match_id: '', validation_officielle: '' });
  const { user } = useAuthStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, compsRes] = await Promise.all([
        resultatAPI.getAll({ page: pagination.page, limit: pagination.limit, ...filters }),
        competitionAPI.getAll({ limit: 100 })
      ]);
      setResultats(resRes.data.data.resultats);
      setPagination(prev => ({ ...prev, ...resRes.data.data.pagination }));
      setCompetitions(compsRes.data.data.competitions);
    } catch (error) {
      console.error('Error fetching resultats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, filters]);

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);
  const canValidate = ['super_admin', 'admin_sportif', 'arbitre'].includes(user?.role);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce résultat?')) return;
    try {
      await resultatAPI.delete(id);
      fetchData();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleValidate = async (id) => {
    try {
      await resultatAPI.validate(id);
      fetchData();
    } catch (error) {
      alert('Erreur lors de la validation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Résultats</h1>
          <p className="text-slate-500">Gestion des résultats des matchs</p>
        </div>
        {canEdit && (
          <Link to="/resultats/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <Plus className="w-4 h-4" />
            Nouveau résultat
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form className="flex flex-col sm:flex-row gap-4">
          <select
            value={filters.competition_id}
            onChange={(e) => setFilters(prev => ({ ...prev, competition_id: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les compétition</option>
            {competitions.map(comp => <option key={comp.id} value={comp.id}>{comp.nom_competition}</option>)}
          </select>
          <select
            value={filters.validation_officielle}
            onChange={(e) => setFilters(prev => ({ ...prev, validation_officielle: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="true">Validé</option>
            <option value="false">Non validé</option>
          </select>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Compétition</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Match</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Validation</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Chargement...</td></tr>
              ) : resultats.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Aucun résultat trouvé</td></tr>
              ) : (
                resultats.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      <div>{formatDate(res.date_match)}</div>
                      <div className="text-xs text-slate-400">{res.heure_match?.substring(0, 5)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{res.nom_competition}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{res.club_domicile_nom}</span>
                        <span className="text-slate-400">vs</span>
                        <span className="font-medium text-slate-900">{res.club_exterieur_nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-primary-600">{res.buts_domicile}</span>
                        <span className="text-slate-400">-</span>
                        <span className="text-primary-600">{res.buts_exterieur}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {res.validation_officielle ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Validé</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/resultats/${res.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <>
                            <Link to={`/resultats/${res.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                        {!res.validation_officielle && canValidate && (
                          <button onClick={() => handleValidate(res.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Valider">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {canEdit && (
                          <button onClick={() => handleDelete(res.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
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