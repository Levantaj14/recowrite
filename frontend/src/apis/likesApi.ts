import axios from 'axios';

export type LikedType = {
  liked: boolean;
}

const likesApi = axios.create({
  baseURL: 'http://localhost:8080/likes',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function getLikes(id: string | undefined): Promise<LikedType> {
  const res = await likesApi.get(`/${id}`);
  return res.data;
}

export async function changeLike(id: string | undefined): Promise<void> {
  await likesApi.put(`/${id}`);
}