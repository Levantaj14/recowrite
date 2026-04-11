async function reportApi(path: string, options = {}) {
  const url = `${import.meta.env.VITE_BASE_URL}/report${path}`;
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

export async function sendReport(blogId: number | undefined, reasonId: number): Promise<boolean> {
  const res = await reportApi('', {
    method: 'POST',
    body: JSON.stringify({ blogId, reasonId }),
  });
  return res.status === 200;
}