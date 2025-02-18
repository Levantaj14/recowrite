import axios from 'axios';

export type BlogType = {
  id: string;
  author: number;
  title: string;
  content: string;
  description: string;
  date: string;
  banner: string;
}

const blogApi = axios.create({
  baseURL: 'http://localhost:8080/blogs',
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
