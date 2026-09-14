import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, loading, isAuthenticated } = useAuthContext();
  const location = useLocation();

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-3 text-sm font-medium text-gray-600">
            Loading...
          </div>

          <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-black" />
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Role Authorization
  |--------------------------------------------------------------------------
  */

  if (role) {
    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : user.role
        ? [user.role]
        : [];

    const hasRole = userRoles.some((item) => {
      if (typeof item === "string") {
        return item === role;
      }

      return item?.name === role;
    });

    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Authorized
  |--------------------------------------------------------------------------
  */

  return <Outlet />;
}
