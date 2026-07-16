import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  Outlet,
} from "react-router-dom";

export default function MainLayout() {

  return (

    <div className="flex h-screen bg-[#02140f] text-white">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-auto">

          <Outlet />

        </main>

      </div>

    </div>
  );
}