export type SocialType = {
  name: string;
  url: string;
}

export type UserType = {
  id: number;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  socials: SocialType[];
}

async function userApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/user${path}`;
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

export async function fetchAllUsers(): Promise<UserType[]> {
  const res = await userApi('');
  return res.json();
}

export async function fetchUser(userId: number | null | undefined): Promise<UserType> {
  const res = await userApi(`/${userId}`);
  return res.json();
}