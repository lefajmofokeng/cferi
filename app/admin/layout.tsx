import AdminSidebar from "@/components/admin/AdminSidebar";
import QuickActionsRail from "@/components/admin/QuickActionsRail";
import AdminHeader from "@/components/admin/AdminHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maluti Admin Console",
  manifest: "/manifest-admin.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Maluti Admin",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="flex-1">{children}</div>
      </div>
      <QuickActionsRail />
    </div>
  );
}
