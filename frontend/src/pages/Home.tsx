import { motion } from 'framer-motion';
import { Shield, Lock, Share2, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-trustlock-accent to-trustlock-glow rounded-3xl flex items-center justify-center shadow-lg shadow-trustlock-glow/40 mb-8"
        >
          <Lock className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-6xl font-extrabold mb-6 text-trustlock-textPrimary tracking-tight">
          Secure Your Data with <span className="text-transparent bg-clip-text bg-gradient-to-r from-trustlock-accent to-trustlock-glow">TrustLock</span>
        </h1>
        
        <p className="text-xl text-trustlock-textSecondary mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate zero-knowledge platform for enterprise data sharing. 
          Your files are encrypted in your browser. We never see your keys.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            Get Started for Free
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4">
            Sign In
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl">
        {[
          { icon: <Shield className="w-8 h-8 text-trustlock-accent" />, title: "Zero Knowledge", desc: "Client-side AES-256-GCM encryption." },
          { icon: <Share2 className="w-8 h-8 text-trustlock-accentSecondary" />, title: "Secure Sharing", desc: "Granular permissions & expiring links." },
          { icon: <Server className="w-8 h-8 text-trustlock-glow" />, title: "Enterprise Ready", desc: "Multi-tenant architecture & workflow automation." }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className="glass-panel p-8 text-left hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-soft-3d mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-trustlock-textPrimary mb-3">{feature.title}</h3>
            <p className="text-trustlock-textSecondary leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
