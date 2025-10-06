import { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux'; // Bridge to Redux user

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const reduxUser = useSelector((state) => state.auth.user);
    const [AuthState] = useState({ user: reduxUser || { roles: [65] } }); // Mock admin

    return (
        <AuthContext.Provider value={{ AuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);