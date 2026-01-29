import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileCode, Lock, Plus, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeRepos = () => {
    const [repos, setRepos] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newRepo, setNewRepo] = useState({ name: '', description: '', classification: 'Unclassified', content: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRepos();
    }, []);

    const fetchRepos = async () => {
        try {
            const res = await api.get('/code/');
            setRepos(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/code/', newRepo);
            setIsCreating(false);
            fetchRepos();
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to create repo");
        }
    };

    const getBadgeColor = (level) => {
        switch (level) {
            case 'Top Secret': return 'bg-red-500 text-white';
            case 'Secret': return 'bg-orange-500 text-white';
            case 'Confidential': return 'bg-yellow-500 text-black';
            default: return 'bg-green-500 text-white';
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Secure Code Repositories</h1>
                <button onClick={() => setIsCreating(!isCreating)} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> New Repository
                </button>
            </div>

            {isCreating && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="glass-panel p-6 mb-8 overflow-hidden">
                    <h3 className="text-lg font-bold mb-4">Create New Repo</h3>
                    {error && <div className="text-red-400 text-sm mb-4 flex items-center gap-2"><AlertOctagon size={16} /> {error}</div>}
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input type="text" placeholder="Repo Name" className="input-field"
                            value={newRepo.name} onChange={e => setNewRepo({ ...newRepo, name: e.target.value })} required />
                        <input type="text" placeholder="Description" className="input-field"
                            value={newRepo.description} onChange={e => setNewRepo({ ...newRepo, description: e.target.value })} />
                        <select className="input-field" value={newRepo.classification} onChange={e => setNewRepo({ ...newRepo, classification: e.target.value })}>
                            <option value="Unclassified">Unclassified</option>
                            <option value="Confidential">Confidential</option>
                            <option value="Secret">Secret</option>
                            <option value="Top Secret">Top Secret</option>
                        </select>
                        <textarea placeholder="Initial Code Content" className="input-field min-h-[100px]"
                            value={newRepo.content} onChange={e => setNewRepo({ ...newRepo, content: e.target.value })} ></textarea>
                        <button className="btn-primary">Create</button>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {repos.map(repo => (
                    <motion.div key={repo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`glass-panel p-6 border-l-4 ${repo.can_read ? 'border-primary-500' : 'border-red-500'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold">{repo.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getBadgeColor(repo.classification)}`}>
                                        {repo.classification}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">{repo.description}</p>
                            </div>
                            {!repo.can_read && <Lock className="text-red-500" />}
                            {repo.can_read && <FileCode className="text-primary-500" />}
                        </div>

                        <div className="mt-4 bg-slate-900 p-4 rounded-lg font-mono text-sm overflow-x-auto text-slate-300">
                            {repo.content || <span className="italic text-slate-600">No content available</span>}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                            Access: {repo.can_read ? "READ ALLOWED" : "READ DENIED"} |
                            Write: {repo.can_write ? "WRITE ALLOWED" : "WRITE DENIED"}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CodeRepos;
