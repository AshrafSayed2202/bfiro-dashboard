/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
    const location = useLocation();
    const currentPath = location.pathname;

    // Active checks
    const isDashboardActive = currentPath === '/';
    const productsPaths = ['/ui-kits', '/code', '/icons', '/illustrations', '/fonts'];
    const isProductsActive = productsPaths.includes(currentPath);
    const isUiKitsActive = currentPath === '/ui-kits';
    const isCodeActive = currentPath === '/code';
    const isIconsActive = currentPath === '/icons';
    const isIllustrationsActive = currentPath === '/illustrations';
    const isFontsActive = currentPath === '/fonts';
    const isPricingActive = currentPath === '/pricing';
    const isContactActive = currentPath === '/contact-us';
    const uxCampPaths = ['/ux-camp/pricing', '/ux-camp/status', '/ux-camp/sessions', '/ux-camp/users', '/ux-camp/materials'];
    const isUxCampActive = uxCampPaths.includes(currentPath);
    const isUxPricingActive = currentPath === '/ux-camp/pricing';
    const isStatusActive = currentPath === '/ux-camp/status';
    const isSessionsActive = currentPath === '/ux-camp/sessions';
    const isUxUsersActive = currentPath === '/ux-camp/users';
    const isMaterialsActive = currentPath === '/ux-camp/materials';
    const isUsersActive = currentPath === '/users';
    const isLogoutActive = currentPath === '/login';

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openCategories, setOpenCategories] = useState({ products: isProductsActive, uxCamp: isUxCampActive });
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

    // Button active states (active if URL matches or category is open)
    const isProductsButtonActive = isProductsActive || openCategories.products;
    const isUxCampButtonActive = isUxCampActive || openCategories.uxCamp;

    return (
        <motion.aside
            className="h-screen bg-[#171718CC] text-[#9CA7B4] flex flex-col border-r border-[#424242] scrollbar-hide relative"
            initial="expanded"
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={sidebarVariants}
            transition={{ duration: 0.3 }}
        >
            <button onClick={toggleCollapse} className={`text-xl absolute top-4 left-full bg-[#171718CC] p-1 rounded-r-full border border-[#424242] z-10 ${isCollapsed ? 'block' : 'hidden'}`}>
                <FaChevronRight />
            </button>
            <div className="flex items-center justify-between p-4">
                <img src={Logo} alt="Logo" className="w-10" />
                <button onClick={toggleCollapse} className="text-xl">
                    {isCollapsed ? null : <FaChevronLeft />}
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto scrollbar-hide">
                <ul className={`${isCollapsed ? '' : 'px-4'}`}>
                    <li>
                        <Link
                            to="/"
                            className={`flex trans-3 items-center p-4 hover:bg-[#333] ${isCollapsed ? "" : "rounded-[10px]"} ${isDashboardActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                        >
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Dashboard active={isDashboardActive} />
                            </div>
                            {!isCollapsed && 'Dashboard'}
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => toggleCategory('products')}
                            className={`flex trans-3 items-center p-4 w-full text-left hover:bg-[#333] ${isCollapsed ? "" : "rounded-[10px]"} ${isProductsButtonActive ? 'text-white' : ''}`}
                        >
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Products active={isProductsButtonActive} />
                            </div>
                            {!isCollapsed && 'Products'}
                            {!isCollapsed && (openCategories.products ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />)}
                        </button>
                        <motion.ul
                            animate={openCategories.products ? 'open' : 'closed'}
                            variants={submenuVariants}
                            className={`overflow-hidden border-[#424242] ${isCollapsed ? 'border-l-[3px]' : 'border-l-[1px]'}`}
                        >
                            <li>
                                <Link
                                    to="/ui-kits"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isUiKitsActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <UiKits active={isUiKitsActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>UI Kits</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/code"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isCodeActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Code active={isCodeActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Code</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/icons"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isIconsActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Icons active={isIconsActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Icons</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/illustrations"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isIllustrationsActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Illustrations active={isIllustrationsActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Illustrations</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/fonts"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isFontsActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center bg-[#5B5E79] mr-2'>
                                        <Fonts active={isFontsActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Fonts</span>
                                </Link>
                            </li>
                        </motion.ul>
                    </li>
                    <li>
                        <Link
                            to="/pricing"
                            className={`flex trans-3 items-center p-4 hover:bg-[#333] ${isCollapsed ? "" : "rounded-[10px]"} ${isPricingActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                        >
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Pricing active={isPricingActive} />
                            </div>
                            {!isCollapsed && 'Pricing'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contact-us"
                            className={`flex trans-3 items-center p-4 hover:bg-[#333] ${isCollapsed ? "" : "rounded-[10px]"} ${isContactActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                        >
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Contact active={isContactActive} />
                            </div>
                            {!isCollapsed && 'Contact Us'}
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => toggleCategory('uxCamp')}
                            className={`flex trans-3 items-center p-4 w-full text-left hover:bg-[#333] ${isCollapsed ? "" : "rounded-[10px]"} ${isUxCampButtonActive ? 'text-white' : ''}`}
                        >
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <UxCamp active={isUxCampButtonActive} />
                            </div>
                            {!isCollapsed && 'UX Camp'}
                            {!isCollapsed && (openCategories.uxCamp ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />)}
                        </button>
                        <motion.ul
                            animate={openCategories.uxCamp ? 'open' : 'closed'}
                            variants={submenuVariants}
                            className={`overflow-hidden border-[#424242] ${isCollapsed ? 'border-l-[3px]' : 'border-l-[1px]'}`}
                        >
                            <li>
                                <Link
                                    to="/ux-camp/pricing"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isUxPricingActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Pricing active={isUxPricingActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Pricing</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/ux-camp/status"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isStatusActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Status active={isStatusActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Status</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/ux-camp/sessions"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isSessionsActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Sessions active={isSessionsActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Sessions</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/ux-camp/users"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isUxUsersActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <UxUsers active={isUxUsersActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Users</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/ux-camp/materials"
                                    className={`flex trans-3 items-center ${isCollapsed ? "!p-4" : "pl-8 rounded-r-[10px]"} p-2 hover:bg-[#333] ${isMaterialsActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                                >
                                    <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                        <Materials active={isMaterialsActive} />
                                    </div>
                                    <span className={`${isCollapsed ? "hidden" : "block"}`}>Materials</span>
                                </Link>
                            </li>
                        </motion.ul>
                    </li>
                    <li>
                        <Link
                            to="/users"
                            className={`flex trans-3 items-center p-4 hover:bg-[#333] ${isCollapsed ? "" : "rounded-[10px]"} ${isUsersActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                        >
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Users active={isUsersActive} />
                            </div>
                            {!isCollapsed && 'Users'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/login"
                            className={`flex trans-3 items-center p-4 hover:bg-[#333] ${isCollapsed ? "" : "rounded-[10px]"} ${isLogoutActive ? '!bg-[#1D2030] text-[#1FCCFF]' : ''}`}
                        > {/* Assuming logout navigates to login */}
                            <div className='size-[24px] min-w-[24px] rounded-full flex items-center justify-center mr-2'>
                                <Logout active={isLogoutActive} />
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