import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, User } from 'lucide-react';
import { joueurAPI, clubAPI } from '@/api';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils';

export default function JoueurDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [joueur, setJoueur] = useState(null);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const joueurRes = await joueurAPI.getById(id);
        setJoueur(joueurRes.data.data);
        if (joueurRes.data.data.club_id) {
          const clubRes = await clubAPI.getById(joueurRes.data.data.club_id);
          setClub(clubRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching joueur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const canEdit = ['super_admin', 'admin_sportif', 'responsable_club'].includes(user?.role);
  const canDelete = canEdit && (user?.role === 'super_admin' || user?.role === 'admin_sportif' || (user?.role === 'responsable_club' && user?.club_id === joueur?.club_id));

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur?')) return;
    try {
      await joueurAPI.delete(id);
      navigate('/joueurs');
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;
  if (!joueur) return <div className="p-8 text-center text-slate-500">Joueur non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/joueurs')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux joueurs
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              {joueur.photo ? (
                <img src={joueur.photo} alt={joueur.nom} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary-600">{joueur.numero_maillot || '?'}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{joueur.nom} {joueur.postnom} {joueur.prenom}</h1>
              <p className="text-slate-500">{joueur.poste || 'Poste non défini'}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${joueur.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {joueur.statut}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Club</p>
            <p className="font-medium text-slate-900">{club?.nom_club || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Numéro de habituel</p>
            <p className="font-medium text-slate-900">{joueur.numero_maillot || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Date de naissance</p>
            <p className="font-medium text-slate-900">{formatDate(joueur.date_naissance)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Nationalité</p>
            <p className="font-medium text-slate-900">{joueur.nationalite || 'RDC'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Taille</p>
            <p className="font-medium text-slate-900">{joueur.taille ? `${joueur.taille} cm` : '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Poids</p>
            <p className="font-medium text-slate-900">{joueur.poids ? `${joueur.poids} kg` : '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Date de signature</p>
            <p className="font-medium text-slate-900">{formatDate(joueur.date_signature)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Fin de contrat</p>
            <p className="font-medium text-slate-900">{formatDate(joueur.fin_contrat)}</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <Link to={`/joueurs/${id}/edit`} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            {canDelete && (
              <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}