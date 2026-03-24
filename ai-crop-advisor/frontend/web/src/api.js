function getDefaultApiBaseUrl() {
  // Default to the deployed Hugging Face Spaces backend.
  // Override in dev/prod with `REACT_APP_API_BASE_URL`.
  // Example: `REACT_APP_API_BASE_URL=/api` when using a CRA proxy.
  return "https://ruchitd-ai-crop-backend.hf.space/api";
}

export const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL ?? getDefaultApiBaseUrl()
).replace(/\/$/, "");

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiGet(path) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const data = await parseJsonSafe(response);
  return { ok: response.ok, status: response.status, data };
}

export async function apiPost(path, body) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  const data = await parseJsonSafe(response);
  return { ok: response.ok, status: response.status, data };
}
