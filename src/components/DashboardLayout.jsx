import { Outlet } from 'react-router-dom';
import Aside from './Aside';
import bg from '../assets/images/bg.png'
const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <Aside />
            <main className="flex-1 p-8 bg-[#121212] overflow-y-auto">
                <img src={bg} alt="Background" className="absolute inset-0 object-cover w-full h-full z-[1] pointer-events-none" />
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;