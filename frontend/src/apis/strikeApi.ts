async function strikeApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/strikes${path}`;
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

type StrikeType = {
  count: number;
}

export async function getStrikeCount(): Promise<StrikeType> {
  const res = await strikeApi('');
  return res.json();
}