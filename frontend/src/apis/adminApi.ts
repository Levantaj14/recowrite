import axios from 'axios';
import { UserType } from '@/apis/userApi.ts';

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/admin`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

type StatusType = 'OPEN' | 'DISMISSED' | 'STRIKE_GIVEN';

export type ReportType = {
  id: number;
  reason: string;
  date: Date;
  status: StatusType;
  blogId: number;
  reportedUserId: number;
  reporterId: number;
}

export async function testAdmin(): Promise<boolean> {
  try {
    const res = await adminApi.get('');
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function getAllReports(): Promise<ReportType[]> {
  const res = await adminApi.get('/reports');
  return res.data;
}

export async function dismissReport(id: number): Promise<void> {
  await adminApi.put(`/reports/${id}`);
}

export async function giveStrike(id: number): Promise<void> {
  await adminApi.post(`/strikes`, {
    reportId: id,
  });
}

export async function revokeStrike(id: number): Promise<void> {
  await adminApi.delete(`/strikes/report/${id}`);
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