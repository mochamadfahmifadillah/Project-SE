import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  registerUser,
  loginUser,
  getMe as getCurrentUser,
  updateProfile as updateUserProfile,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const USER_KEY = "software_empire_user";

/*
|--------------------------------------------------------------------------
| Storage Helpers
|--------------------------------------------------------------------------
*/

function getStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to read stored user:", error);
    return null;
  }
}

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to read authentication token:", error);
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Failed to clear authentication session:", error);
  }
}

/*
|--------------------------------------------------------------------------
| Response Helpers
|--------------------------------------------------------------------------
*/

function extractToken(response) {
  return (
    response?.token ??
    response?.data?.token ??
    response?.access_token ??
    response?.data?.access_token ??
    null
  );
}

function extractUser(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  const candidates = [
    response.user,
    response.data?.user,
    response.data?.data?.user,
    response.data,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      (candidate.id !== undefined ||
        candidate.name !== undefined ||
        candidate.email !== undefined)
    ) {
      return candidate;
    }
  }

  // Fallback jika API langsung mengembalikan objek user.
  if (
    !Array.isArray(response) &&
    (response.id !== undefined ||
      response.name !== undefined ||
      response.email !== undefined)
  ) {
    return response;
  }

  return null;
}

function persistUser(user) {
  if (!user) return;

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to persist user:", error);
  }
}

function persistSession(response) {
  const token = extractToken(response);
  const currentUser = extractUser(response);

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (currentUser) {
    persistUser(currentUser);
  }

  return {
    token,
    user: currentUser,
  };
}

/*
|--------------------------------------------------------------------------
| RBAC Helpers
|--------------------------------------------------------------------------
*/

function getUserRoles(user) {
  if (!user) return [];

  if (Array.isArray(user.roles)) {
    return user.roles
      .map((role) => (typeof role === "string" ? role : role?.name))
      .filter(Boolean);
  }

  if (typeof user.role === "string") {
    return [user.role];
  }

  if (user.role?.name) {
    return [user.role.name];
  }

  return [];
}

function getUserPermissions(user) {
  if (!user) return [];

  const permissions = [];

  if (Array.isArray(user.permissions)) {
    permissions.push(
      ...user.permissions
        .map((permission) =>
          typeof permission === "string" ? permission : permission?.name,
        )
        .filter(Boolean),
    );
  }

  if (Array.isArray(user.roles)) {
    user.roles.forEach((role) => {
      if (!Array.isArray(role?.permissions)) return;

      permissions.push(
        ...role.permissions
          .map((permission) =>
            typeof permission === "string" ? permission : permission?.name,
          )
          .filter(Boolean),
      );
    });
  }

  if (Array.isArray(user.role?.permissions)) {
    permissions.push(
      ...user.role.permissions
        .map((permission) =>
          typeof permission === "string" ? permission : permission?.name,
        )
        .filter(Boolean),
    );
  }

  return [...new Set(permissions)];
}

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
*/

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Restore Session
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getToken();

      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getCurrentUser();
        const currentUser = extractUser(response);

        if (!currentUser) {
          throw new Error("Authenticated user was not returned by the API.");
        }

        if (!cancelled) {
          setUser(currentUser);
          persistUser(currentUser);
        }
      } catch (error) {
        console.error("Session restore failed:", error);

        if (!cancelled) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Get Current User
  |--------------------------------------------------------------------------
  */

  const getMe = useCallback(async () => {
    const response = await getCurrentUser();
    const currentUser = extractUser(response);

    if (!currentUser) {
      throw new Error("Unable to retrieve current user from the API.");
    }

    setUser(currentUser);
    persistUser(currentUser);

    return response;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Update Profile
  |--------------------------------------------------------------------------
  */

  const updateProfile = useCallback(
    async (payload) => {
      // authService harus mendukung FormData untuk upload avatar.
      const response = await updateUserProfile(payload);

      let updatedUser = extractUser(response);

      // Jika respons update tidak menyertakan user, ambil ulang
      // profil terbaru dari endpoint authenticated user.
      if (!updatedUser) {
        const refreshedResponse = await getCurrentUser();
        updatedUser = extractUser(refreshedResponse);
      }

      if (!updatedUser) {
        throw new Error("The API did not return the updated profile.");
      }

      // Pertahankan role, permission, dan properti lain yang tidak
      // dikirim backend, tetapi prioritaskan nilai terbaru dari API.
      const existingUser = getStoredUser() || user || {};

      const nextUser = {
        ...existingUser,
        ...(user || {}),
        ...updatedUser,
      };

      // Perbarui Context agar Header dan komponen lain ikut render ulang.
      setUser(nextUser);
      persistUser(nextUser);

      // Pastikan Profile.jsx juga bisa membaca response.user.
      if (
        response &&
        typeof response === "object" &&
        !Array.isArray(response)
      ) {
        return {
          ...response,
          user: nextUser,
        };
      }

      return {
        user: nextUser,
      };
    },
    [user],
  );

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);
    const { user: currentUser } = persistSession(response);

    if (currentUser) {
      setUser(currentUser);
    }

    return response;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  const register = useCallback(async (payload) => {
    const response = await registerUser(payload);
    const { user: currentUser } = persistSession(response);

    if (currentUser) {
      setUser(currentUser);
    }

    return response;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await logoutUser();
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Authentication State
  |--------------------------------------------------------------------------
  */

  const token = getToken();
  const isAuthenticated = Boolean(user && token);

  /*
  |--------------------------------------------------------------------------
  | RBAC State
  |--------------------------------------------------------------------------
  */

  const roles = useMemo(() => getUserRoles(user), [user]);

  const permissions = useMemo(() => getUserPermissions(user), [user]);

  const role = roles[0] || null;

  /*
  |--------------------------------------------------------------------------
  | Authorization Helpers
  |--------------------------------------------------------------------------
  */

  const hasRole = useCallback(
    (requiredRole) => {
      if (!requiredRole) return true;

      if (Array.isArray(requiredRole)) {
        return requiredRole.some((item) => roles.includes(item));
      }

      return roles.includes(requiredRole);
    },
    [roles],
  );

  const hasPermission = useCallback(
    (requiredPermission) => {
      if (!requiredPermission) return true;

      if (Array.isArray(requiredPermission)) {
        return requiredPermission.every((permission) =>
          permissions.includes(permission),
        );
      }

      return permissions.includes(requiredPermission);
    },
    [permissions],
  );

  /*
  |--------------------------------------------------------------------------
  | Context Value
  |--------------------------------------------------------------------------
  */

  const value = useMemo(
    () => ({
      user,
      loading,
      token,
      isAuthenticated,
      role,
      roles,
      permissions,
      hasRole,
      hasPermission,
      getMe,
      updateProfile,
      login,
      register,
      logout,
    }),
    [
      user,
      loading,
      token,
      isAuthenticated,
      role,
      roles,
      permissions,
      hasRole,
      hasPermission,
      getMe,
      updateProfile,
      login,
      register,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
}

export default AuthContext;
