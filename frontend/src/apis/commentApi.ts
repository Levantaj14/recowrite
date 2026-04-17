export type CommentType = {
  id: number;
  comment: string;
  authorId: number;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
}

async function commmentApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/comments${path}`;
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

export async function getComments(blogId: string | undefined): Promise<CommentType[]> {
  const res = await commmentApi(`/${blogId}`);
  return res.json();
}

export async function postComment(blogId: string | undefined, comment: string): Promise<boolean> {
  const res = await commmentApi(`/${blogId}`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
  return res.status === 200;
}

export async function deleteComment(commentId: number | null): Promise<boolean> {
  const res = await commmentApi(`/${commentId}`, {
    method: 'DELETE',
  });
  return res.status === 200;
}

export async function editComments(commentId: number | null, comment: string): Promise<boolean> {
  const res = await commmentApi(`/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ comment }),
  });
  return res.status === 200;
}