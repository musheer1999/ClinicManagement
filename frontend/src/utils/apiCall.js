const API_URL = process.env.REACT_APP_API_URL || '/api';

async function apiCall(method, endpoint, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const options = { method, headers, credentials: 'include' };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, options).catch(() => {
    throw new Error('Cannot connect to the server. Make sure the backend is running.');
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export default apiCall;
