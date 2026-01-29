import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileCode, Lock, Plus, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', ext: 'js' },
    { id: 'typescript', name: 'TypeScript', ext: 'ts' },
    { id: 'python', name: 'Python', ext: 'py' },
    { id: 'java', name: 'Java', ext: 'java' },
    { id: 'cpp', name: 'C++', ext: 'cpp' },
    { id: 'c', name: 'C', ext: 'c' },
    { id: 'html', name: 'HTML', ext: 'html' },
    { id: 'css', name: 'CSS', ext: 'css' },
    { id: 'json', name: 'JSON', ext: 'json' },
    { id: 'sql', name: 'SQL', ext: 'sql' },
    { id: 'markdown', name: 'Markdown', ext: 'md' },
    { id: 'shell', name: 'Shell Script', ext: 'sh' },
    { id: 'go', name: 'Go', ext: 'go' },
    { id: 'rust', name: 'Rust', ext: 'rs' },
    { id: 'php', name: 'PHP', ext: 'php' },
];

const CodeRepos = () => {
    const [repos, setRepos] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newRepo, setNewRepo] = useState({ name: '', description: '', classification: 'Unclassified', content: '', language: 'javascript' });
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
            // Reset form
            setNewRepo({ name: '', description: '', classification: 'Unclassified', content: '', language: 'javascript' });
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to create repo");
        }
    };

    const handleLanguageChange = (e) => {
        const selectedLangId = e.target.value;
        const langConfig = LANGUAGES.find(l => l.id === selectedLangId);

        // Update language
        let updatedRepo = { ...newRepo, language: selectedLangId };

        // Auto-update extension if name is empty or has an extension
        if (langConfig) {
            const currentName = newRepo.name;
            if (!currentName) {
                // If empty, don't force a name yet, or maybe a placeholder logic
            } else if (currentName.includes('.')) {
                // Replace extension
                const parts = currentName.split('.');
                parts.pop(); // remove old ext
                parts.push(langConfig.ext);
                updatedRepo.name = parts.join('.');
            } else {
                // Append extension
                updatedRepo.name = `${currentName}.${langConfig.ext}`;
            }
        }
        setNewRepo(updatedRepo);
    };

    const getBadgeColor = (level) => {
        switch (level) {
            case 'Top Secret': return 'bg-red-500 text-white';
            case 'Secret': return 'bg-orange-500 text-white';
            case 'Confidential': return 'bg-yellow-500 text-black';
            default: return 'bg-green-500 text-white';
        }
    };

    // Simple helper to guess language for syntax highlighting
    const getLanguageFromFilename = (filename) => {
        if (!filename) return 'javascript'; // default
        const ext = filename.split('.').pop().toLowerCase();
        const map = {
            'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
            'py': 'python', 'java': 'java', 'c': 'c', 'cpp': 'cpp', 'html': 'html',
            'css': 'css', 'json': 'json', 'md': 'markdown', 'sql': 'sql', 'go': 'go',
            'rs': 'rust', 'rb': 'ruby', 'php': 'php', 'sh': 'shell'
        };
        return map[ext] || 'plaintext';
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Repo Name (e.g., script.py)" className="input-field"
                                value={newRepo.name} onChange={e => setNewRepo({ ...newRepo, name: e.target.value })} required />

                            <select className="input-field" value={newRepo.language} onChange={handleLanguageChange}>
                                {LANGUAGES.map(lang => (
                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                ))}
                            </select>
                        </div>

                        <input type="text" placeholder="Description" className="input-field"
                            value={newRepo.description} onChange={e => setNewRepo({ ...newRepo, description: e.target.value })} />
                        <select className="input-field" value={newRepo.classification} onChange={e => setNewRepo({ ...newRepo, classification: e.target.value })}>
                            <option value="Unclassified">Unclassified</option>
                            <option value="Confidential">Confidential</option>
                            <option value="Secret">Secret</option>
                            <option value="Top Secret">Top Secret</option>
                        </select>

                        <div className="border border-slate-700 rounded-lg overflow-hidden">
                            <Editor
                                height="300px"
                                language={newRepo.language}
                                theme="vs-dark"
                                value={newRepo.content}
                                onChange={(value) => setNewRepo({ ...newRepo, content: value || '' })}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>
                        <p className="text-xs text-slate-400">Language: {newRepo.language} (matches extension)</p>

                        <button className="btn-primary">Create</button>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {repos.map(repo => (
                    <motion.div key={repo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`glass-panel p-6 border-l-4 ${repo.can_read ? 'border-primary-500' : 'border-red-500'}`}>
                        <div className="flex justify-between items-start mb-4">
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

                        {repo.can_read ? (
                            <div className="border border-slate-700 rounded-lg overflow-hidden">
                                <Editor
                                    height="200px"
                                    language={getLanguageFromFilename(repo.name)}
                                    theme="vs-dark"
                                    value={repo.content}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        scrollBeyondLastLine: false,
                                        domReadOnly: true
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="bg-slate-900 p-4 rounded-lg text-red-400 italic text-sm flex items-center gap-2">
                                <Lock size={16} /> [REDACTED: INSUFFICIENT CLEARANCE]
                            </div>
                        )}

                        <div className="mt-2 text-xs text-slate-500 flex justify-end gap-3">
                            <span>Access: {repo.can_read ? "READ ALLOWED" : "READ DENIED"}</span>
                            <span>Write: {repo.can_write ? "WRITE ALLOWED" : "WRITE DENIED"}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CodeRepos;
