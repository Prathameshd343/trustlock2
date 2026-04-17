import { useState, useEffect } from 'react';
import { Upload, File as FileIcon, Search, Download, Share2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import UploadModal from '../components/UploadModal';
import ShareModal from '../components/ShareModal';
import api from '../api';
import { importKey, decryptFile } from '../utils/cryptoUtils';

interface FileData {
  _id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  iv: string;
  status?: string;
}

const Dashboard = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [shareFile, setShareFile] = useState<{ id: string, name: string } | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownload = async (file: FileData) => {
    const keyString = prompt('Enter your 32-character base64 decryption key for this file:');
    if (!keyString) return;

    try {
      const response = await api.get(`/files/download/${file._id}`, {
        responseType: 'blob'
      });

      const encryptedBlob = response.data;
      const key = await importKey(keyString);
      
      const ivBinaryString = atob(file.iv);
      const iv = new Uint8Array(ivBinaryString.length);
      for (let i = 0; i < ivBinaryString.length; i++) {
        iv[i] = ivBinaryString.charCodeAt(i);
      }

      const decryptedBlob = await decryptFile(encryptedBlob, key, iv, file.mimeType);

      const url = window.URL.createObjectURL(decryptedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Decryption failed', error);
      alert('Decryption failed. Invalid key or corrupted file.');
    }
  };

  const filteredFiles = files.filter(f => f.originalName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-trustlock-textPrimary tracking-tight">My Files</h1>
          <p className="text-trustlock-textSecondary mt-1">Manage and securely share your encrypted data.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Upload className="w-5 h-5" /> Secure Upload
        </button>
      </div>

      <div className="glass-panel p-6 mb-8">
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search secure files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full pl-12 pr-4 py-3 text-trustlock-textPrimary"
            />
          </div>
          <div className="flex bg-white/50 border border-gray-200 rounded-xl p-1">
             <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'grid' ? 'bg-white shadow text-trustlock-accent' : 'text-gray-500 hover:text-gray-700'}`}>Grid</button>
             <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'list' ? 'bg-white shadow text-trustlock-accent' : 'text-gray-500 hover:text-gray-700'}`}>List</button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={file._id} 
              className="glass-panel p-5 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-trustlock-accent/5 rounded-full blur-xl group-hover:bg-trustlock-accent/10 transition-colors"></div>
              
              <div className="bg-white w-12 h-12 rounded-xl shadow-soft-3d flex items-center justify-center mb-4 text-trustlock-accent">
                <FileIcon className="w-6 h-6" />
              </div>
              
              <h3 className="font-semibold text-trustlock-textPrimary truncate mb-1 relative z-10" title={file.originalName}>{file.originalName}</h3>
              <p className="text-xs text-trustlock-textSecondary relative z-10 mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt).toLocaleDateString()}
              </p>
              
              {file.status === 'pending_approval' && (
                 <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded mb-4">Pending Approval</span>
              )}

              <div className="flex gap-2 relative z-10">
                <button onClick={() => setShareFile({ id: file._id, name: file.originalName })} className="flex-1 bg-white border border-gray-200 text-trustlock-textSecondary hover:text-trustlock-accentHover hover:border-trustlock-accent/30 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1 shadow-sm hover:shadow">
                  <Share2 className="w-4 h-4"/> Share
                </button>
                <button onClick={() => handleDownload(file)} className="flex-1 bg-white border border-gray-200 text-trustlock-textSecondary hover:text-trustlock-accentHover hover:border-trustlock-accent/30 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1 shadow-sm hover:shadow">
                  <Download className="w-4 h-4"/> Decrypt
                </button>
              </div>
            </motion.div>
          ))}
          {filteredFiles.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 font-medium glass-panel border-dashed">
              No secure files found.
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="py-4 px-6 font-semibold text-trustlock-textSecondary">Name</th>
                <th className="py-4 px-6 font-semibold text-trustlock-textSecondary">Size</th>
                <th className="py-4 px-6 font-semibold text-trustlock-textSecondary">Uploaded</th>
                <th className="py-4 px-6 font-semibold text-trustlock-textSecondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map(file => (
                <tr key={file._id} className="border-b border-gray-100 hover:bg-white/40 transition">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-trustlock-accent"><FileIcon className="w-5 h-5"/></div>
                    <span className="font-medium text-trustlock-textPrimary">{file.originalName}</span>
                    {file.status === 'pending_approval' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">Pending Approval</span>}
                  </td>
                  <td className="py-4 px-6 text-trustlock-textSecondary">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                  <td className="py-4 px-6 text-trustlock-textSecondary">{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShareFile({ id: file._id, name: file.originalName })} className="p-2 text-gray-400 hover:text-trustlock-accent bg-white rounded-lg shadow-sm border border-gray-100 transition"><Share2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDownload(file)} className="p-2 text-gray-400 hover:text-trustlock-accent bg-white rounded-lg shadow-sm border border-gray-100 transition"><Download className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400 font-medium">No files found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={() => {
          setIsUploadOpen(false);
          fetchFiles();
        }} 
      />

      <ShareModal
        isOpen={!!shareFile}
        onClose={() => setShareFile(null)}
        fileId={shareFile?.id || null}
        fileName={shareFile?.name || ''}
      />
    </div>
  );
};

export default Dashboard;
