import axios from 'axios';

export type CommentType = {
  id: number;
  comment: string;
  authorId: number;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
}

const commmentApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/comments`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function getComments(blogId: string | undefined): Promise<CommentType[]> {
  const res = await commmentApi.get(`/${blogId}`);
  return res.data;
}

export async function postComment(blogId: string | undefined, comment: string): Promise<boolean> {
  const res = await commmentApi.post(`/${blogId}`, { comment });
  return res.status === 200;
}

export async function deleteComment(commentId: number | null): Promise<boolean> {
  const res = await commmentApi.delete(`/${commentId}`);
  return res.status === 200;
}

export async function editComments(commentId: number | null, comment: string): Promise<boolean> {
  const res = await commmentApi.put(`/${commentId}`, { comment });
  return res.status === 200;
}