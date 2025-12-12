import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Welcome from './pages/Welcome';
import {  DirectoryList, CongregationDetails } from './pages/directory';
import { EventList, EventDetails } from './pages/events';
import MainLayout from './pages/home/MainLayout';
import NotFound from './pages/NotFound';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import AdminLayout from './pages/admin/AdminLayout';


const AppRoutes= ()=> {
  return (
    <div>
        <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />

              <Route path="/directory" element={<DirectoryList />} />
              <Route path="/directory/:id" element={<CongregationDetails />} />

              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />

              {/* <Route path="/about" element={<div className='max-w-7xl mx-auto p-6'>About page (todo)</div>} /> */}
            <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/*" element={<div className='max-w-7xl mx-auto p-6'>Dashboard (todo)</div>} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="/admin/*" element={<div className='max-w-7xl mx-auto p-6'>Dashboard (todo)</div>} />
            </Route>

        </Routes>
    </div>
  );
}

export default AppRoutes;
