import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Check, Calendar } from 'lucide-react';
import { resultatAPI, matchAPI } from '@/api';
import { useAuthStore } from '../../../store';
import { formatDate } from '../../../utils';

export default function ResultDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await resultatAPI.getById(id);
        setResultat(response.data.data);
      } catch (error) {
        console.error('Error fetching resultat:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);
  const canValidate = ['super_admin', 'admin_sportif', 'arbitre'].includes(user?.role);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce résultat?')) return;
    try {
      await resultatAPI.delete(id);
      navigate('/resultats');
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleValidate = async () => {
    try {
      await resultatAPI.validate(id);
      window.location.reload();
    } catch (error) {
      alert('Erreur lors de la validation');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;
  if (!resultat) return <div className="p-8 text-center text-slate-500">Résultat non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/resultats')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux résultats
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {resultat.club_domicile_nom} <span className="text-slate-400">vs</span> {resultat.club_exterieur_nom}
            </h1>
            <p className="text-slate-500">{resultat.nom_competition}</p>
          </div>
          {resultat.validation_officielle ? (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Validé</span>
          ) : (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">En attente</span>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 p-8 bg-slate-50 rounded-lg mb-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 mb-2">{resultat.club_domicile_nom}</p>
            <p className="text-6xl font-bold text-primary-600">{resultat.buts_domicile}</p>
          </div>
          <div className="text-4xl text-slate-400">-</div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 mb-2">{resultat.club_exterieur_nom}</p>
            <p className="text-6xl font-bold text-primary-600">{resultat.buts_exterieur}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Date du match</p>
            <p className="font-medium text-slate-900">{formatDate(resultat.date_match)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Heure</p>
            <p className="font-medium text-slate-900">{resultat.heure_match?.substring(0, 5) || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Stade</p>
            <p className="font-medium text-slate-900">{resultat.stade || '-'}</p>
          </div>
        </div>

        {resultat.observations && (
          <div className="p-4 bg-slate-50 rounded-lg mb-6">
            <p className="text-sm text-slate-500 mb-1">Observations</p>
            <p className="text-slate-700">{resultat.observations}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          {canEdit && (
            <Link to={`/resultats/${id}/edit`} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
          )}
          {!resultat.validation_officielle && canValidate && (
            <button onClick={handleValidate} className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg">
              <Check className="w-4 h-4" />
              Valider le résultat
            </button>
          )}
          {canEdit && (
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}