import { LikeCountType } from '@/apis/likesApi.ts';

type LikedPost = {
  id: number;
  title: string;
  author: string;
}

type AccountCommentType = {
  id: number;
  blogId: number;
  title: string;
  comment: string;
}

async function accountApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/account${path}`;
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

export async function updatePreferences(language: string, receiveEmails: boolean) {
  await accountApi('/preferences', {
    method: 'PUT',
    body: JSON.stringify({ language, getEmail: receiveEmails }),
  });
}

export async function getReceivedLikeCount(): Promise<LikeCountType> {
  const res = await accountApi('/likes/received');
  return res.json();
}

export async function getGivenLikes(): Promise<LikedPost[]> {
  const res = await accountApi('/likes/given');
  return res.json();
}

export async function getUserComments(): Promise<AccountCommentType[]> {
  const res = await accountApi('/comments');
  return res.json();
}

export async function updateName(name: string): Promise<boolean> {
  const res = await accountApi('/name', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
  return res.status === 200;
}

export async function updateEmail(email: string): Promise<boolean> {
  const res = await accountApi('/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  });
  return res.status === 200;
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  const res = await accountApi('/password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  return res.status === 200;
}

export async function uploadAvatar(picture: string, name: string): Promise<boolean> {
  const res = await accountApi('/avatar', {
    method: 'POST',
    body: JSON.stringify({ name, picture }),
  });
  return res.status === 200;
}

export async function updateSocial(username: string, name: string): Promise<boolean> {
  const res = await accountApi('/socials', {
    method: 'PUT',
    body: JSON.stringify({ username, name }),
  });
  return res.status === 200;
}

export async function updateBio(bio: string): Promise<boolean> {
  const res = await accountApi('/bio', {
    method: 'PUT',
    body: JSON.stringify({ bio }),
  });
  return res.status === 200;
}