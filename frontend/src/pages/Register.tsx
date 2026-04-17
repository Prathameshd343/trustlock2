import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-10 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-trustlock-accentSecondary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-trustlock-glow/10 rounded-full blur-2xl"></div>
        
        <div className="flex justify-center mb-6 relative z-10">
          <div className="p-3 bg-white rounded-2xl shadow-soft-3d">
            <UserPlus className="w-8 h-8 text-trustlock-accentSecondary" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-8 text-trustlock-textPrimary relative z-10">Create Account</h2>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center relative z-10 font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div>
            <label className="block text-trustlock-textSecondary text-sm font-semibold mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input w-full px-4 py-3 text-trustlock-textPrimary"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-trustlock-textSecondary text-sm font-semibold mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-3 text-trustlock-textPrimary"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-trustlock-textSecondary text-sm font-semibold mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-4 py-3 text-trustlock-textPrimary"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary mt-4 py-4 text-lg">
            Create Free Account
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
