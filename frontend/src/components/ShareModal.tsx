import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Link, Check, Lock } from 'lucide-react';
import api from '../api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fileId: string | null;
  fileName: string;
}

const ShareModal = ({ isOpen, onClose, fileId, fileName }: Props) => {
  const [expiresIn, setExpiresIn] = useState('24h');
  const [password, setPassword] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateLink = async () => {
    if (!fileId) return;
    setLoading(true);
    try {
      const payload: any = { fileId, expiresIn };
      if (password) payload.password = password;

      const response = await api.post('/share', payload);
      setShareLink(`${window.location.origin}/share/${response.data.token}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel p-8 w-full max-w-md relative z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-trustlock-textPrimary flex items-center gap-2">
                <Share2 className="text-trustlock-accentSecondary w-6 h-6" /> Share File
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl mb-6 shadow-inner">
              <p className="text-sm text-purple-800 font-medium break-all">
                Sharing: <strong>{fileName}</strong>
              </p>
            </div>

            {shareLink ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-inner">
                  <p className="text-green-800 font-semibold mb-2">Secure Link Generated!</p>
                  <p className="text-xs text-green-700 mb-4">You will still need to send the recipient your decryption key via a secure channel.</p>
                  <div className="flex bg-white rounded-lg border border-green-200 overflow-hidden shadow-sm">
                    <input 
                      type="text" 
                      value={shareLink} 
                      readOnly 
                      className="bg-transparent text-sm p-3 w-full outline-none text-gray-700" 
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-4 transition flex items-center justify-center font-medium"
                    >
                      {copied ? <Check className="w-5 h-5" /> : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-trustlock-textSecondary mb-2 ml-1">Expiration Time</label>
                  <select 
                    value={expiresIn} 
                    onChange={e => setExpiresIn(e.target.value)}
                    className="glass-input w-full px-4 py-3 text-trustlock-textPrimary appearance-none bg-white"
                  >
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-trustlock-textSecondary mb-2 ml-1 flex items-center gap-1">
                    <Lock className="w-4 h-4"/> Optional Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="Require password to access link" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="glass-input w-full px-4 py-3 text-trustlock-textPrimary"
                  />
                </div>

                <button 
                  onClick={handleCreateLink}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-trustlock-accentSecondary to-purple-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 mt-2 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? 'Generating...' : <><Link className="w-5 h-5"/> Generate Link</>}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
