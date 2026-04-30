/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MapPin, 
  Phone, 
  GraduationCap, 
  Contact,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Member {
  full_name: string;
  department: string;
  phone_number: string;
  created_at: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'search'>('register');
  const [formData, setFormData] = useState({
    full_name: '',
    matric_number: '',
    department: '',
    phone_number: '',
    group_number: '',
  });
  const [searchGroup, setSearchGroup] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to register');

      setMessage({ type: 'success', text: 'Registration successful! Your groupmates can now find you.' });
      setFormData({
        full_name: '',
        matric_number: '',
        department: '',
        phone_number: '',
        group_number: '',
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchGroup) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/groups/${searchGroup}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Search failed');

      setSearchResults(data);
      if (data.length === 0) {
        setMessage({ type: 'error', text: 'No members registered yet for this group.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 border-t-8 border-unilag-green">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-unilag-green rounded-xl flex items-center justify-center text-white shadow-lg">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-unilag-green leading-tight">
                UNILAG Lab Registry
              </h1>
              <p className="text-slate-500 font-medium italic">Practical Group Connect</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-full w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'register' ? 'bg-unilag-green text-white shadow-md' : 'text-slate-600 hover:text-unilag-green'}`}
            >
              <UserPlus size={16} /> Register
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'search' ? 'bg-unilag-green text-white shadow-md' : 'text-slate-600 hover:text-unilag-green'}`}
            >
              <Search size={16} /> Find Group
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-medium">{message.text}</p>
            </motion.div>
          )}

          {activeTab === 'register' ? (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
                Student Self-Registration
              </h2>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Full Name</label>
                    <div className="flex items-center">
                      <Users className="absolute left-3 text-slate-400" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Segun Adebayo"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-unilag-green focus:border-transparent transition-all outline-none"
                        value={formData.full_name}
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Matric Number</label>
                      <div className="flex items-center">
                        <Contact className="absolute left-3 text-slate-400" size={18} />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. 1908055XX"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-unilag-green focus:border-transparent transition-all outline-none"
                          value={formData.matric_number}
                          onChange={e => setFormData({...formData, matric_number: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Group Number</label>
                      <div className="flex items-center">
                        <MapPin className="absolute left-3 text-slate-400" size={18} />
                        <input 
                          required
                          type="number" 
                          placeholder="Group #"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-unilag-green focus:border-transparent transition-all outline-none"
                          value={formData.group_number}
                          onChange={e => setFormData({...formData, group_number: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Department</label>
                    <div className="flex items-center">
                      <GraduationCap className="absolute left-3 text-slate-400" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Computer Science"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-unilag-green focus:border-transparent transition-all outline-none"
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">WhatsApp/Phone Number</label>
                    <div className="flex items-center">
                      <Phone className="absolute left-3 text-slate-400" size={18} />
                      <input 
                        required
                        type="tel" 
                        placeholder="e.g. 08123456789"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-unilag-green focus:border-transparent transition-all outline-none"
                        value={formData.phone_number}
                        onChange={e => setFormData({...formData, phone_number: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-unilag-green hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-unilag-green/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Register for My Group'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="search-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">Find Your Group Members</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input 
                    required
                    type="number" 
                    placeholder="Enter Group Number (e.g. 15)"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-unilag-green outline-none transition-all"
                    value={searchGroup}
                    onChange={e => setSearchGroup(e.target.value)}
                  />
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="bg-unilag-green p-3 rounded-xl text-white shadow-lg shadow-unilag-green/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                  </button>
                </form>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Members Found ({searchResults.length})
                    </p>
                    <div className="h-px flex-1 bg-slate-200 mx-4"></div>
                  </div>
                  
                  {searchResults.map((member, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex items-start gap-4 hover:border-unilag-green transition-colors group"
                    >
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-unilag-green group-hover:bg-unilag-green group-hover:text-white transition-all">
                        <Users size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg">{member.full_name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <GraduationCap size={14} className="text-slate-400" /> {member.department}
                          </p>
                          <a 
                            href={`https://wa.me/234${member.phone_number.replace(/^0/, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-unilag-green font-semibold flex items-center gap-1.5 hover:underline"
                          >
                            <Phone size={14} /> {member.phone_number}
                          </a>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        {new Date(member.created_at).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}

                  {searchResults.length < 4 && (
                    <div className="bg-unilag-green/5 border border-dashed border-unilag-green/20 p-6 rounded-2xl text-center">
                      <p className="text-unilag-green font-medium text-sm">
                        Waiting for {4 - searchResults.length} more group members to register...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} UNILAG Lab Practical Registry</p>
        <p className="mt-1">Built to end the WhatsApp group search chaos.</p>
      </footer>
    </div>
  );
}
