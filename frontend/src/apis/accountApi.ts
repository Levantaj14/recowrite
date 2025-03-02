import axios from 'axios';
import { LikeCountType } from '@/apis/likesApi.ts';

type LikedPost = {
  id: number;
  title: string;
  author: string;
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