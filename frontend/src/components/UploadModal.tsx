import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Shield, Lock, File } from 'lucide-react';
import api from '../api';
import { generateEncryptionKey, exportKey, encryptFile } from '../utils/cryptoUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal = ({ isOpen, onClose, onUploadSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setEncryptionKey(null);

    try {
      const key = await generateEncryptionKey();
      const exportedKey = await exportKey(key);
      const { encryptedBlob, iv } = await encryptFile(file, key);

      const formData = new FormData();
      formData.append('iv', btoa(String.fromCharCode(...iv)));
      formData.append('file', encryptedBlob, file.name);

      await api.post('/files/upload', formData);

      setEncryptionKey(exportedKey);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setFile(null);
    setEncryptionKey(null);
    onClose();
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
            onClick={encryptionKey ? undefined : closeModal}
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel p-8 w-full max-w-md relative z-10 border border-white/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-trustlock-textPrimary flex items-center gap-2">
                <Shield className="text-trustlock-accent w-6 h-6" /> Secure Upload
              </h2>
              {!encryptionKey && (
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition bg-gray-100 hover:bg-gray-200 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {encryptionKey ? (
              <div className="bg-white p-6 rounded-2xl shadow-inner border border-green-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2 relative z-10">Upload Successful!</h3>
                <p className="text-sm text-gray-600 mb-4 relative z-10">Save this decryption key. It is required to download the file. We do NOT store this key.</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-sm break-all mb-6 shadow-sm relative z-10">
                  {encryptionKey}
                </div>
                <button onClick={() => { onUploadSuccess(); closeModal(); }} className="btn-primary w-full relative z-10">
                  I have saved the key
                </button>
              </div>
            ) : (
              <>
                <div className="border-2 border-dashed border-trustlock-accent/30 rounded-2xl p-8 text-center bg-blue-50/50 transition-colors hover:bg-blue-50">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="hidden" 
                    id="file-upload" 
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="bg-white p-4 rounded-full shadow-soft-3d mb-4 text-trustlock-accent">
                      <File className="w-8 h-8" />
                    </div>
                    <span className="font-semibold text-trustlock-textPrimary">{file ? file.name : 'Select a file to encrypt'}</span>
                    <span className="text-sm text-trustlock-textSecondary mt-2">Zero-knowledge AES-256-GCM encryption will be applied locally before upload.</span>
                  </label>
                </div>
                <button 
                  onClick={handleUpload} 
                  disabled={!file || uploading}
                  className={`w-full mt-6 py-4 text-lg flex items-center justify-center gap-2 ${(!file || uploading) ? 'bg-gray-200 text-gray-400 cursor-not-allowed rounded-xl font-semibold' : 'btn-primary'}`}
                >
                  {uploading ? (
                    <span className="animate-pulse">Encrypting & Uploading...</span>
                  ) : (
                    <><Upload className="w-5 h-5" /> Encrypt & Upload</>
                  )}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
