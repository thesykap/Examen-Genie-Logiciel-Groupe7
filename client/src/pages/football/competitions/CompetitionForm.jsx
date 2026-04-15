import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { competitionAPI } from '@/api';

const TYPES = [
  { value: 'championnat', label: 'Championnat' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'supercoupe', label: 'Supercoupe' }
];

const FORMATS = ['poule_unique', 'poules_elimination', 'elimination_directe'];

export default function CompetitionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nom_competition: '',
    type_competition: 'championnat',
    saison: '',
    date_debut: '',
    date_fin: '',
    nombre_equipes: '',
    format_competition: 'poule_unique',
    statut: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setFormData(prev => ({ ...prev, saison: `${currentYear}-${nextYear}` }));

    if (isEdit) {
      const fetchCompetition = async () => {
        try {
          const response = await competitionAPI.getById(id);
          setFormData(response.data.data);
        } catch (err) {
          setError('Erreur lors du chargement de la compétition');
        }
      };
      fetchCompetition();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await competitionAPI.update(id, formData);
      } else {
        await competitionAPI.create(formData);
      }
      navigate('/competitions');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/competitions')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux compétitions
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Modifier la compétition' : 'Nouvelle compétition'}
        </h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la compétition *</label>
              <input
                type="text"
                required
                value={formData.nom_competition}
                onChange={(e) => setFormData({ ...formData, nom_competition: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type de compétition *</label>
              <select
                required
                value={formData.type_competition}
                onChange={(e) => setFormData({ ...formData, type_competition: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Saison *</label>
              <input
                type="text"
                required
                placeholder="2024-2025"
                value={formData.saison}
                onChange={(e) => setFormData({ ...formData, saison: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre d'équipes</label>
              <input
                type="number"
                min="2"
                value={formData.nombre_equipes}
                onChange={(e) => setFormData({ ...formData, nombre_equipes: parseInt(e.target.value) || '' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
              <input
                type="date"
                value={formData.date_debut}
                onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={formData.date_fin}
                onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Format de la compétition</label>
              <select
                value={formData.format_competition}
                onChange={(e) => setFormData({ ...formData, format_competition: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="poule_unique">Poule unique</option>
                <option value="poules_elimination">Poules + Élimination</option>
                <option value="elimination_directe">Élimination directe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="cloturee">Clôturée</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/competitions')}
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