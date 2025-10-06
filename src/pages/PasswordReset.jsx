import { Link } from 'react-router-dom';

const PasswordReset = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-[#121212]">
            <div className="text-white">
                <h1>Password Reset Page (Placeholder)</h1>
                <Link to="/login" className="text-blue-400">Go to Login</Link>
            </div>
        </div>
    );
};

export default PasswordReset;