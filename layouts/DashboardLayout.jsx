import React from "react";
import Sidebar from "../src/components/Sidebar";
import Navbar from "../src/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
