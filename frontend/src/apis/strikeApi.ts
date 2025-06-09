import axios from 'axios';

const strikeApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/strikes`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

type StrikeType = {
  count: number;
}

export async function getStrikeCount(): Promise<StrikeType> {
  const res = await strikeApi.get('');
  return res.data;
}