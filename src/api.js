export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://backend1-3-zb2a.onrender.com";

// Get JWT token for protected API requests
const getHeaders = () => {
  // First check localStorage for the logged-in user's token
  const token =
    localStorage.getItem("access_token") ||
    process.env.REACT_APP_API_TOKEN;

  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {};
};

// Backend health check
export async function getBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(
      `Backend health check failed: ${response.status}`
    );
  }

  return response.json();
}

// Protected entities API
export async function getEntities(limit = 50) {
  const response = await fetch(
    `${API_BASE_URL}/v1/entities?limit=${limit}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (response.status === 401) {
    throw new Error("Authentication required. Please login.");
  }

  if (!response.ok) {
    throw new Error(
      `Entity request failed: ${response.status}`
    );
  }

  return response.json();
}

// NASA FIRMS fire/hotspot data
export async function getFirms() {
  const response = await fetch(
    `${API_BASE_URL}/v1/firms`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(
      `FIRMS request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return data.fires || [];
}

// Enriched Signals API with historical baseline and facility corroboration
export async function getSignals(limit = 100, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/signals?limit=${limit}`,
      {
        method: "GET",
        headers: getHeaders(),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Signals request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.signals || [];
  } finally {
    clearTimeout(timer);
  }
}

// Classified thermal sources
export async function getSources(params = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const query = new URLSearchParams();
    if (params.cls) query.set("cls", params.cls);
    if (params.tier) query.set("tier", params.tier);
    if (params.corroboratedOnly) query.set("corroboratedOnly", "true");
    if (params.limit) query.set("limit", params.limit);
    if (params.offset) query.set("offset", params.offset);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await fetch(
      `${API_BASE_URL}/v1/sources${queryString}`,
      {
        method: "GET",
        headers: getHeaders(),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Sources request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// Single source dossier
export async function getSource(id, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/sources/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: getHeaders(),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Source request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// Intelligence stats aggregate
export async function getStats(timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/stats`,
      {
        method: "GET",
        headers: getHeaders(),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Stats request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// Live inference predict API
export async function predict(payload, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/predict`,
      {
        method: "POST",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Predict request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}