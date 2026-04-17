import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel mx-4 mt-4 py-4 px-6 sticky top-4 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-trustlock-textPrimary flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-trustlock-accent to-trustlock-glow rounded-lg text-white shadow-lg">
            <Lock className="w-5 h-5" />
          </div>
          TrustLock
        </Link>
        <div className="flex gap-6 items-center">
          {token ? (
            <>
              <Link to="/enterprise" className="text-trustlock-accentSecondary hover:text-purple-600 transition font-medium text-sm flex items-center gap-1 border border-trustlock-accentSecondary/30 px-3 py-1.5 rounded-lg bg-trustlock-accentSecondary/10 shadow-sm">Enterprise Admin</Link>
              <Link to="/dashboard" className="text-trustlock-textSecondary hover:text-trustlock-textPrimary transition font-medium">Dashboard</Link>
              <span className="text-trustlock-textSecondary text-sm border-l border-gray-200 pl-4 font-medium">Hi, {user?.name?.split(' ')[0]}</span>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 transition flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg font-medium"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-trustlock-textSecondary hover:text-trustlock-textPrimary transition font-medium">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
