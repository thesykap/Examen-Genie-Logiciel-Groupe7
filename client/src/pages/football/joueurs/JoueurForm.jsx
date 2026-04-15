import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { joueurAPI, clubAPI } from '@/api';
import { useAuthStore } from '@/store';

const POSTES = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant', 'Avant-centre'];

export default function JoueurForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { user, club } = useAuthStore();
  const isResponsable = user?.role === 'responsable_club';

  const [formData, setFormData] = useState({
    club_id: isResponsable && club ? club.id : '',
    nom: '',
    postnom: '',
    prenom: '',
    date_naissance: '',
    nationalite: 'RDC',
    numero_maillot: '',
    poste: '',
    taille: '',
    poids: '',
    photo: '',
    date_signature: '',
    fin_contrat: '',
    statut: 'actif'
  });
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        if (isResponsable && club) {
          setClubs([club]);
        } else {
          const response = await clubAPI.getAll({ limit: 100 });
          setClubs(response.data.data.clubs);
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
      }
    };
    fetchClubs();

    if (isEdit) {
      const fetchJoueur = async () => {
        try {
          const response = await joueurAPI.getById(id);
          setFormData(response.data.data);
        } catch (err) {
          setError('Erreur lors du chargement du joueur');
        }
      };
      fetchJoueur();
    }
  }, [id, isEdit, isResponsable, club]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = { ...formData };
    if (isResponsable && club) {
      submitData.club_id = club.id;
    }

    if (!submitData.club_id) {
      setError('Veuillez sélectionner un club');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await joueurAPI.update(id, submitData);
      } else {
        await joueurAPI.create(submitData);
      }
      navigate('/joueurs');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/joueurs')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour aux joueurs
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Modifier le joueur' : 'Nouveau joueur'}
        </h1>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isResponsable && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Club *</label>
                <select
                  required
                  value={formData.club_id}
                  onChange={(e) => setFormData({ ...formData, club_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sélectionner un club</option>
                  {clubs.map(club => <option key={club.id} value={club.id}>{club.nom_club}</option>)}
                </select>
              </div>
            )}
            {isResponsable && club && (
              <div className="bg-primary-50 p-3 rounded-lg">
                <p className="text-sm text-primary-700">Club: <strong>{club.nom_club}</strong></p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Postnom</label>
              <input
                type="text"
                value={formData.postnom}
                onChange={(e) => setFormData({ ...formData, postnom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date de naissance</label>
              <input
                type="date"
                value={formData.date_naissance}
                onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nationalité</label>
              <input
                type="text"
                value={formData.nationalite}
                onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de maillot</label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.numero_maillot}
                onChange={(e) => setFormData({ ...formData, numero_maillot: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Poste</label>
              <select
                value={formData.poste}
                onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner un poste</option>
                {POSTES.map(poste => <option key={poste} value={poste}>{poste}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Taille (cm)</label>
              <input
                type="number"
                value={formData.taille}
                onChange={(e) => setFormData({ ...formData, taille: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Poids (kg)</label>
              <input
                type="number"
                value={formData.poids}
                onChange={(e) => setFormData({ ...formData, poids: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Photo (URL)</label>
              <input
                type="text"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date de signature</label>
              <input
                type="date"
                value={formData.date_signature}
                onChange={(e) => setFormData({ ...formData, date_signature: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fin de contrat</label>
              <input
                type="date"
                value={formData.fin_contrat}
                onChange={(e) => setFormData({ ...formData, fin_contrat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/joueurs')}
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