import axios from 'axios';
import { UserType } from '@/apis/userApi.ts';
import { BlogType } from '@/apis/blogApi.ts';

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/admin`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export type StatusType = 'OPEN' | 'DISMISSED' | 'STRIKE_GIVEN';

export type ReportType = {
  id: number;
  reason: string;
  date: Date;
  status: StatusType;
  blogId: number;
  reportedUserId: number;
  reporterId: number;
  note: string;
}

export type ReportStatusChangeType = {
  reportId: number;
  reportStatus: StatusType;
  note: string | null;
}

export async function testAdmin(): Promise<boolean> {
  try {
    const res = await adminApi.get('');
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function fetchAllBlogsAsAdmin(): Promise<BlogType[]> {
  const res = await adminApi.get<BlogType[]>('/blogs');
  return res.data;
}

export async function getAllReports(): Promise<ReportType[]> {
  const res = await adminApi.get('/reports');
  return res.data;
}

export async function changeStatus(reportChange: ReportStatusChangeType): Promise<void> {
  await adminApi.put('/reports', reportChange);
}

export async function fetchAllAdmins(): Promise<UserType[]> {
  const res = await adminApi.get('/admins');
  return res.data;
}

export async function changeRole(id: number): Promise<boolean> {
  const res = await adminApi.put(`/account/${id}`);
  return res.status === 200;
}

export async function deleteAccount(id: number): Promise<boolean> {
  const res = await adminApi.delete(`/account/${id}`);
  return res.status === 200;
}