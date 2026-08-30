"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./AdminHeader.css";

export default function AdminHeader() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("admin_users")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name);
        setRole(data.role);
      }
    }
    loadUser();
  }, []);

  return (
    <header className="admin-header">
      <div className="admin-header__user">
        <div className="admin-header__avatar">
          {(fullName || "A").charAt(0).toUpperCase()}
        </div>
        <div className="admin-header__user-info">
          <span className="admin-header__name">{fullName || "Admin"}</span>
          {role && (
            <>
              <span className="admin-header__slash">/</span>
              <span className="admin-header__role">
                {role.replace("_", " ")}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}