"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import "./AdminHeader.css";

export default function AdminHeader() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  if (pathname === "/admin/login") return null;

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("admin_users")
        .select("full_name, role, avatar_url")
        .eq("id", user.id)
        .single();

        if (data) {
        setFullName(data.full_name);
        setRole(data.role);
        setAvatarUrl(data.avatar_url);
        }
    }
    loadUser();
  }, []);

  return (
    <header className="admin-header">
  <div className="admin-header__user">
    {avatarUrl ? (
      <img src={avatarUrl} alt={fullName} className="admin-header__avatar" />
    ) : (
      <div className="admin-header__avatar admin-header__avatar--placeholder">
        {(fullName || "A").charAt(0).toUpperCase()}
      </div>
    )}
    <div className="admin-header__user-text">
      <span className="admin-header__name">{fullName || "Admin"}</span>
      {role && <span className="admin-header__role">{role.replace("_", " ")}</span>}
    </div>
  </div>
</header>
  );
}