import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="sticky top-0 bg-gray-100 dark:bg-gray-800 shadow-md z-20">
        <Navbar />
      </header>

      <main className="grow bg-gray-50 dark:bg-gray-800">
        <Outlet />
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 shadow-inner mt-8">
        <div className="mx-auto px-4 py-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Church Directory. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
