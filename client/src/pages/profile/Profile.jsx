import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { getRoleLabel, formatDate } from '../../utils';

export default function Profile() {
  const { user, changePassword, isLoading } = useAuthStore();
  const [message, setMessage] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Mot de passe changé avec succès' });
      reset();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1>
        <p className="text-slate-500 mt-1">Gérer vos informations personnelles</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{user?.nom || user?.username}</h2>
            <p className="text-slate-500">{user?.prenom}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Nom d'utilisateur</label>
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              {user?.username}
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              {user?.email}
            </div>
          </div>
          <div>
            <label className="label">Téléphone</label>
            <div className="text-slate-700">{user?.telephone || '-'}</div>
          </div>
          <div>
            <label className="label">Rôle</label>
            <div className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              {getRoleLabel(user?.role)}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Changer le mot de passe</h2>
        </div>

        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
          <div>
            <label className="label">Mot de passe actuel</label>
            <input
              type="password"
              className={`input ${errors.currentPassword ? 'border-red-500' : ''}`}
              {...register('currentPassword', { required: 'Requis' })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input
                type="password"
                className={`input ${errors.newPassword ? 'border-red-500' : ''}`}
                {...register('newPassword', { required: 'Requis', minLength: 6 })}
              />
            </div>
            <div>
              <label className="label">Confirmer le mot de passe</label>
              <input
                type="password"
                className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                {...register('confirmPassword', { required: 'Requis' })}
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary">
            <Save className="w-4 h-4" />
            {isLoading ? 'Enregistrement...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  );
}