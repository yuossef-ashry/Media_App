import type { ApiResponse, Comment, Post, SuggestedFriend, UserProfile } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://route-posts.routemisr.com/').replace(/\/+$/, '');
let pendingRequests = 0;

function publishLoading() {
  window.dispatchEvent(new CustomEvent('app:loading', { detail: pendingRequests > 0 }));
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}/${path.replace(/^\/+/, '')}`;
  const headers = new Headers(init.headers);
  const isAuthRequest = /users\/(signin|signup)(?:$|\?)/.test(path);
  const token = localStorage.getItem('token');

  if (token && !isAuthRequest) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  pendingRequests += 1;
  publishLoading();
  try {
    const response = await fetch(url, { ...init, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(payload?.message || 'Something went wrong. Please try again.', response.status);
    }
    return payload as T;
  } finally {
    pendingRequests = Math.max(0, pendingRequests - 1);
    publishLoading();
  }
}

const json = (value: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(value) });
const putJson = (value: unknown): RequestInit => ({ method: 'PUT', body: JSON.stringify(value) });

export const authApi = {
  login: (data: { email: string; password: string }) =>
    request<ApiResponse<{ token: string; user: UserProfile }>>('users/signin', json(data)),
  register: (data: Record<string, string>) =>
    request<ApiResponse<unknown>>('users/signup', json(data)),
};

export const userApi = {
  profile: () => request<ApiResponse<{ user: UserProfile }>>('users/profile-data'),
  detail: (id: string) => request<ApiResponse<{ user: UserProfile }>>(`users/${id}`),
  uploadPhoto: (body: FormData) =>
    request<ApiResponse<unknown>>('users/upload-photo', { method: 'PUT', body }),
  uploadCover: (body: FormData) =>
    request<ApiResponse<unknown>>('users/upload-cover', { method: 'PUT', body }),
  deleteCover: () => request<ApiResponse<unknown>>('users/cover', { method: 'DELETE' }),
  changePassword: (body: { password: string; newPassword: string }) =>
    request<ApiResponse<unknown>>('users/change-password', { method: 'PATCH', body: JSON.stringify(body) }),
  suggestions: async () => {
    const response = await request<ApiResponse<{ suggestions: SuggestedFriend[] }>>('users/suggestions?limit=5');
    return response.data.suggestions ?? [];
  },
};

export const postsApi = {
  list: async () => {
    const response = await request<ApiResponse<{ posts: Post[] }>>('posts');
    return response.data.posts ?? [];
  },
  mine: async () => {
    const response = await request<ApiResponse<{ posts: Post[] }>>('posts/feed?only=me&limit=20&page=1');
    return response.data.posts ?? [];
  },
  saved: async () => {
    const response = await request<ApiResponse<{ bookmarks: Post[] }>>('users/bookmarks');
    return response.data.bookmarks ?? [];
  },
  one: async (id: string) => {
    const response = await request<ApiResponse<{ post: Post }>>(`posts/${id}`);
    return response.data.post;
  },
  create: (body: FormData) => request<ApiResponse<unknown>>('posts', { method: 'POST', body }),
  update: (id: string, body: FormData) => request<ApiResponse<unknown>>(`posts/${id}`, { method: 'PUT', body }),
  remove: (id: string) => request<ApiResponse<unknown>>(`posts/${id}`, { method: 'DELETE' }),
  bookmark: (id: string) => request<ApiResponse<unknown>>(`posts/${id}/bookmark`, { method: 'PUT', body: 'null' }),
  like: (id: string) => request<ApiResponse<unknown>>(`posts/${id}/like`, putJson({})),
  share: (id: string, body: FormData) => request<ApiResponse<unknown>>(`posts/${id}/share`, { method: 'POST', body }),
  comments: async (id: string, page = 1, limit = 10) => {
    const response = await request<ApiResponse<{ comments: Comment[] }>>(`posts/${id}/comments?page=${page}&limit=${limit}`);
    return response.data.comments ?? [];
  },
  addComment: (id: string, body: FormData) =>
    request<ApiResponse<unknown>>(`posts/${id}/comments`, { method: 'POST', body }),
  updateComment: (postId: string, commentId: string, body: FormData) =>
    request<ApiResponse<unknown>>(`posts/${postId}/comments/${commentId}`, { method: 'PUT', body }),
  deleteComment: (postId: string, commentId: string) =>
    request<ApiResponse<unknown>>(`posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
  likeComment: (postId: string, commentId: string) =>
    request<ApiResponse<unknown>>(`posts/${postId}/comments/${commentId}/like`, putJson({})),
};
