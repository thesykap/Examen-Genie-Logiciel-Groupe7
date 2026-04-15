import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { resultatAPI, matchAPI } from '@/api';

export default function ResultForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    match_id: '',
    buts_domicile: 0,
    buts_exterieur: 0,
    observations: '',
    validation_officielle: false
  });
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatchs = async () => {
      try {
        const response = await matchAPI.getAll({ statut: 'programme', limit: 100 });
        setMatchs(response.data.data.matchs);
      } catch (err) {
        console.error('Error fetching matchs:', err);
      }
    };
    fetchMatchs();

    if (isEdit) {
      const fetchResultat = async () => {
        try {
          const response = await resultatAPI.getById(id);
          setFormData(response.data.data);
        } catch (err) {
          setError('Erreur lors du chargement du résultat');
        }
      };
      fetchResultat();
    } else {
      const matchId = searchParams.get('match_id');
      if (matchId) {
        setFormData(prev => ({ ...prev, match_id: parseInt(matchId) }));
      }
    }
  }, [id, isEdit, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await resultatAPI.update(id, formData);
      } else {
        await resultatAPI.create(formData);
      }
      navigate('/resultats');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/resultats')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux résultats
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Modifier le résultat' : 'Nouveau résultat'}
        </h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Match *</label>
            <select
              required
              value={formData.match_id}
              onChange={(e) => setFormData({ ...formData, match_id: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={isEdit}
            >
              <option value="">Sélectionner un match</option>
              {matchs.map(match => (
                <option key={match.id} value={match.id}>
                  {match.club_domicile_nom} vs {match.club_exterieur_nom} - {match.nom_competition}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Buts équipe domicile</label>
              <input
                type="number"
                min="0"
                value={formData.buts_domicile}
                onChange={(e) => setFormData({ ...formData, buts_domicile: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Buts équipe extérieur</label>
              <input
                type="number"
                min="0"
                value={formData.buts_exterieur}
                onChange={(e) => setFormData({ ...formData, buts_exterieur: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Observations</label>
              <textarea
                rows={3}
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ajouter des observations sur le match..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/resultats')}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}