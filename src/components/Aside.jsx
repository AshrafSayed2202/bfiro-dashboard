/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Dashboard from '../assets/svgs/Dashboard';
import Products from '../assets/svgs/Products';
import UiKits from '../assets/svgs/UiKits';
import Code from '../assets/svgs/Code';
import Icons from '../assets/svgs/Icons';
import Illustrations from '../assets/svgs/Illustrations';
import Fonts from '../assets/svgs/Fonts';
import Pricing from '../assets/svgs/Pricing';
import Contact from '../assets/svgs/Contact';
import UxCamp from '../assets/svgs/UxCamp';
import Status from '../assets/svgs/Status';
import Sessions from '../assets/svgs/Sessions';
import UxUsers from '../assets/svgs/UxUsers';
import Materials from '../assets/svgs/Materials';
import Users from '../assets/svgs/Users';
import Logout from '../assets/svgs/Logout';

const Aside = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openCategories, setOpenCategories] = useState({ products: false, uxCamp: false });
    const user = useSelector((state) => state.auth.user); // From Redux

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const toggleCategory = (category) => {
        setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const sidebarVariants = {
        expanded: { width: '250px' },
        collapsed: { width: '60px' },
    };

    const submenuVariants = {
        open: { height: 'auto', opacity: 1 },
        closed: { height: 0, opacity: 0 },
    };

    return (
        <motion.aside
            className="h-screen bg-[#171718CC] text-white flex flex-col border-r border-[#424242]"
            initial="expanded"
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={sidebarVariants}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between p-4">
                <img src={Logo} alt="Logo" className="w-10" />
                <button onClick={toggleCollapse} className="text-xl">
                    {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul className='px-4'>
                    <li>
                        <Link to="/" className="flex items-center p-4 hover:bg-[#333]">
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Dashboard />
                            </div>
                            {!isCollapsed && 'Dashboard'}
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => toggleCategory('products')} className="flex items-center p-4 w-full text-left hover:bg-[#333]">
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Products />
                            </div>
                            {!isCollapsed && 'Products'}
                            {!isCollapsed && (openCategories.products ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />)}
                        </button>
                        <motion.ul
                            animate={openCategories.products ? 'open' : 'closed'}
                            variants={submenuVariants}
                            className="overflow-hidden"
                        >
                            <li>
                                <Link to="/ui-kits" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <UiKits />
                                    </div>
                                    UI Kits
                                </Link>
                            </li>
                            <li>
                                <Link to="/code" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Code />
                                    </div>
                                    Code
                                </Link>
                            </li>
                            <li>
                                <Link to="/icons" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Icons />
                                    </div>
                                    Icons
                                </Link>
                            </li>
                            <li>
                                <Link to="/illustrations" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Illustrations />
                                    </div>
                                    Illustrations
                                </Link>
                            </li>
                            <li>
                                <Link to="/fonts" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Fonts />
                                    </div>
                                    Fonts
                                </Link>
                            </li>
                        </motion.ul>
                    </li>
                    <li>
                        <Link to="/pricing" className="flex items-center p-4 hover:bg-[#333]">
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Pricing />
                            </div>
                            {!isCollapsed && 'Pricing'}
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact-us" className="flex items-center p-4 hover:bg-[#333]">
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Contact />
                            </div>
                            {!isCollapsed && 'Contact Us'}
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => toggleCategory('uxCamp')} className="flex items-center p-4 w-full text-left hover:bg-[#333]">
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <UxCamp />
                            </div>
                            {!isCollapsed && 'UX Camp'}
                            {!isCollapsed && (openCategories.uxCamp ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />)}
                        </button>
                        <motion.ul
                            animate={openCategories.uxCamp ? 'open' : 'closed'}
                            variants={submenuVariants}
                            className="overflow-hidden"
                        >
                            <li>
                                <Link to="/ux-camp/pricing" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Pricing />
                                    </div>
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link to="/ux-camp/status" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Status />
                                    </div>
                                    Status
                                </Link>
                            </li>
                            <li>
                                <Link to="/ux-camp/sessions" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Sessions />
                                    </div>
                                    Sessions
                                </Link>
                            </li>
                            <li>
                                <Link to="/ux-camp/users" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <UxUsers />
                                    </div>
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link to="/ux-camp/materials" className="flex items-center pl-8 p-2 hover:bg-[#333]">
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Materials />
                                    </div>
                                    Materials
                                </Link>
                            </li>
                        </motion.ul>
                    </li>
                    <li>
                        <Link to="/users" className="flex items-center p-4 hover:bg-[#333]">
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Users />
                            </div>
                            {!isCollapsed && 'Users'}
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="flex items-center p-4 hover:bg-[#333]"> {/* Assuming logout navigates to login */}
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Logout />
                            </div>
                            {!isCollapsed && 'Log Out'}
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="p-4 border-t border-[#424242]">
                <div className="flex items-center">
                    <img src={user?.image || 'https://placeholder.co/40'} alt="User" className="w-10 h-10 rounded-full mr-2" />
                    {!isCollapsed && (
                        <div>
                            <p>{user?.name || 'User Name'}</p>
                            <p className="text-sm text-gray-400">{user?.email || 'user@email.com'}</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default Aside;