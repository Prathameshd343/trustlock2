import { useState, useEffect } from 'react';
import { Building2, Users, Key, Settings, Plus, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

const EnterpriseDashboard = () => {
  const [activeTab, setActiveTab] = useState('org');
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  
  // Organization State
  const [orgName, setOrgName] = useState('');
  const [teamName, setTeamName] = useState('');
  
  // API Key State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');

  // Workflow State
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [wfName, setWfName] = useState('');
  const [wfTrigger, setWfTrigger] = useState('FILE_UPLOADED');
  const [wfAction, setWfAction] = useState('REQUIRE_APPROVAL');

  useEffect(() => {
    if (user.role === 'admin' || user.orgRole === 'owner') {
      fetchApiKeys();
      fetchWorkflows();
    }
  }, [activeTab]);

  const fetchApiKeys = async () => {
    try {
      const res = await api.get('/keys');
      setApiKeys(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchWorkflows = async () => {
    try {
      const res = await api.get('/workflows');
      setWorkflows(res.data);
    } catch (e) { console.error(e); }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/orgs', { name: orgName });
      alert('Organization created! You are now the Owner. Please re-login to see changes.');
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/orgs/teams', { name: teamName });
      alert('Team created!');
      setTeamName('');
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/keys', { name: newKeyName });
      setGeneratedKey(res.data.key);
      setNewKeyName('');
      fetchApiKeys();
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/workflows', { name: wfName, triggerEvent: wfTrigger, action: wfAction });
      alert('Workflow Created!');
      setWfName('');
      fetchWorkflows();
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="w-full relative">
      <h1 className="text-4xl font-bold text-trustlock-textPrimary tracking-tight mb-8 flex items-center gap-3">
        <div className="bg-gradient-to-br from-trustlock-accentSecondary to-purple-400 p-2 rounded-xl shadow-lg shadow-purple-500/20 text-white">
          <Building2 className="w-8 h-8" /> 
        </div>
        Enterprise Admin Panel
      </h1>

      <div className="flex border-b border-gray-200 mb-8 bg-white/50 backdrop-blur-md rounded-t-2xl px-4 pt-2">
        {['org', 'apikeys', 'workflows'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-semibold transition relative ${activeTab === tab ? 'text-trustlock-accentSecondary' : 'text-trustlock-textSecondary hover:text-trustlock-textPrimary'}`}
          >
            {tab === 'org' ? 'Organization & Teams' : tab === 'apikeys' ? 'API Integration' : 'Workflows'}
            {activeTab === tab && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-trustlock-accentSecondary" />
            )}
          </button>
        ))}
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        
        {/* ORGANIZATION TAB */}
        {activeTab === 'org' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h2 className="text-xl font-bold text-trustlock-textPrimary mb-6 flex items-center gap-2 relative z-10"><Building2 className="w-5 h-5 text-trustlock-accent" /> Setup Organization</h2>
              <form onSubmit={handleCreateOrg} className="flex flex-col gap-4 relative z-10">
                <input type="text" placeholder="Organization Name" value={orgName} onChange={e => setOrgName(e.target.value)} className="glass-input w-full px-4 py-3 text-trustlock-textPrimary" />
                <button className="btn-primary py-3 rounded-xl font-bold">Create Organization</button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h2 className="text-xl font-bold text-trustlock-textPrimary mb-6 flex items-center gap-2 relative z-10"><Users className="w-5 h-5 text-trustlock-accentSecondary" /> Create Team</h2>
              <form onSubmit={handleCreateTeam} className="flex flex-col gap-4 relative z-10">
                <input type="text" placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} className="glass-input w-full px-4 py-3 text-trustlock-textPrimary" />
                <button className="bg-gradient-to-r from-trustlock-accentSecondary to-purple-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300">Create Team</button>
              </form>
            </div>
          </div>
        )}

        {/* API KEYS TAB */}
        {activeTab === 'apikeys' && (
          <div>
            <h2 className="text-xl font-bold text-trustlock-textPrimary mb-6 flex items-center gap-2"><Key className="w-5 h-5 text-trustlock-accent" /> Manage API Access Keys</h2>
            <form onSubmit={handleGenerateKey} className="flex gap-4 mb-8">
              <input type="text" placeholder="Key Name (e.g., Salesforce CRM)" required value={newKeyName} onChange={e => setNewKeyName(e.target.value)} className="glass-input w-full px-4 py-3 text-trustlock-textPrimary flex-grow" />
              <button className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap"><Plus className="w-5 h-5"/> Generate Key</button>
            </form>

            {generatedKey && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl mb-8 shadow-sm">
                <h3 className="font-bold flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/> Key Generated Successfully! Copy it now:</h3>
                <p className="font-mono mt-3 bg-white border border-green-100 p-3 rounded-lg text-lg tracking-wider shadow-inner text-green-900">{generatedKey}</p>
                <p className="text-sm mt-3 text-green-600 font-medium">Please save this key securely. You will not be able to see it again.</p>
              </motion.div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50 border-b border-gray-100 text-trustlock-textSecondary"><th className="py-4 px-6 font-semibold">Name</th><th className="py-4 px-6 font-semibold">Created</th><th className="py-4 px-6 font-semibold">Status</th></tr></thead>
                <tbody>
                  {apiKeys.map(k => (
                    <tr key={k._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-medium text-trustlock-textPrimary">{k.name}</td>
                      <td className="py-4 px-6 text-trustlock-textSecondary">{new Date(k.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-green-500 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Active</td>
                    </tr>
                  ))}
                  {apiKeys.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-gray-400">No API keys found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKFLOWS TAB */}
        {activeTab === 'workflows' && (
          <div>
            <h2 className="text-xl font-bold text-trustlock-textPrimary mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-trustlock-glow" /> Automation Rules</h2>
            <form onSubmit={handleCreateWorkflow} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <input type="text" placeholder="Rule Name" required value={wfName} onChange={e => setWfName(e.target.value)} className="glass-input px-4 py-3 text-trustlock-textPrimary" />
              <select value={wfTrigger} onChange={e => setWfTrigger(e.target.value)} className="glass-input px-4 py-3 text-trustlock-textPrimary appearance-none bg-white">
                <option value="FILE_UPLOADED">When File Uploaded</option>
                <option value="FILE_DOWNLOADED">When File Downloaded</option>
              </select>
              <select value={wfAction} onChange={e => setWfAction(e.target.value)} className="glass-input px-4 py-3 text-trustlock-textPrimary appearance-none bg-white">
                <option value="REQUIRE_APPROVAL">Require Approval</option>
                <option value="NOTIFY_ADMIN">Notify Admin</option>
              </select>
              <button className="bg-gradient-to-r from-trustlock-glow to-trustlock-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300 py-3"><Plus className="w-5 h-5"/> Create Rule</button>
            </form>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50 border-b border-gray-100 text-trustlock-textSecondary"><th className="py-4 px-6 font-semibold">Rule Name</th><th className="py-4 px-6 font-semibold">Trigger</th><th className="py-4 px-6 font-semibold">Action</th></tr></thead>
                <tbody>
                  {workflows.map(w => (
                    <tr key={w._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-medium text-trustlock-textPrimary">{w.name}</td>
                      <td className="py-4 px-6"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">{w.triggerEvent}</span></td>
                      <td className="py-4 px-6"><span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">{w.action}</span></td>
                    </tr>
                  ))}
                  {workflows.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-gray-400">No workflow rules found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default EnterpriseDashboard;
