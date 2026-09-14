export default function AdminHeader({ title = "Dashboard", user }) {
  const userName = user?.name || "Admin";
  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="admin-top">
      <h2>{title}</h2>

      <div className="admin-user">
        <span className="avatar">{initials}</span>

        <span>
          <b>{userName}</b>
          <small>Super Admin</small>
        </span>
      </div>
    </header>
  );
}
