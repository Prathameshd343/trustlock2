import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import SharedFile from './pages/SharedFile';
import EnterpriseDashboard from './pages/EnterpriseDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/enterprise" element={<EnterpriseDashboard />} />
            <Route path="/share/:token" element={<SharedFile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
