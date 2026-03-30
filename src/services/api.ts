import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token JWT em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// IA ELOS (Acessibilidade Cognitiva)
// ==========================================
export const ChatbotService = {
  ask: (message: string, simplify: boolean) => 
    api.post('/chatbot', { message, simplifyResponse: simplify }),
};

// ==========================================
// ADMINISTRAÇÃO (Console de Gerenciamento)
// ==========================================
export const AdminService = {
  getStats: () => api.get('/console-management/stats'),
  getUsers: () => api.get('/console-management/users'),
  toggleVerification: (userId: string) => 
    api.post(`/console-management/users/${userId}/toggle-verification`),
  banUser: (userId: string, data: { reason: string; expiresAt: string; ipAddress: string }) => 
    api.post(`/console-management/users/${userId}/ban`, data),
  unbanUser: (userId: string) => 
    api.post(`/console-management/users/${userId}/unban`),
};

// ==========================================
// HOME & POSTS
// ==========================================
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

// ==========================================
// BUSCA & COMUNIDADES
// ==========================================
export const SearchService = {
  search: (query: string, filter?: string) => 
    api.get('/search', { params: { q: query, filter } }),
};

export const CommunityService = {
  getAll: () => api.get('/communities'),
  join: (id: string) => api.post(`/communities/${id}/join`),
};

// ==========================================
// USUÁRIO & PERFIL
// ==========================================
export const ProfileService = {
  get: (handle: string) => api.get(`/profile/${handle}`),
  update: (data: any) => api.put('/profile', data),
};

export const UserService = {
  getById: (id: string) => api.get(`/users/${id}`),
  getMe: () => api.get('/users/me'), 
};

// ==========================================
// MENSAGERIA (CHAT)
// ==========================================
export const ChatService = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId: string) => api.get(`/chat/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string) => 
    api.post(`/chat/${conversationId}/messages`, { content }),
};

// ==========================================
// NOTIFICAÇÕES & PROPOSTAS
// ==========================================
export const NotificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
};

export const ProposalService = {
  getAll: () => api.get('/proposals'),
  accept: (id: number) => api.post(`/proposals/${id}/accept`),
  reject: (id: number) => api.post(`/proposals/${id}/reject`),
  block: (id: number) => api.post(`/proposals/${id}/block`),
};

// ==========================================
// FINANCEIRO & SWAPCOINS
// ==========================================
export const FinanceService = {
  getPackages: () => api.get('/finance/packages'),
  purchase: (packageId: string) => api.post(`/finance/purchase/${packageId}`),
  getHistory: () => api.get('/finance/history'),
};

// ==========================================
// CONFIGURAÇÕES & SEGURANÇA
// ==========================================
export const SettingsService = {
  getAccessLogs: () => api.get('/settings/access-logs'),
  getPermissions: () => api.get('/settings/permissions'),
  updatePermission: (key: string, value: boolean) => api.put('/settings/permissions', { key, value }),
  getPreferences: () => api.get('/settings/preferences'),
  updatePreferences: (data: any) => api.put('/settings/preferences', data),
  changePassword: (data: any) => api.put('/settings/security/password', data),
};

// ==========================================
// GAMIFICAÇÃO & RANKINGS
// ==========================================
export const RatingService = {
  submit: (data: { proposalId: number; stars: number; comment: string }) => 
    api.post('/ratings', data),
};

export const RankingService = {
  getAll: () => api.get('/rankings'),
  getBySkill: (skillId: string) => api.get('/rankings', { params: { skillId } }),
  getSkills: () => api.get('/skills'),
};

// ==========================================
// CONQUISTAS (ACHIEVEMENTS)
// ==========================================
export const AchievementService = {
  getAll: () => api.get('/achievements'),
  getUserAchievements: (userId: number) => api.get(`/achievements/user/${userId}`),
};

export default api;