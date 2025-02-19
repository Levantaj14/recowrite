import axios from 'axios';

export type SocialType = {
  name: string;
  url: string;
}

export type UserType = {
  id: number;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  socials: SocialType[];
}

const userApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/user`,
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllUsers(): Promise<UserType[]> {
  const res = await userApi.get<UserType[]>('');
  return res.data;
}

export async function fetchUser(userId: number | null | undefined): Promise<UserType> {
  const res = await userApi.get<UserType>(`/${userId}`);
  return res.data;
}