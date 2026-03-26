import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Home & Posts
export const HomeService = {
  getFeed: () => api.get('/home/feed'),
  getTrending: () => api.get('/home/trending'),
};

export const PostService = {
  getAll: () => api.get('/posts'),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: FormData) => api.post('/posts', data),
  like: (id: string) => api.post(`/posts/${id}/like`),
};

export const SearchService = {
  search: (query: string, filter?: string) => api.get('/search', { params: { q: query, filter } }),
};

export const CommunityService = {
  getAll: () => api.get('/communities'),
  join: (id: string) => api.post(`/communities/${id}/join`),
};

export const ProfileService = {
  get: (handle: string) => api.get(`/profile/${handle}`),
  update: (data: any) => api.put('/profile', data),
};

export const UserService = {
  getById: (id: string) => api.get(`/users/${id}`),
};

export const ChatService = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId: string) => api.get(`/chat/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string) => api.post(`/chat/${conversationId}/messages`, { content }),
};

export const NotificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
};

export const ProposalService = {
  getAll: () => api.get('/proposals'),
  accept: (id: string) => api.post(`/proposals/${id}/accept`),
  reject: (id: string) => api.post(`/proposals/${id}/reject`),
  block: (id: string) => api.post(`/proposals/${id}/block`),
};

export const FinanceService = {
  getPackages: () => api.get('/finance/packages'),
  purchase: (packageId: string) => api.post(`/finance/purchase/${packageId}`),
  getHistory: () => api.get('/finance/history'),
};

export const SettingsService = {
  getAccessLogs: () => api.get('/settings/access-logs'),
  getPermissions: () => api.get('/settings/permissions'),
  updatePermission: (key: string, value: boolean) => api.put('/settings/permissions', { key, value }),
  getPreferences: () => api.get('/settings/preferences'),
  updatePreferences: (data: any) => api.put('/settings/preferences', data),
  changePassword: (data: any) => api.put('/settings/security/password', data),
};

export default api;
