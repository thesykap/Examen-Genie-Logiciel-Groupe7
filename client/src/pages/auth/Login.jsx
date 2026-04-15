import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { Eye, EyeOff, AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store';
import { getDashboardPath } from '../../utils';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      navigate(getDashboardPath(user.role));
    }
  };

  return (
    <div className="space-y-6">
      {/* Football Theme Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg mx-auto mb-4 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.531V10.5a2.25 2.25 0 01-4.5 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5h-15a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 0119.5 10.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5h.75a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 013.75 17.5H3m9 3a3 3 0 11-6 0 3 3 0 016 0zM13 17a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 15.75a.75.75 0 11-1.5 0 .75.75 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
          Football Manager
        </h2>
        <p className="text-slate-500">Connectez-vous pour gérer vos compétitions</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-red-50 to-red-25 border border-red-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="label font-semibold text-slate-700 mb-2 block">Email ou Username</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              className={`w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 backdrop-blur-sm transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${errors.email ? 'border-red-400 ring-red-400/20' : ''}`}
              placeholder="votre@football.com"
              {...register('email', { required: 'Ce champ est requis' })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="label font-semibold text-slate-700 mb-2 block">Mot de passe</label>
          <div className="relative">
<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 backdrop-blur-sm transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none ${errors.password ? 'border-red-400 ring-red-400/20' : ''}`}
              placeholder="••••••••"
              {...register('password', { required: 'Ce champ est requis' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-emerald-500/50 overflow-hidden"
        >
          <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
            Se connecter
          </span>
          {isLoading && (
            <Loader2 className="w-5 h-5 absolute left-1/2 -translate-x-1/2 animate-spin opacity-100" />
          )}
        </button>

        <div className="pt-6">
          <Link 
            to="/register" 
            className="inline-flex w-full justify-center rounded-xl bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 text-center"
          >
            S'inscrire
          </Link>
        </div>
      </form>
    </div>
  );
}
