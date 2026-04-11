export type LikedType = {
  liked: boolean;
}

export type LikeCountType = {
  count: number;
}

async function likesApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/likes${path}`;
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

export async function getLiked(id: string | undefined): Promise<LikedType> {
  const url = `${import.meta.env.VITE_BASE_URL}/likes/check/${id}`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  return response.json();
}

export async function getLikeCount(id: string | undefined): Promise<LikeCountType> {
  const res = await likesApi(`/${id}`);
  return res.json();
}

export async function changeLike(id: string | undefined): Promise<void> {
  await likesApi(`/${id}`, {
    method: 'PUT',
  });
}