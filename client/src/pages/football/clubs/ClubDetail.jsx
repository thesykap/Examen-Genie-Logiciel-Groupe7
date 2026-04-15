import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Users, Calendar, Trophy } from 'lucide-react';
import { clubAPI, joueurAPI } from '@/api';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils';

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [club, setClub] = useState(null);
  const [joueurs, setJoueurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubRes = await clubAPI.getById(id);
        setClub(clubRes.data.data);
        const joueurRes = await joueurAPI.getAll({ club_id: id, limit: 100 });
        setJoueurs(joueurRes.data.data.joueurs);
      } catch (error) {
        console.error('Error fetching club:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce club?')) return;
    try {
      await clubAPI.delete(id);
      navigate('/clubs');
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;
  if (!club) return <div className="p-8 text-center text-slate-500">Club non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/clubs')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux clubs
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">{club.sigle}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{club.nom_club}</h1>
              <p className="text-slate-500">{club.sigle} - Division {club.division}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${club.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {club.statut}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Ville</p>
            <p className="font-medium text-slate-900">{club.ville}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Province</p>
            <p className="font-medium text-slate-900">{club.province || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Stade</p>
            <p className="font-medium text-slate-900">{club.stade || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Couleurs</p>
            <p className="font-medium text-slate-900">{club.couleurs || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Président</p>
            <p className="font-medium text-slate-900">{club.president || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Date de création</p>
            <p className="font-medium text-slate-900">{formatDate(club.date_creation)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Téléphone</p>
            <p className="font-medium text-slate-900">{club.telephone || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Email</p>
            <p className="font-medium text-slate-900">{club.email || '-'}</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <Link to={`/clubs/${id}/edit`} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Joueurs ({joueurs.length})
          </h2>
        </div>
        {joueurs.length === 0 ? (
          <p className="text-slate-500">Aucun joueur enregistré</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {joueurs.map((joueur) => (
              <div key={joueur.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">{joueur.numero_maillot || '-'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{joueur.nom} {joueur.postnom}</p>
                    <p className="text-sm text-slate-500">{joueur.poste}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}