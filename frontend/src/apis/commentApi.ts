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
  baseURL: 'http://localhost:8080/comments',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function getComments(blogId: string | undefined): Promise<CommentType[]> {
  const res = await commmentApi.get(`/${blogId}`);
  return res.data;
}