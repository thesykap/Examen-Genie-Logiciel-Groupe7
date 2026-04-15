import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { authAPI } from '../../api';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await authAPI.register(data);
      if (result.data.success) {
        setError('');
        reset();
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur inscription');
    }
  };

  return (
    <div className="max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">S'inscrire</h1>
        <p className="text-slate-500">Créez votre compte visiteur</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="label">Nom d'utilisateur *</label>
          <input
            type="text"
            className={`input ${errors.username ? 'border-red-500' : ''}`}
            placeholder="Votre username"
            {...register('username', { required: 'Requis' })}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="label">Email *</label>
          <input
            type="email"
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="votre@email.com"
            {...register('email', { required: 'Requis' })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Mot de passe *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Minimum 6 caractères"
              {...register('password', { required: 'Requis', minLength: 6 })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full py-3"
        >
          S'inscrire
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-slate-500">
          Déjà un compte? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

