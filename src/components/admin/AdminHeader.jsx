import { useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function getAvatarUrl(avatar) {
  if (typeof avatar !== "string" || !avatar.trim()) {
    return null;
  }

  const value = avatar.trim();

  if (/^(https?:\/\/|data:image\/|blob:)/i.test(value)) {
    return value;
  }

  const path = value.replace(/^\/+/, "");

  if (path.startsWith("storage/")) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}/storage/${path}`;
}

export default function AdminHeader({ title = "Dashboard", user }) {
  const userName = user?.name?.trim() || "Admin";

  const initials =
    userName
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  const avatarUrl = getAvatarUrl(user?.avatar);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <header className="admin-top">
      <h2>{title}</h2>

      <div className="admin-user">
        <span className="avatar">
          {avatarUrl && !imageFailed ? (
            <img
              src={avatarUrl}
              alt={`${userName} profile`}
              className="avatar-image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            initials
          )}
        </span>

        <span className="admin-user-info">
          <b>{userName}</b>
          <small>{user?.roles?.[0]?.name || "Super Admin"}</small>
        </span>
      </div>
    </header>
  );
}
