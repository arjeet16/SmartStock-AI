const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

let unauthorizedHandled = false;

export function getAuthToken() {
  return localStorage.getItem(
    "smartstock_auth_token"
  );
}

export function clearAuthSession() {
  localStorage.removeItem(
    "smartstock_is_logged_in"
  );
  localStorage.removeItem(
    "smartstock_current_user"
  );
  localStorage.removeItem(
    "smartstock_auth_token"
  );

  sessionStorage.removeItem(
    "smartstock_is_logged_in"
  );
  sessionStorage.removeItem(
    "smartstock_current_user"
  );
  sessionStorage.removeItem(
    "smartstock_auth_token"
  );
}

export async function authFetch(
  endpoint,
  options = {}
) {
  const token = getAuthToken();

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();

    data = {
      success: false,
      message:
        text ||
        `Server returned status ${response.status}.`,
    };
  }

  if (response.status === 401) {
    clearAuthSession();

    if (!unauthorizedHandled) {
      unauthorizedHandled = true;

      window.dispatchEvent(
        new CustomEvent(
          "smartstock:unauthorized",
          {
            detail: {
              message:
                data.message ||
                "Your session has expired.",
            },
          }
        )
      );

      window.setTimeout(() => {
        unauthorizedHandled = false;
      }, 1500);
    }

    throw new Error(
      data.message || "Authentication required."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}