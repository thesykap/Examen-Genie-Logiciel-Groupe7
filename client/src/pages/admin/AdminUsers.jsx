import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight,
  X, User, ChevronLeft, ChevronRight, Shield
} from 'lucide-react';
import { useUserStore } from '../../store';
import { getRoleLabel, getRoleBadgeColor, formatDate } from '../../utils';
import { clubAPI } from '../../api';

const ROLES = ['super_admin', 'admin_sportif', 'responsable_club', 'arbitre', 'visiteur'];

function UserModal({ isOpen, onClose, user, onSubmit, isLoading }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: user || {}
  });

  const [clubs, setClubs] = useState([]);
  const selectedRole = watch('role');

  useEffect(() => {
    if (user) reset(user);
    else reset({ username: '', email: '', password: '', nom: '', prenom: '', telephone: '', role: 'visiteur', club_id: '' });
  }, [user, reset]);

  useEffect(() => {
    if (selectedRole === 'responsable_club') {
      clubAPI.getAll({ limit: 100 }).then(res => {
        setClubs(res.data.data.clubs);
      }).catch(err => console.error('Erreur chargement clubs:', err));
    }
  }, [selectedRole]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {user ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="label">Nom d'utilisateur *</label>
            <input 
              className={`input ${errors.username ? 'border-red-500' : ''}`}
              {...register('username', { required: 'Requis' })}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label className="label">Email *</label>
            <input 
              type="email"
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              {...register('email', { required: 'Requis' })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {!user && (
            <div>
              <label className="label">Mot de passe *</label>
              <input 
                type="password"
                className={`input ${errors.password ? 'border-red-500' : ''}`}
                {...register('password', { required: 'Requis', minLength: 6 })}
              />
              {errors.password && <p className="text-red-500 text-sm">Minimum 6 caractères</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nom</label>
              <input className="input" {...register('nom')} />
            </div>
            <div>
              <label className="label">Prénom</label>
              <input className="input" {...register('prenom')} />
            </div>
          </div>

          <div>
            <label className="label">Téléphone</label>
            <input className="input" {...register('telephone')} />
          </div>

          <div>
            <label className="label">Rôle *</label>
            <select className="input" {...register('role', { required: 'Requis' })}>
              {ROLES.map(role => (
                <option key={role} value={role}>{getRoleLabel(role)}</option>
              ))}
            </select>
          </div>

          {selectedRole === 'responsable_club' && (
            <div>
              <label className="label">Club *</label>
              <select 
                className={`input ${errors.club_id ? 'border-red-500' : ''}`}
                {...register('club_id', { required: 'Sélectionner un club' })}
              >
                <option value="">Sélectionner un club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.nom_club} ({club.sigle})</option>
                ))}
              </select>
              {errors.club_id && <p className="text-red-500 text-sm">{errors.club_id.message}</p>}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
              {isLoading ? 'Enregistrement...' : (user ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleModal({ isOpen, onClose, user, onSubmit, isLoading }) {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'visiteur');

  useEffect(() => {
    if (user?.role) setSelectedRole(user.role);
  }, [user]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Changer le rôle</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {ROLES.map(role => (
            <label 
              key={role} 
              className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRole === role ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input 
                type="radio" 
                name="role" 
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
                className="w-4 h-4 text-primary-600"
              />
              <div>
                <p className="font-medium text-slate-900">{getRoleLabel(role)}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="btn btn-secondary flex-1">Annuler</button>
          <button 
            onClick={() => {
              if (!user?.id) {
                console.error('User ID missing');
                return;
              }
              onSubmit(user.id, selectedRole);
            }} 
            disabled={isLoading || selectedRole === user?.role || !user?.id}
            className="btn btn-primary flex-1"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ isOpen, onClose, user, onConfirm, isLoading }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Confirmer la suppression</h2>
          <p className="text-slate-500">
            Voulez-vous vraiment supprimer l'utilisateur <strong>{user?.username}</strong> ?
            Cette action est irréversible.
          </p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="btn btn-secondary flex-1">Annuler</button>
          <button 
            onClick={() => onConfirm(user.id)} 
            disabled={isLoading}
            className="btn btn-danger flex-1"
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { users, pagination, isLoading, fetchUsers, createUser, updateUser, updateUserRole, updateUserStatus, deleteUser } = useUserStore();
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers({ page: 1, search, role: roleFilter });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers({ page: 1, search: e.target.value, role: roleFilter });
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    fetchUsers({ page: 1, search, role: e.target.value });
  };

  const handlePageChange = (newPage) => {
    fetchUsers({ page: newPage, search, role: roleFilter });
  };

  const handleCreateOrUpdate = async (data) => {
    setActionLoading(true);
    let result;
    if (selectedUser?.id) {
      result = await updateUser(selectedUser.id, data);
    } else {
      result = await createUser(data);
    }
    setActionLoading(false);
    if (result.success) {
      setModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleRoleChange = async (id, role) => {
    setActionLoading(true);
    const result = await updateUserRole(id, role);
    setActionLoading(false);
    if (result.success) {
      setRoleModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleStatusToggle = async (user) => {
    await updateUserStatus(user.id, !user.is_active);
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    const result = await deleteUser(id);
    setActionLoading(false);
    if (result.success) {
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
          <p className="text-slate-500 mt-1">Gérer les utilisateurs et leurs rôles</p>
        </div>
        <button 
          onClick={() => { setSelectedUser(null); setModalOpen(true); }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Nouveau utilisateur
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, username..."
              className="input pl-10"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <select className="input w-full sm:w-48" value={roleFilter} onChange={handleRoleFilter}>
            <option value="">Tous les rôles</option>
            {ROLES.map(role => (
              <option key={role} value={role}>{getRoleLabel(role)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header">Utilisateur</th>
                <th className="table-header">Email</th>
                <th className="table-header">Rôle</th>
                <th className="table-header">Statut</th>
                <th className="table-header">Créé le</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      Chargement...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8 text-slate-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.nom || user.username}</p>
                          <p className="text-sm text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">
                      <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`inline-flex items-center gap-1 text-sm font-medium ${
                          user.is_active ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {user.is_active ? (
                          <><ToggleRight className="w-5 h-5" /> Actif</>
                        ) : (
                          <><ToggleLeft className="w-5 h-5" /> Inactif</>
                        )}
                      </button>
                    </td>
                    <td className="table-cell">{formatDate(user.created_at)}</td>
                    <td className="table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openRoleModal(user)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                          title="Changer le rôle"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Affichage de {(pagination.page - 1) * pagination.limit + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onSubmit={handleCreateOrUpdate}
        isLoading={actionLoading}
      />

      <RoleModal
        isOpen={roleModalOpen}
        onClose={() => { setRoleModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onSubmit={handleRoleChange}
        isLoading={actionLoading}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onConfirm={handleDelete}
        isLoading={actionLoading}
      />
    </div>
  );
}