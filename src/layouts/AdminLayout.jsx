import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuthContext } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const { user } = useAuthContext();

  return (
    <div className="admin-layout">
      <AdminSidebar user={user} />

      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}