import axios from 'axios';

// Utiliza a variável do .env com fallback para localhost caso falhe
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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
  getById: (id: string | number) => api.get(`/posts/${id}`),
  create: (formData: FormData) => api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  like: (id: string | number) => api.post(`/posts/${id}/like`),
  comment: (id: string | number, content: string) => api.post(`/posts/${id}/comment`, { content }),
  repost: (id: string | number) => api.post(`/posts/${id}/repost`),
  delete: (id: string | number) => api.delete(`/posts/${id}`),
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
  join: (id: string | number) => api.post(`/communities/${id}/join`),
};

// ==========================================
// USUÁRIO & PERFIL
// ==========================================
export const ProfileService = {
  get: (handle: string) => api.get(`/profiles/user/${handle}`),
  update: (data: any) => api.put('/profiles/me', data),
};

export const UserService = {
  getById: (id: string) => api.get(`/users/${id}`),
  getMe: () => api.get('/users/me'),
  getByUsername: (username: string) => api.get(`/users/${username}`),
  
  // Sincronização de Notificações
  updateFcmToken: (token: string) => 
    api.patch('/users/update-fcm-token', token, {
      headers: { 'Content-Type': 'text/plain' }
    }),

  // EDIÇÃO DE PERFIL (Conexão real com Java @PutMapping("/me"))
  updateProfile: (profileData: any) => api.put('/profiles/me', profileData),
  
  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/profiles/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // CORREÇÃO: Envio como RequestParam para o Java @PatchMapping("/me/privacy")
  togglePrivacy: (isPrivate: boolean) => 
    api.patch('/profiles/me/privacy', null, { params: { isPrivate } }),

  // SEGUIDORES (Conexão real com ProfileController)
  followUser: (targetUserId: string | number) => api.post(`/profiles/me/follow/${targetUserId}`),
  unfollowUser: (targetUserId: string | number) => api.post(`/profiles/me/unfollow/${targetUserId}`),
};

// ==========================================
// MENSAGERIA (CHAT)
// ==========================================
export const ChatService = {
  getConversations: () => api.get('/chat/conversations'),
  getHistory: (userId1: string, userId2: string) => api.get(`/chat/history/${userId1}/${userId2}`),
  sendMessage: (payload: any) => api.post('/chat/send', payload),
  sendVoiceMessage: (formData: FormData) => api.post('/chat/send-voice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAttachment: (formData: FormData) => api.post('/chat/upload-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// ==========================================
// CURSOS & AGENDAMENTOS (LESSONS)
// ==========================================
export const LessonService = {
  schedule: (data: any) => api.post('/lesson/schedule', data),
  getUpcoming: (userId: string) => api.get(`/lesson/upcoming/${userId}`),
  notify: (lessonId: number) => api.post(`/lesson/notify/${lessonId}`),
};

// ==========================================
// VÍDEO CHAMADA (LiveKit)
// ==========================================
export const VideoService = {
  getJoinToken: (roomName: string) => api.post('/video/join-room', { roomName }),
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
  submit: (data: { proposalId: number | string; stars: number; comment: string }) => 
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
  getUserAchievements: (userId: string | number) => api.get(`/achievements/user/${userId}`),
  generateImage: (data: any) => api.post('/achievements/generate-image', data),
};

// ==========================================
// SEGURANÇA & DENÚNCIAS (REPORTS)
// ==========================================
export const ReportService = {
  create: (data: { targetId: string; targetType: string; reason: string; description: string }) => 
    api.post('/reports', data),
};

export default api;