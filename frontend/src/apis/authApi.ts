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

async function accountApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/authentication${path}`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}

export async function login(user: LoginType): Promise<UserDetailType | null> {
  const res = await accountApi('/login', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  if (res.status === 200) {
    return res.json();
  }
  return null;
}

export async function signup(user: SignUpType): Promise<boolean> {
  const res = await accountApi('/signup', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  return res.status === 201;
}

export async function logout(): Promise<boolean> {
  const res = await accountApi('/logout', {
    method: 'POST',
  });
  return res.status === 200;
}

export async function checkCookie(): Promise<UserDetailType | null> {
  try {
    const res = await accountApi('/check');
    return res.json();
  } catch {
    return null;
  }
}

export async function forgotPassword(email: string): Promise<boolean> {
  const res = await accountApi('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return res.status === 200;
}

export async function validateToken(token: string | null): Promise<boolean> {
  const url = `${import.meta.env.VITE_BASE_URL}/authentication/forgot-password/validate`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return response.status === 200;
}

export async function resetPasswordWithToken(token: string | null, password: string): Promise<boolean> {
  const res = await accountApi('/forgot-password/reset', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
  return res.status === 200;
}

export async function verifyEmail(token: string | null): Promise<UserDetailType | null> {
  const params = new URLSearchParams({ token: token || '' });
  const res = await accountApi(`/verify/email?${params}`, {
    method: 'POST',
  });
  if (res.status === 201) {
    return res.json();
  }
  return null;
}