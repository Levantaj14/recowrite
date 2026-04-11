import { UserType } from '@/apis/userApi.ts';
import { BlogType } from '@/apis/blogApi.ts';

async function adminApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/admin${path}`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}

export type StatusType = 'OPEN' | 'DISMISSED' | 'STRIKE_GIVEN';

export const reportReasons: Record<number, string> = {
  1: 'content.story.report.options.spam',
  2: 'content.story.report.options.hate',
  3: 'content.story.report.options.bully',
  4: 'content.story.report.options.explicit',
  5: 'content.story.report.options.violent',
  6: 'content.story.report.options.misinformation',
  7: 'content.story.report.options.copyright',
  8: 'content.story.report.options.plagiarism',
}

export type ReportType = {
  id: number;
  reasonId: number;
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
  const res = await adminApi('');
  return res.status === 200;
}

export async function fetchAllBlogsAsAdmin(): Promise<BlogType[]> {
  const res = await adminApi('/blogs');
  return res.json();
}

export async function getAllReports(): Promise<ReportType[]> {
  const res = await adminApi('/reports');
  return res.json();
}

export async function changeStatus(reportChange: ReportStatusChangeType): Promise<void> {
  await adminApi('/reports', {
    method: 'PUT',
    body: JSON.stringify(reportChange),
  });
}

export async function fetchAllAdmins(): Promise<UserType[]> {
  const res = await adminApi('/admins');
  return res.json();
}

export async function changeRole(id: number): Promise<boolean> {
  const res = await adminApi(`/account/${id}`, {
    method: 'PUT',
  });
  return res.status === 200;
}

export async function deleteAccount(id: number): Promise<boolean> {
  const res = await adminApi(`/account/${id}`, {
    method: 'DELETE',
  });
  return res.status === 200;
}