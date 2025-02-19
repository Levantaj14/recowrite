import axios from 'axios';

const accountApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/account`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function updatePreferences(language: string) {
  await accountApi.put('/preferences', { language });
}
