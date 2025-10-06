import { Outlet } from 'react-router-dom';
import Aside from './Aside';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <Aside />
            <main className="flex-1 p-8 bg-[#121212] overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;