import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, User } from 'lucide-react';
import { matchAPI, clubAPI, competitionAPI, arbitreAPI, resultatAPI } from '@/api';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils';

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [match, setMatch] = useState(null);
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchRes = await matchAPI.getById(id);
        setMatch(matchRes.data.data);
        try {
          const resultRes = await resultatAPI.getByMatch(id);
          setResultat(resultRes.data.data);
        } catch (e) {
          setResultat(null);
        }
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const canEdit = ['super_admin', 'admin_sportif'].includes(user?.role);
  const canValidate = ['super_admin', 'admin_sportif', 'arbitre'].includes(user?.role);

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

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce match?')) return;
    try {
      await matchAPI.cancel(id);
      window.location.reload();
    } catch (error) {
      alert('Erreur lors de l\'annulation');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;
  if (!match) return <div className="p-8 text-center text-slate-500">Match non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/matchs')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux matchs
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {match.club_domicile_nom} <span className="text-slate-400">vs</span> {match.club_exterieur_nom}
            </h1>
            <p className="text-slate-500">{match.nom_competition} - Journée {match.journee || '-'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(match.statut)}`}>
            {getStatutLabel(match.statut)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Date</p>
            <p className="font-medium text-slate-900">{formatDate(match.date_match)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Heure</p>
            <p className="font-medium text-slate-900">{match.heure_match?.substring(0, 5) || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Stade</p>
            <p className="font-medium text-slate-900">{match.stade || '-'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Arbitre</p>
            <p className="font-medium text-slate-900">{match.arbitre_nom ? `${match.arbitre_nom} ${match.arbitre_prenom || ''}` : '-'}</p>
          </div>
        </div>

        {match.statut !== 'annule' && canEdit && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <Link to={`/matchs/${id}/edit`} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
              Annuler le match
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Résultat</h2>
        
        {resultat ? (
          <div className="flex items-center justify-center gap-8 p-6 bg-slate-50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{match.club_domicile_nom}</p>
              <p className="text-4xl font-bold text-primary-600">{resultat.butes_domicile}</p>
            </div>
            <div className="text-2xl text-slate-400">-</div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">{match.club_exterieur_nom}</p>
              <p className="text-4xl font-bold text-primary-600">{resultat.butes_exterieur}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">Aucun résultat enregistré</p>
            {canEdit && (
              <Link to={`/resultats/new?match_id=${id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                <Calendar className="w-4 h-4" />
                Ajouter le résultat
              </Link>
            )}
          </div>
        )}

        {resultat && resultat.observations && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Observations</p>
            <p className="text-slate-700">{resultat.observations}</p>
          </div>
        )}
      </div>
    </div>
  );
}