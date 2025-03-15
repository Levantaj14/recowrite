import axios from 'axios';
import { UserDetailType } from '@/contexts/userDetailContext.ts';

export type SignUpType = {
  name: string;
  email: string;
  username: string;
  password: string;
}

export type LoginType = {
  username: string;
  password: string;
}

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/authentication`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function login(user: LoginType): Promise<UserDetailType | null> {
  const res = await authApi.post('/login', user);
  if (res.status === 200) {
    return res.data;
  }
  return null;
}

export async function signup(user: SignUpType): Promise<UserDetailType | null> {
  const res = await authApi.post('/signup', user);
  if (res.status === 201) {
    return res.data;
  }
  return null;
}

export async function logout(): Promise<boolean> {
  const res = await authApi.post('/logout');
  return res.status === 200;
}

export async function checkCookie(): Promise<UserDetailType | null> {
  const res = await authApi.get('/check');
  if (res.status === 200) {
    return res.data;
  }
  return null;
}

export async function forgotPassword(email: string): Promise<boolean> {
  const res = await authApi.post('/forgotPassword', { email });
  return res.status === 200;
}

export async function validateToken(token: string | null): Promise<boolean> {
  const res = await authApi.post('/forgotPassword/validate', { token }, {
    validateStatus: () => {
      return true;
    },
  });
  return res.status === 200;
}

export async function resetPasswordwithToken(token: string | null, password: string): Promise<boolean> {
  const res = await authApi.post('/forgotPassword/reset', { token, password });
  return res.status === 200;
}