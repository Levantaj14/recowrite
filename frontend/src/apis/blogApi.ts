import axios from 'axios';

export type BlogType = {
  id: string;
  author: number;
  title: string;
  content: string;
  description: string;
  date: string;
  banner: string;
  authorName?: string;
}

export type CreateBlogType = {
  title: string;
  content: string;
  description: string;
  banner: string;
}

type BlogIdType = {
  id: number;
}

const blogApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/blogs`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllBlogs(): Promise<BlogType[]> {
  const res = await blogApi.get<BlogType[]>('');
  return res.data;
}

export async function fetchBlog(blogId: string | null | undefined): Promise<BlogType> {
  const res = await blogApi.get<BlogType>(`/${blogId}`);
  return res.data;
}

export async function fetchBlogsByAuthor(authorId: string | null | undefined): Promise<BlogType[]> {
  const res = await blogApi.get<BlogType[]>(`/author?id=${authorId}`);
  return res.data;
}

export async function fetchBlogRecommendation(blogId: string | null | undefined): Promise<BlogType[]> {
  const res = await blogApi.get<BlogType[]>(`/recommendation?id=${blogId}`);
  return res.data;
}

export async function createBlog(blog: CreateBlogType): Promise<number> {
  const res = await blogApi.post<BlogIdType>('', blog);
  return res.data.id;
}