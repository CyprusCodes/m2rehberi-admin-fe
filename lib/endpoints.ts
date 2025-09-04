const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Auth endpoints
export const authEndpoints = {
  login: `${API_BASE_URL}/user/login`,
  logout: `${API_BASE_URL}/admin/logout`,
  me: `${API_BASE_URL}/user/me`,
  refreshToken: `${API_BASE_URL}/admin/refresh`,
  checkEmail: `${API_BASE_URL}/user/check-email`,
}

export const frontendUserEndpoints = {
  login: `${API_BASE_URL}/user/login`,
  register: `${API_BASE_URL}/user/register`,
  verifyEmail: `${API_BASE_URL}/user/verify-email`,
  changePassword: `${API_BASE_URL}/change-password`,
  getUsers: `${API_BASE_URL}/user/users`,
  deleteUserById: (id: number | string) => `${API_BASE_URL}/user/delete-user/${id}`,
  getUserById: (id: number | string) => `${API_BASE_URL}/user/get-user/${id}`,
  refreshCurrentUser: `${API_BASE_URL}/user/refresh-current-user`,
  getCurrentUserPermissions: `${API_BASE_URL}/user/current-user-permissions`,
  forgotPassword: `${API_BASE_URL}/user/forgot-password`,
  editProfile: `${API_BASE_URL}/user/edit-profile`,
  getMe: `${API_BASE_URL}/user/me`,
}

export const frontendServerEndpoints = {
  getActiveServers: `${API_BASE_URL}/front/servers`,
  getActiveServerById: (id: number | string) => `${API_BASE_URL}/front/servers/${id}`,
  getServerFeedback: (id: number | string) => `${API_BASE_URL}/front/servers/${id}/feedback`,
  createServerFeedback: (id: number | string) => `${API_BASE_URL}/front/servers/${id}/feedback`,
  createServer: `${API_BASE_URL}/front/servers`,
  getUserServers: `${API_BASE_URL}/front/user/servers`,
  getUserServerById: (id: number | string) => `${API_BASE_URL}/front/user/servers/${id}`,
  updateUserServerStatus: (id: number | string) => `${API_BASE_URL}/front/user/servers/${id}/status`,
}

export const frontendRoleEndpoints = {
  getRequestables: `${API_BASE_URL}/front/roles?onlyRequestables=true`,
}

export const frontendServerOwnerRequestEndpoints = {
  create: `${API_BASE_URL}/front/roles/server-owner-requestable`,
  checkUserRequest: `${API_BASE_URL}/front/server-owner-requests/check`,
}

// Users endpoints
export const adminUserEndpoints = {
  getAll: `${API_BASE_URL}/admin/users`,
  getStats: `${API_BASE_URL}/admin/users/stats`,
  getById: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
  create: `${API_BASE_URL}/admin/users`,
  update: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
  delete: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
  ban: (id: string) => `${API_BASE_URL}/admin/users/${id}/ban`,
  unban: (id: string) => `${API_BASE_URL}/admin/users/${id}/unban`,
  verifyEmail: (id: string) => `${API_BASE_URL}/admin/users/${id}/verify-email`,
  sendPasswordReset: `${API_BASE_URL}/admin/recovery-request`,
}

// Servers endpoints
export const serverEndpoints = {
  getAll: `${API_BASE_URL}/admin/servers`,
  getById: (id: string) => `${API_BASE_URL}/admin/servers/${id}`,
  create: `${API_BASE_URL}/admin/servers`,
  update: (id: string) => `${API_BASE_URL}/admin/servers/${id}`,
  delete: (id: string) => `${API_BASE_URL}/admin/servers/${id}`,
  getStatus: (id: string) => `${API_BASE_URL}/admin/servers/${id}/status`,
  updateStatus: (id: string) => `${API_BASE_URL}/admin/servers/${id}/status`,
  approve: (id: string | number) => `${API_BASE_URL}/admin/servers/${id}/approve`,
  reject: (id: string | number) => `${API_BASE_URL}/admin/servers/${id}/reject`,
  feedbackList: (id: string | number) => `${API_BASE_URL}/admin/servers/${id}/feedback`,
  feedbackCreate: (id: string | number) => `${API_BASE_URL}/admin/servers/${id}/feedback`,
  feedbackAnswer: (id: string | number) => `${API_BASE_URL}/admin/servers/${id}/feedback/answer`,
}

