import axios from 'axios';

const reportApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/report`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function sendReport(blogId: number | undefined, reasonId: number): Promise<boolean> {
  const res = await reportApi.post('', {
    blogId, reasonId,
  });
  return res.status === 200;
}