import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow w-full px-4 pt-[100px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
