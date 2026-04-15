import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, User } from 'lucide-react';
import { joueurAPI, clubAPI } from '@/api';
import { useAuthStore } from '@/store';

const POSTES = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant', 'Avant-centre'];

export default function JoueursList() {
  const [joueurs, setJoueurs] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ club_id: '', poste: '', statut: '' });
  const { user, club } = useAuthStore();

  const fetchJoueurs = async () => {
    setLoading(true);
    try {
      const response = await joueurAPI.getAll({ page: pagination.page, limit: pagination.limit, search, ...filters });
      setJoueurs(response.data.data.joueurs);
      setPagination(prev => ({ ...prev, ...response.data.data.pagination }));
    } catch (error) {
      console.error('Error fetching joueurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      if (user?.role === 'responsable_club' && club) {
        setClubs([club]);
      } else {
        const response = await clubAPI.getAll({ limit: 100 });
        setClubs(response.data.data.clubs);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  useEffect(() => {
    fetchClubs();
    fetchJoueurs();
  }, [pagination.page, filters, user?.role, club]);

  useEffect(() => {
    if (user?.role === 'responsable_club' && club) {
      setFilters(prev => ({ ...prev, club_id: club.id }));
    }
  }, [user?.role, club]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchJoueurs();
  };

  const canEdit = ['super_admin', 'admin_sportif', 'responsable_club'].includes(user?.role);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur?')) return;
    try {
      await joueurAPI.delete(id);
      fetchJoueurs();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Joueurs</h1>
          <p className="text-slate-500">Gestion des joueurs</p>
        </div>
        {canEdit && (
          <Link to="/joueurs/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <Plus className="w-4 h-4" />
            Nouveau joueur
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un joueur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {user?.role !== 'responsable_club' && (
            <select
              value={filters.club_id}
              onChange={(e) => setFilters(prev => ({ ...prev, club_id: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les clubs</option>
              {clubs.map(club => <option key={club.id} value={club.id}>{club.nom_club}</option>)}
            </select>
          )}
          <select
            value={filters.poste}
            onChange={(e) => setFilters(prev => ({ ...prev, poste: e.target.value }))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les postes</option>
            {POSTES.map(poste => <option key={poste} value={poste}>{poste}</option>)}
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Joueur</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Club</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Poste</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">N°</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Nationalité</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Chargement...</td></tr>
              ) : joueurs.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Aucun joueur trouvé</td></tr>
              ) : (
                joueurs.map((joueur) => (
                  <tr key={joueur.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{joueur.nom} {joueur.postnom} {joueur.prenom}</p>
                          <p className="text-sm text-slate-500">{joueur.date_naissance ? new Date(joueur.date_naissance).getFullYear() : '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{joueur.club_nom || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{joueur.poste || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{joueur.numero_maillot || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{joueur.nationalite || 'RDC'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${joueur.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {joueur.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/joueurs/${joueur.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <>
                            <Link to={`/joueurs/${joueur.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(joueur.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
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