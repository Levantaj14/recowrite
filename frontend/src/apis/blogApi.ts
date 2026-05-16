export type BlogType = {
  id: string;
  author: number;
  title: string;
  content: string;
  description: string;
  date: string;
  banner: string;
  bannerType: 'IMAGE_URL' | 'IMAGE_UPLOAD';
  authorName?: string;
  ai: boolean;
};

export type CreateBlogType = {
  title: string;
  content: string;
  description: string;
  date: string;
  banner: string;
  bannerType: 'IMAGE_URL' | 'IMAGE_UPLOAD';
};

async function blogApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/blogs${path}`;
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

export async function fetchAllBlogs(): Promise<BlogType[]> {
  const res = await blogApi('');
  return res.json();
}

export async function fetchBlog(blogId: string | null | undefined): Promise<BlogType> {
  const res = await blogApi(`/${blogId}`);
  return res.json();
}

export async function fetchBlogsByAuthor(authorId: string | null | undefined): Promise<BlogType[]> {
  const params = new URLSearchParams({ id: authorId || '' });
  const res = await blogApi(`/author?${params}`);
  return res.json();
}

export async function fetchBlogRecommendation(blogId: string | null | undefined): Promise<BlogType[]> {
  const params = new URLSearchParams({ id: blogId || '' });
  const res = await blogApi(`/recommendation?${params}`);
  return res.json();
}

export async function createBlog(blog: CreateBlogType): Promise<number> {
  const res = await blogApi('', {
    method: 'POST',
    body: JSON.stringify(blog),
  });
  return (await res.json()).id;
}
