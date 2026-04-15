import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Check, X, Users } from 'lucide-react';
import { participationAPI, clubAPI, competitionAPI } from '@/api';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils';

export default function ParticipationsList() {
  const [participations, setParticipations] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ competition_id: '', club_id: '', statut_validation: '' });
  const { user } = useAuthStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [partRes, clubsRes, compsRes] = await Promise.all([
        participationAPI.getAll({ page: pagination.page, limit: pagination.limit, ...filters }),
        clubAPI.getAll({ limit: 100 }),
        competitionAPI.getAll({ limit: 100 })
      ]);
      setParticipations(partRes.data.data.participations);
      setPagination(prev => ({ ...prev, ...partRes.data.data.pagination }));
      setClubs(clubsRes.data.data.clubs);
      setCompetitions(compsRes.data.data.competitions);
    } catch (error) {
      console.error('Error fetching participations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, filters]);

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette participation?')) return;
    try {
      await participationAPI.delete(id);
      fetchData();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleValidate = async (id) => {
    try {
      await participationAPI.validate(id);
      fetchData();
    } catch (error) {
      alert('Erreur lors de la validation');
    }
  };

  const handleReject = async (id) => {
    try {
      await participationAPI.reject(id);
      fetchData();
    } catch (error) {
      alert('Erreur lors du rejet');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Participations</h1>
          <p className="text-slate-500">Inscriptions des clubs aux compétition</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form className="flex flex-col sm:flex-row gap-4">
          <select
            value={filters.competition_id}
            onChange={(e) => setFilters(prev => ({ ...prev, competition_id: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les compétitions</option>
            {competitions.map(comp => <option key={comp.id} value={comp.id}>{comp.nom_competition}</option>)}
          </select>
          <select
            value={filters.club_id}
            onChange={(e) => setFilters(prev => ({ ...prev, club_id: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les clubs</option>
            {clubs.map(club => <option key={club.id} value={club.id}>{club.nom_club}</option>)}
          </select>
          <select
            value={filters.statut_validation}
            onChange={(e) => setFilters(prev => ({ ...prev, statut_validation: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="valide">Validé</option>
            <option value="rejete">Rejeté</option>
          </select>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Club</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Compétition</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Date d'inscription</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Statut</th>
                {canEdit && <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Chargement...</td></tr>
              ) : participations.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucune participation trouvée</td></tr>
              ) : (
                participations.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{part.club_nom}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{part.competition_nom}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(part.date_inscription)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        part.statut_validation === 'valide' ? 'bg-green-100 text-green-800' :
                        part.statut_validation === 'rejete' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {part.statut_validation === 'en_attente' ? 'En attente' : part.statut_validation}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {part.statut_validation === 'en_attente' && (
                            <>
                              <button onClick={() => handleValidate(part.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Valider">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(part.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Rejeter">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDelete(part.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
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