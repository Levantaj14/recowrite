import axios from 'axios';

type Social = {
  name: string;
  url: string;
}

export type UserType = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  socials: Social[];
}

const userApi = axios.create({
  baseURL: 'http://localhost:8080/user',
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllUsers(): Promise<UserType[]> {
  const res = await userApi.get<UserType[]>('');
  return res.data;
}

export async function fetchUser(userId: string | null | undefined): Promise<UserType> {
  const res = await userApi.get<UserType>(`/${userId}`);
  return res.data;
}