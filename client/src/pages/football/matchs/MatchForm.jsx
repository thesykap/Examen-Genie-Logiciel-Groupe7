import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { matchAPI, clubAPI, competitionAPI, arbitreAPI } from '@/api';


export default function MatchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    competition_id: '',
    club_domicile_id: '',
    club_exterieur_id: '',
    journee: '',
    date_match: '',
    heure_match: '',
    stade: '',
    arbitre_id: '',
    statut: 'programme'
  });
  const [clubs, setClubs] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [arbitres, setArbitres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubsRes, compsRes, arbitresRes] = await Promise.all([
          clubAPI.getAll({ limit: 100 }),
          competitionAPI.getAll({ limit: 100 }),
          arbitreAPI.getAll({ limit: 100 })
        ]);
        setClubs(clubsRes.data.data.clubs);
        setCompetitions(compsRes.data.data.competitions);
        setArbitres(arbitresRes.data.data.arbitres);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();

    if (isEdit) {
      const fetchMatch = async () => {
        try {
          const response = await matchAPI.getById(id);
          setFormData(response.data.data);
        } catch (err) {
          setError('Erreur lors du chargement du match');
        }
      };
      fetchMatch();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await matchAPI.update(id, formData);
      } else {
        await matchAPI.create(formData);
      }
      navigate('/matchs');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/matchs')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux matchs
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Modifier le match' : 'Nouveau match'}
        </h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Compétition *</label>
              <select
                required
                value={formData.competition_id}
                onChange={(e) => setFormData({ ...formData, competition_id: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner une compétition</option>
                {competitions.map(comp => <option key={comp.id} value={comp.id}>{comp.nom_competition}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Journée</label>
              <input
                type="number"
                min="1"
                value={formData.journee}
                onChange={(e) => setFormData({ ...formData, journee: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Club domicile *</label>
              <select
                required
                value={formData.club_domicile_id}
                onChange={(e) => setFormData({ ...formData, club_domicile_id: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner le club domicile</option>
                {clubs.map(club => <option key={club.id} value={club.id}>{club.nom_club}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Club extérieur *</label>
              <select
                required
                value={formData.club_exterieur_id}
                onChange={(e) => setFormData({ ...formData, club_exterieur_id: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner le club extérieur</option>
                {clubs.filter(c => c.id !== formData.club_domicile_id).map(club => <option key={club.id} value={club.id}>{club.nom_club}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date du match *</label>
              <input
                type="date"
                required
                value={formData.date_match}
                onChange={(e) => setFormData({ ...formData, date_match: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Heure du match</label>
              <input
                type="time"
                value={formData.heure_match}
                onChange={(e) => setFormData({ ...formData, heure_match: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stade</label>
              <input
                type="text"
                value={formData.stade}
                onChange={(e) => setFormData({ ...formData, stade: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Arbitre</label>
              <select
                value={formData.arbitre_id || ''}
                onChange={(e) => setFormData({ ...formData, arbitre_id: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner un arbitre</option>
                {arbitres.map(arb => <option key={arb.id} value={arb.id}>{arb.nom} {arb.prenom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="programme">Programmé</option>
                <option value="termine">Terminé</option>
                <option value="reporte">Reporté</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/matchs')}
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