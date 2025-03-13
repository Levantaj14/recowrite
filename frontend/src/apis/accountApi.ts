import axios from 'axios';
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

const accountApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/account`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function updatePreferences(language: string, receiveEmails: boolean) {
  await accountApi.put('/preferences', { language, getEmail: receiveEmails });
}

export async function getReceivedLikeCount(): Promise<LikeCountType> {
  const res = await accountApi.get('/likes/received');
  return res.data;
}

export async function getGivenLikes(): Promise<LikedPost[]> {
  const res = await accountApi.get('/likes/given');
  return res.data;
}

export async function getUserComments(): Promise<AccountCommentType[]> {
  const res = await accountApi.get(`/comments`);
  return res.data;
}

export async function updateName(name: string): Promise<boolean> {
  const res = await accountApi.put('/name', { name });
  return res.status === 200;
}

export async function updateEmail(email: string): Promise<boolean> {
  const res = await accountApi.put('/email', { email });
  return res.status === 200;
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  const res = await accountApi.put('/password', { oldPassword, newPassword });
  return res.status === 200;
}

export async function uploadAvatar(picture: string, name: string): Promise<boolean> {
  const res = await accountApi.post('/avatar', { name, picture });
  return res.status === 200;
}

export async function updateSocial(url: string, name: string): Promise<boolean> {
  const res = await accountApi.put('/socials', { url, name });
  return res.status === 200;
}