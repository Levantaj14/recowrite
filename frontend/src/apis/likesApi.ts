import axios from 'axios';

export type LikedType = {
  liked: boolean;
}

export type LikeCountType = {
  count: number;
}

const likesApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/likes`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function getLiked(id: string | undefined): Promise<LikedType> {
  const res = await likesApi.get(`/check/${id}`, {
    validateStatus: () => true
  });
  return res.data;
}

export async function getLikeCount(id: string | undefined): Promise<LikeCountType> {
  const res = await likesApi.get(`/${id}`);
  return res.data;
}

export async function changeLike(id: string | undefined): Promise<void> {
  await likesApi.put(`/${id}`);
}