import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// ============================================================
// PUBLIC
// ============================================================
import Home from "../pages/public/Home";
import SoftwareDirectory from "../pages/public/SoftwareDirectory";
import SoftwareDetail from "../pages/public/SoftwareDetail";
import Compare from "../pages/public/Compare";
import Recommend from "../pages/public/Recommend";
import Implementation from "../pages/public/Implementation";
import Learn from "../pages/public/Learn";
import ArticleDetail from "../pages/public/ArticleDetail";
import RecommendationResult from "../pages/public/RecommendationResult";

// ============================================================
// AUTH
// ============================================================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ============================================================
// ACCOUNT
// ============================================================
import Account from "../pages/account/Account";
import Profile from "../pages/account/Profile";
import SavedSoftware from "../pages/account/SavedSoftware";
import Comparisons from "../pages/account/Comparisons";
import ImplementationRequests from "../pages/account/ImplementationRequests";
import Settings from "../pages/account/Settings";
import AccountLayout from "../layouts/AccountLayout";

// ============================================================
// ADMIN
// ============================================================
import Dashboard from "../pages/admin/Dashboard";
import AdminLeads from "../pages/admin/AdminLeads";
import Analytics from "../pages/admin/Analytics";
import Articles from "../pages/admin/Articles";
import AuditLogs from "../pages/admin/AuditLogs";
import BusinessSizes from "../pages/admin/BusinessSizes";
import Categories from "../pages/admin/Categories";
import Features from "../pages/admin/Features";
import Industries from "../pages/admin/Industries";
import Integrations from "../pages/admin/Integrations";
import Partners from "../pages/admin/Partners";
import Reviews from "../pages/admin/Reviews";
import AdminSettings from "../pages/admin/Settings";
import Software from "../pages/admin/Software";
import UsersRoles from "../pages/admin/UsersRoles";
import Vendors from "../pages/admin/Vendors";

// ============================================================
// AUTH CONTEXT
// ============================================================
import { useAuthContext } from "../context/AuthContext";

// ============================================================
// ADMIN GUARD
// ============================================================

function AdminGuard({ children }) {
  const { loading, isAuthenticated, hasRole } = useAuthContext();

  /*
  |--------------------------------------------------------------------------
  | Authentication Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="admin-state">
        <h2>Checking authentication...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Authentication Check
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /*
  |--------------------------------------------------------------------------
  | RBAC Role Check
  |--------------------------------------------------------------------------
  |
  | AuthContext membaca role dari:
  |
  | user.roles[].name
  |
  | Backend:
  |
  | roles: [
  |   {
  |     name: "admin",
  |     permissions: [...]
  |   }
  | ]
  |
  */

  if (!hasRole("admin")) {
    return <Navigate to="/" replace />;
  }

  /*
  |--------------------------------------------------------------------------
  | Authorized
  |--------------------------------------------------------------------------
  */

  return children;
}

// ============================================================
// ACCOUNT GUARD
// ============================================================

function AccountGuard({ children }) {
  const { loading, isAuthenticated } = useAuthContext();

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="admin-state">
        <h2>Checking authentication...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ============================================================
// ACCOUNT PAGE WRAPPER
// ============================================================

function AccountPage({ children }) {
  return <AccountLayout>{children}</AccountLayout>;
}

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================================
            PUBLIC
        ====================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/software" element={<SoftwareDirectory />} />

        <Route path="/software/:slug" element={<SoftwareDetail />} />

        <Route path="/compare" element={<Compare />} />

        <Route path="/recommend" element={<Recommend />} />

        <Route
          path="/recommendation-result"
          element={<RecommendationResult />}
        />

        <Route path="/implementation" element={<Implementation />} />

        <Route path="/learn" element={<Learn />} />

        <Route path="/learn/:slug" element={<ArticleDetail />} />

        {/* ======================================================
            AUTHENTICATION
        ====================================================== */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ======================================================
            ACCOUNT
        ====================================================== */}

        {/* Account Overview */}
        <Route
          path="/account"
          element={
            <AccountGuard>
              <AccountPage>
                <Account />
              </AccountPage>
            </AccountGuard>
          }
        />

        {/* Profile */}
        <Route
          path="/account/profile"
          element={
            <AccountGuard>
              <AccountPage>
                <Profile />
              </AccountPage>
            </AccountGuard>
          }
        />

        {/* Saved Software */}
        <Route
          path="/account/saved"
          element={
            <AccountGuard>
              <AccountPage>
                <SavedSoftware />
              </AccountPage>
            </AccountGuard>
          }
        />

        {/* My Comparisons */}
        <Route
          path="/account/comparisons"
          element={
            <AccountGuard>
              <AccountPage>
                <Comparisons />
              </AccountPage>
            </AccountGuard>
          }
        />

        {/* Implementation Requests */}
        <Route
          path="/account/implementations"
          element={
            <AccountGuard>
              <AccountPage>
                <ImplementationRequests />
              </AccountPage>
            </AccountGuard>
          }
        />

        {/* Account Settings */}
        <Route
          path="/account/settings"
          element={
            <AccountGuard>
              <AccountPage>
                <Settings />
              </AccountPage>
            </AccountGuard>
          }
        />

        {/* ======================================================
            ADMIN
        ====================================================== */}

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Dashboard />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <Dashboard />
            </AdminGuard>
          }
        />

        {/* ======================================================
            CATALOG
        ====================================================== */}

        <Route
          path="/admin/software"
          element={
            <AdminGuard>
              <Software />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/vendors"
          element={
            <AdminGuard>
              <Vendors />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminGuard>
              <Categories />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/features"
          element={
            <AdminGuard>
              <Features />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/industries"
          element={
            <AdminGuard>
              <Industries />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/business-sizes"
          element={
            <AdminGuard>
              <BusinessSizes />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/integrations"
          element={
            <AdminGuard>
              <Integrations />
            </AdminGuard>
          }
        />

        {/* ======================================================
            ENGAGEMENT
        ====================================================== */}

        <Route
          path="/admin/reviews"
          element={
            <AdminGuard>
              <Reviews />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/implementation-leads"
          element={
            <AdminGuard>
              <AdminLeads />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/partners"
          element={
            <AdminGuard>
              <Partners />
            </AdminGuard>
          }
        />

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <Route
          path="/admin/articles"
          element={
            <AdminGuard>
              <Articles />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/tutorials"
          element={
            <AdminGuard>
              <Articles />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/case-studies"
          element={
            <AdminGuard>
              <Articles />
            </AdminGuard>
          }
        />

        {/* ======================================================
            ANALYTICS
        ====================================================== */}

        <Route
          path="/admin/analytics"
          element={
            <AdminGuard>
              <Analytics />
            </AdminGuard>
          }
        />

        {/* ======================================================
            SYSTEM
        ====================================================== */}

        <Route
          path="/admin/users"
          element={
            <AdminGuard>
              <UsersRoles />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/users-roles"
          element={
            <AdminGuard>
              <UsersRoles />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminGuard>
              <AdminSettings />
            </AdminGuard>
          }
        />

        <Route
          path="/admin/audit-logs"
          element={
            <AdminGuard>
              <AuditLogs />
            </AdminGuard>
          }
        />

        {/* ======================================================
            LEGACY REDIRECTS
        ====================================================== */}

        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        <Route
          path="/admin/implementation"
          element={<Navigate to="/admin/implementation-leads" replace />}
        />

        {/* ======================================================
            FALLBACK
        ====================================================== */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                padding: "40px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h1>Route Not Found</h1>

                <p>Current URL: {window.location.pathname}</p>

                <a href="/">Back to Home</a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
