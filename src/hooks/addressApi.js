const API_URL = import.meta.env.VITE_API_URL;

export const fetchAddresses = async (token) => {
  const res = await fetch(`${API_URL}/api/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch addresses");
  }
  return res.json();
};

export const addAddressApi = async (token, payload) => {
  const res = await fetch(`${API_URL}/api/addresses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add address");
  }
  return res.json();
};

export const deleteAddressApi = async (token, id) => {
  const res = await fetch(`${API_URL}/api/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete address");
  }
  return res.json();
};
