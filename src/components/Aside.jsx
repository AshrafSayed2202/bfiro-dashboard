import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import { FaTachometerAlt, FaBox, FaDollarSign, FaEnvelope, FaCampground, FaUsers, FaSignOutAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux'; // For user from Redux

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
            className="h-screen bg-[#1f1f1f] text-white flex flex-col border-r border-[#424242]"
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
                <ul>
                    <li>
                        <Link to="/" className="flex items-center p-4 hover:bg-[#333]">
                            <FaTachometerAlt className="mr-2" />
                            {!isCollapsed && 'Dashboard'}
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => toggleCategory('products')} className="flex items-center p-4 w-full text-left hover:bg-[#333]">
                            <FaBox className="mr-2" />
                            {!isCollapsed && 'Products'}
                            {!isCollapsed && (openCategories.products ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />)}
                        </button>
                        <motion.ul
                            animate={openCategories.products ? 'open' : 'closed'}
                            variants={submenuVariants}
                            className="overflow-hidden"
                        >
                            <li><Link to="/ui-kits" className="flex items-center pl-8 p-2 hover:bg-[#333]">UI Kits</Link></li>
                            <li><Link to="/code" className="flex items-center pl-8 p-2 hover:bg-[#333]">Code</Link></li>
                            <li><Link to="/icons" className="flex items-center pl-8 p-2 hover:bg-[#333]">Icons</Link></li>
                            <li><Link to="/illustrations" className="flex items-center pl-8 p-2 hover:bg-[#333]">Illustrations</Link></li>
                            <li><Link to="/fonts" className="flex items-center pl-8 p-2 hover:bg-[#333]">Fonts</Link></li>
                        </motion.ul>
                    </li>
                    <li>
                        <Link to="/pricing" className="flex items-center p-4 hover:bg-[#333]">
                            <FaDollarSign className="mr-2" />
                            {!isCollapsed && 'Pricing'}
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact-us" className="flex items-center p-4 hover:bg-[#333]">
                            <FaEnvelope className="mr-2" />
                            {!isCollapsed && 'Contact Us'}
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => toggleCategory('uxCamp')} className="flex items-center p-4 w-full text-left hover:bg-[#333]">
                            <FaCampground className="mr-2" />
                            {!isCollapsed && 'UX Camp'}
                            {!isCollapsed && (openCategories.uxCamp ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />)}
                        </button>
                        <motion.ul
                            animate={openCategories.uxCamp ? 'open' : 'closed'}
                            variants={submenuVariants}
                            className="overflow-hidden"
                        >
                            <li><Link to="/ux-camp/pricing" className="flex items-center pl-8 p-2 hover:bg-[#333]">Pricing</Link></li>
                            <li><Link to="/ux-camp/status" className="flex items-center pl-8 p-2 hover:bg-[#333]">Status</Link></li>
                            <li><Link to="/ux-camp/sessions" className="flex items-center pl-8 p-2 hover:bg-[#333]">Sessions</Link></li>
                            <li><Link to="/ux-camp/users" className="flex items-center pl-8 p-2 hover:bg-[#333]">Users</Link></li>
                            <li><Link to="/ux-camp/materials" className="flex items-center pl-8 p-2 hover:bg-[#333]">Materials</Link></li>
                        </motion.ul>
                    </li>
                    <li>
                        <Link to="/users" className="flex items-center p-4 hover:bg-[#333]">
                            <FaUsers className="mr-2" />
                            {!isCollapsed && 'Users'}
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="flex items-center p-4 hover:bg-[#333]"> {/* Assuming logout navigates to login */}
                            <FaSignOutAlt className="mr-2" />
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