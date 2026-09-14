import { useAuthContext } from "../context/AuthContext";

/**
 * Authentication hook.
 *
 * Provides access to:
 * - user
 * - loading
 * - isAuthenticated
 * - login
 * - register
 * - logout
 */
export default function useAuth() {
  return useAuthContext();
}
