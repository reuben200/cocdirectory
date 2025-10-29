import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Welcome from './pages/Welcome';


const AppRoutes= ()=> {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />

        </Routes>
    </div>
  );
}

export default AppRoutes;
