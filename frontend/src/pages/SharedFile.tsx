import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, File as FileIcon, Lock } from 'lucide-react';
import api from '../api';
import { importKey, decryptFile } from '../utils/cryptoUtils';

const SharedFile = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [fileData, setFileData] = useState<any>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post(`/share/${token}`, { password });
      setFileData(response.data.file);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access denied');
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!decryptionKey) {
      setError('Decryption key is required');
      return;
    }

    try {
      const response = await api.get(`/files/download/${fileData._id}`, {
        responseType: 'blob'
      });

      const encryptedBlob = response.data;
      const key = await importKey(decryptionKey);
      
      const ivBinaryString = atob(fileData.iv);
      const iv = new Uint8Array(ivBinaryString.length);
      for (let i = 0; i < ivBinaryString.length; i++) {
        iv[i] = ivBinaryString.charCodeAt(i);
      }

      const decryptedBlob = await decryptFile(encryptedBlob, key, iv, fileData.mimeType);

      const url = window.URL.createObjectURL(decryptedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Decryption failed', error);
      setError('Decryption failed. Invalid key or corrupted file.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel p-10 rounded-lg shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-trustlock-accentSecondary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-trustlock-accent/10 rounded-full blur-2xl"></div>

        <h2 className="text-2xl font-bold text-center mb-6 text-trustlock-textPrimary flex justify-center items-center gap-2 relative z-10">
          <div className="p-2 bg-gradient-to-br from-trustlock-accentSecondary to-purple-400 rounded-lg text-white shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          Secure Shared File
        </h2>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center relative z-10 font-medium">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleAccess} className="flex flex-col gap-4 relative z-10">
            <p className="text-trustlock-textSecondary text-sm text-center mb-4 bg-white/50 p-4 rounded-xl shadow-inner border border-gray-100">
              This file has been securely shared with you. If it's password protected, please enter it below.
            </p>
            <div>
              <label className="block text-trustlock-textSecondary text-sm font-semibold mb-2 ml-1">Access Password (if any)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full px-4 py-3 text-trustlock-textPrimary"
                placeholder="Password"
              />
            </div>
            <button 
              type="submit"
              className="btn-primary mt-2"
            >
              Access File
            </button>
          </form>
        ) : (
          <form onSubmit={handleDownload} className="flex flex-col gap-4 relative z-10">
            <div className="bg-white p-6 rounded-2xl shadow-soft-3d border border-gray-100 text-center mb-2">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-trustlock-accent">
                <FileIcon className="w-8 h-8" />
              </div>
              <p className="text-trustlock-textPrimary font-bold break-all mb-1">{fileData?.originalName}</p>
              <p className="text-trustlock-textSecondary text-sm font-medium">{(fileData?.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            <div className="mt-2">
              <label className="block text-trustlock-textSecondary text-sm font-semibold mb-1 ml-1">Decryption Key</label>
              <p className="text-xs text-trustlock-accentSecondary mb-3 ml-1 font-medium">You must ask the sender for the decryption key.</p>
              <input 
                type="text" 
                required
                value={decryptionKey}
                onChange={(e) => setDecryptionKey(e.target.value)}
                className="glass-input w-full px-4 py-3 text-trustlock-textPrimary font-mono text-sm"
                placeholder="Enter base64 key..."
              />
            </div>

            <button 
              type="submit"
              className="btn-primary mt-4 flex justify-center items-center gap-2"
            >
              <Download className="w-5 h-5" /> Decrypt & Download
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SharedFile;
