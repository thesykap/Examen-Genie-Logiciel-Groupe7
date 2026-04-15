import { create } from 'zustand';
import { authAPI, userAPI } from '../api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  club: JSON.parse(localStorage.getItem('club')) || null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Login request:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data);
      const { user, token, club } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (club) {
        localStorage.setItem('club', JSON.stringify(club));
      }
      set({ user, token, club, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('club');
    set({ user: null, token: null, club: null });
  },

  fetchCurrentUser: async () => {
    if (!get().token) return;
    try {
      const response = await authAPI.getMe();
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (error) {
      get().logout();
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.changePassword(data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  hasPermission: (requiredRoles) => {
    const { user } = get();
    if (!user) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  }
}));

export const useUserStore = create((set, get) => ({
  users: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  currentUser: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getAll(params);
      set({ 
        users: response.data.data.users,
        pagination: response.data.data.pagination,
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getById(id);
      set({ currentUser: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
      return null;
    }
  },

  createUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await userAPI.create(data);
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Create failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await userAPI.update(id, data);
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  updateUserRole: async (id, role) => {
    try {
      await userAPI.updateRole(id, role);
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  updateUserStatus: async (id, is_active) => {
    try {
      await userAPI.updateStatus(id, is_active);
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  deleteUser: async (id) => {
    try {
      await userAPI.delete(id);
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  fetchStats: async () => {
    try {
      const response = await userAPI.getStats();
      set({ stats: response.data.data });
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  }
}));