// Forums endpoints
export const forumEndpoints = {
  getCategories: `${API_BASE_URL}/admin/forums/categories`,
  getTopics: (categoryId?: string) => `${API_BASE_URL}/admin/forums/topics${categoryId ? `?category=${categoryId}` : ""}`,
  getTopicById: (id: string) => `${API_BASE_URL}/admin/forums/topics/${id}`,
  createTopic: `${API_BASE_URL}/admin/forums/topics`,
  updateTopic: (id: string) => `${API_BASE_URL}/admin/forums/topics/${id}`,
  deleteTopic: (id: string) => `${API_BASE_URL}/admin/forums/topics/${id}`,
  closeTopic: (id: string) => `${API_BASE_URL}/admin/forums/topics/${id}/close`,
  getPosts: (topicId: string) => `${API_BASE_URL}/admin/forums/topics/${topicId}/posts`,
  createPost: (topicId: string) => `${API_BASE_URL}/admin/forums/topics/${topicId}/posts`,
  deletePost: (topicId: string, postId: string) => `${API_BASE_URL}/admin/forums/topics/${topicId}/posts/${postId}`,
}

// Tags endpoints
export const tagEndpoints = {
  getAll: `${API_BASE_URL}/admin/tags`,
  getStats: `${API_BASE_URL}/admin/tags/stats`,
  getById: (id: string | number) => `${API_BASE_URL}/admin/tags/${id}`,
  create: `${API_BASE_URL}/admin/tags`,
  update: (id: string | number) => `${API_BASE_URL}/admin/tags/${id}`,
  delete: (id: string | number) => `${API_BASE_URL}/admin/tags/${id}`,
}

// Advertisement endpoints
export const advertisementEndpoints = {
  getAll: `${API_BASE_URL}/admin/advertisements`,
  getById: (id: string) => `${API_BASE_URL}/admin/advertisements/${id}`,
  create: `${API_BASE_URL}/admin/advertisements`,
  update: (id: string) => `${API_BASE_URL}/admin/advertisements/${id}`,
  delete: (id: string) => `${API_BASE_URL}/admin/advertisements/${id}`,
  approve: (id: string) => `${API_BASE_URL}/admin/advertisements/${id}/approve`,
  reject: (id: string) => `${API_BASE_URL}/admin/advertisements/${id}/reject`,
}

// Server Owner Requests
export const serverOwnerRequestEndpoints = {
  getAll: `${API_BASE_URL}/admin/server-owner-requests`,
  create: `${API_BASE_URL}/admin/server-owner-requests`,
  approve: (id: string | number) => `${API_BASE_URL}/admin/server-owner-requests/${id}/approve`,
  reject: (id: string | number) => `${API_BASE_URL}/admin/server-owner-requests/${id}/reject`,
}

// Analytics endpoints
export const analyticsEndpoints = {
  getDashboard: `${API_BASE_URL}/admin/analytics/dashboard`,
  getUsers: `${API_BASE_URL}/admin/analytics/users`,
  getServers: `${API_BASE_URL}/admin/analytics/servers`,
  getForums: `${API_BASE_URL}/admin/analytics/forums`,
}

// Upload endpoints
export const uploadEndpoints = {
  image: `${API_BASE_URL}/admin/upload/image`,
  banner: `${API_BASE_URL}/admin/upload/banner`,
  avatar: `${API_BASE_URL}/admin/upload/avatar`,
}

// Roles (User Types) endpoints
export const roleEndpoints = {
  getAll: `${API_BASE_URL}/admin/roles`,
  getRequestables: `${API_BASE_URL}/admin/roles?onlyRequestables=true`,
  getById: (id: string | number) => `${API_BASE_URL}/admin/roles/${id}`,
  create: `${API_BASE_URL}/admin/roles`,
  update: (id: string | number) => `${API_BASE_URL}/admin/roles/${id}`,
  delete: (id: string | number) => `${API_BASE_URL}/admin/roles/${id}`,
}

export const systemSettingEndpoints = {
  getAll: `${API_BASE_URL}/admin/settings`,
  create: `${API_BASE_URL}/admin/settings`,
  update: (id: string | number) => `${API_BASE_URL}/admin/settings/${id}`,
  delete: (id: string | number) => `${API_BASE_URL}/admin/settings/${id}`,
}

// Carousel endpoints
export const adminCarouselEndpoints = {
  getAll: `${API_BASE_URL}/admin/carousels`,
  getById: (id: string | number) => `${API_BASE_URL}/admin/carousels/${id}`,
  create: `${API_BASE_URL}/admin/carousels`,
  update: (id: string | number) => `${API_BASE_URL}/admin/carousels/${id}`,
  delete: (id: string | number) => `${API_BASE_URL}/admin/carousels/${id}`,
}

export const frontendCarouselEndpoints = {
  getAll: `${API_BASE_URL}/front/carousels`,
}