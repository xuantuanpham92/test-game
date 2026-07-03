import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "扶摇管理后台",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
