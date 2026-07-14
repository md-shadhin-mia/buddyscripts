type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor({ status, message, errors }: ApiError) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

let accessToken: string | null = null;
let onAuthFailure: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setOnAuthFailure(cb: () => void) {
  onAuthFailure = cb;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && accessToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      const retryRes = await fetch(path, {
        ...options,
        headers,
        credentials: "include",
      });
      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({ message: retryRes.statusText }));
        throw new ApiClientError({ status: retryRes.status, message: err.message || err?.message });
      }
      const json = await retryRes.json();
      return json?.data ?? json;
    }
    onAuthFailure?.();
    throw new ApiClientError({ status: 401, message: "Session expired" });
  }

  if (res.status === 401) {
    onAuthFailure?.();
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiClientError({ status: 401, message: err.message });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiClientError({ status: res.status, message: err.message, errors: err.errors });
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();
  if (json && typeof json === "object" && "status" in json && json.status === "success" && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      setAccessToken(null);
      return false;
    }
    const json = await res.json();
    const token = json?.data?.accessToken || json?.accessToken;
    if (token) {
      setAccessToken(token);
      return true;
    }
    return false;
  } catch {
    setAccessToken(null);
    return false;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
