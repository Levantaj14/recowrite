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

export async function signup(user: SignUpType): Promise<boolean> {
  const res = await authApi.post('/signup', user);
  return res.status === 200;
}

export async function logout(): Promise<boolean> {
  const res = await authApi.post('/logout', {
    withCredentials: true,
  });
  return res.status === 200;
}

export async function checkCookie(): Promise<UserDetailType | null> {
  try {
    const res = await authApi.get('/check', {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
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

export async function resetPasswordWithToken(token: string | null, password: string): Promise<boolean> {
  const res = await authApi.post('/forgotPassword/reset', { token, password });
  return res.status === 200;
}

export async function verifyEmail(token: string | null): Promise<UserDetailType | null> {
  const res = await authApi.post('/verify/email', null, {
    params: {
      token,
    },
  });
  if (res.status === 201) {
    return res.data;
  }
  return null;
}