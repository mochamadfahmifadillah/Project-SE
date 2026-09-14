import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  registerUser,
  loginUser,
  getMe,
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
  return localStorage.getItem(TOKEN_KEY);
}

/*
|--------------------------------------------------------------------------
| Response Helpers
|--------------------------------------------------------------------------
*/

function extractToken(response) {
  return (
    response?.token ||
    response?.data?.token ||
    response?.access_token ||
    response?.data?.access_token ||
    null
  );
}

function extractUser(response) {
  return response?.user || response?.data?.user || null;
}

/*
|--------------------------------------------------------------------------
| Session Helpers
|--------------------------------------------------------------------------
*/

function persistSession(response) {
  const token = extractToken(response);
  const currentUser = extractUser(response);

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (currentUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
  }

  return {
    token,
    user: currentUser,
  };
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/*
|--------------------------------------------------------------------------
| RBAC Helpers
|--------------------------------------------------------------------------
*/

/**
 * Get all roles from authenticated user.
 *
 * Backend response:
 *
 * user: {
 *   roles: [
 *     {
 *       name: "admin",
 *       permissions: [...]
 *     }
 *   ]
 * }
 */
function getUserRoles(user) {
  if (!user) {
    return [];
  }

  /*
  |--------------------------------------------------------------------------
  | Multiple roles
  |--------------------------------------------------------------------------
  */

  if (Array.isArray(user.roles)) {
    return user.roles
      .map((role) => {
        if (typeof role === "string") {
          return role;
        }

        return role?.name;
      })
      .filter(Boolean);
  }

  /*
  |--------------------------------------------------------------------------
  | Single role fallback
  |--------------------------------------------------------------------------
  */

  if (typeof user.role === "string") {
    return [user.role];
  }

  if (user.role?.name) {
    return [user.role.name];
  }

  return [];
}

/**
 * Get all permission names from authenticated user.
 *
 * Backend:
 *
 * user.roles[].permissions[]
 *
 * Permission can be:
 *
 * "dashboard.view"
 *
 * or:
 *
 * {
 *   name: "dashboard.view"
 * }
 */
function getUserPermissions(user) {
  if (!user) {
    return [];
  }

  const permissions = [];

  /*
  |--------------------------------------------------------------------------
  | Direct permissions
  |--------------------------------------------------------------------------
  */

  if (Array.isArray(user.permissions)) {
    permissions.push(
      ...user.permissions
        .map((permission) =>
          typeof permission === "string" ? permission : permission?.name,
        )
        .filter(Boolean),
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Permissions from roles
  |--------------------------------------------------------------------------
  */

  if (Array.isArray(user.roles)) {
    user.roles.forEach((role) => {
      if (!Array.isArray(role?.permissions)) {
        return;
      }

      permissions.push(
        ...role.permissions
          .map((permission) =>
            typeof permission === "string" ? permission : permission?.name,
          )
          .filter(Boolean),
      );
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Single role fallback
  |--------------------------------------------------------------------------
  */

  if (Array.isArray(user.role?.permissions)) {
    permissions.push(
      ...user.role.permissions
        .map((permission) =>
          typeof permission === "string" ? permission : permission?.name,
        )
        .filter(Boolean),
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Remove duplicates
  |--------------------------------------------------------------------------
  */

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

      /*
      |--------------------------------------------------------------------------
      | No token
      |--------------------------------------------------------------------------
      */

      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      try {
        /*
        |--------------------------------------------------------------------------
        | Get fresh authenticated user from backend
        |--------------------------------------------------------------------------
        */

        const response = await getMe();

        const currentUser = extractUser(response);

        if (!currentUser) {
          throw new Error("Unable to restore authenticated user.");
        }

        if (!cancelled) {
          setUser(currentUser);

          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
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
  | Login
  |--------------------------------------------------------------------------
  */

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const { user: currentUser } = persistSession(response);

    if (currentUser) {
      setUser(currentUser);
    }

    return response;
  };

  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  const register = async (payload) => {
    const response = await registerUser(payload);

    const { user: currentUser } = persistSession(response);

    if (currentUser) {
      setUser(currentUser);
    }

    return response;
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = async () => {
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
  };

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

  const roles = getUserRoles(user);

  const permissions = getUserPermissions(user);

  const role = roles[0] || null;

  /*
  |--------------------------------------------------------------------------
  | Debug RBAC
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!loading) {
      console.log("🔐 AUTH STATE", {
        isAuthenticated,
        role,
        roles,
        permissions,
        user,
        token: Boolean(getToken()),
      });
    }
  }, [loading, isAuthenticated, role, roles, permissions, user]);

  /*
  |--------------------------------------------------------------------------
  | Has Role
  |--------------------------------------------------------------------------
  */

  const hasRole = (requiredRole) => {
    if (!requiredRole) {
      return true;
    }

    if (!roles.length) {
      return false;
    }

    if (Array.isArray(requiredRole)) {
      return requiredRole.some((item) => roles.includes(item));
    }

    return roles.includes(requiredRole);
  };

  /*
  |--------------------------------------------------------------------------
  | Has Permission
  |--------------------------------------------------------------------------
  */

  const hasPermission = (requiredPermission) => {
    /*
    |--------------------------------------------------------------------------
    | No permission requirement
    |--------------------------------------------------------------------------
    */

    if (!requiredPermission) {
      return true;
    }

    /*
    |--------------------------------------------------------------------------
    | User has no permissions
    |--------------------------------------------------------------------------
    */

    if (!permissions.length) {
      return false;
    }

    /*
    |--------------------------------------------------------------------------
    | Multiple permissions
    |--------------------------------------------------------------------------
    |
    | Semua permission harus dimiliki.
    |
    */

    if (Array.isArray(requiredPermission)) {
      return requiredPermission.every((permission) =>
        permissions.includes(permission),
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Single permission
    |--------------------------------------------------------------------------
    */

    return permissions.includes(requiredPermission);
  };

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

      login,

      register,

      logout,
    }),
    [user, loading, token, isAuthenticated, role, roles, permissions],
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
