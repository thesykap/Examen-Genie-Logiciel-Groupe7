import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { matchAPI, clubAPI, competitionAPI } from '@/api';
import { useAuthStore } from '@/store';
import { formatDate, formatDateTime } from '@/utils';

const STATUTS = ['programme', 'termine', 'reporte', 'annule'];

export default function MatchsList() {
  const [matchs, setMatchs] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ competition_id: '', club_id: '', statut: '', date_debut: '', date_fin: '' });
  const { user } = useAuthStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchRes, clubsRes, compsRes] = await Promise.all([
        matchAPI.getAll({ page: pagination.page, limit: pagination.limit, ...filters }),
        clubAPI.getAll({ limit: 100 }),
        competitionAPI.getAll({ limit: 100 })
      ]);
      setMatchs(matchRes.data.data.matchs);
      setPagination(prev => ({ ...prev, ...matchRes.data.data.pagination }));
      setClubs(clubsRes.data.data.clubs);
      setCompetitions(compsRes.data.data.competitions);
    } catch (error) {
      console.error('Error fetching matchs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, filters]);

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce match?')) return;
    try {
      await matchAPI.delete(id);
      fetchMatchs();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getStatutLabel = (statut) => {
    const labels = { programme: 'Programmé', termine: 'Terminé', reporte: 'Reporté', annule: 'Annulé' };
    return labels[statut] || statut;
  };

  const getStatutColor = (statut) => {
    const colors = {
      programme: 'bg-blue-100 text-blue-800',
      termine: 'bg-green-100 text-green-800',
      reporte: 'bg-yellow-100 text-yellow-800',
      annule: 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Matchs</h1>
          <p className="text-slate-500">Gestion des matchs</p>
        </div>
        {canEdit && (
          <Link to="/matchs/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <Plus className="w-4 h-4" />
            Nouveau match
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
            value={filters.statut}
            onChange={(e) => setFilters(prev => ({ ...prev, statut: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map(s => <option key={s} value={s}>{getStatutLabel(s)}</option>)}
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Journée</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Stade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Arbitre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Chargement...</td></tr>
              ) : matchs.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Aucun match trouvé</td></tr>
              ) : (
                matchs.map((match) => (
                  <tr key={match.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      <div>{formatDate(match.date_match)}</div>
                      <div className="text-xs text-slate-400">{match.heure_match?.substring(0, 5)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{match.nom_competition}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{match.club_domicile_nom}</span>
                        <span className="text-slate-400">vs</span>
                        <span className="font-medium text-slate-900">{match.club_exterieur_nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{match.journee || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{match.stade || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{match.arbitre_nom ? `${match.arbitre_nom} ${match.arbitre_prenom || ''}` : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(match.statut)}`}>
                        {getStatutLabel(match.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/matchs/${match.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <>
                            <Link to={`/matchs/${match.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(match.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
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