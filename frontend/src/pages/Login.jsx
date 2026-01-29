import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [showMfaInput, setShowMfaInput] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate slight delay for effect
        await new Promise(r => setTimeout(r, 600));

        const result = await login(username, password, mfaToken || null);

        if (result.success) {
            navigate('/dashboard');
        } else {
            if (result.error.includes("MFA")) {
                setShowMfaInput(true);
                if (!result.error.includes("required")) {
                    setError(result.error);
                }
            } else {
                setError(result.error);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden">
            {/* Animated Background blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -60, 0],
                }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="glass-panel p-8 w-full max-w-md z-10 border border-white/10 shadow-2xl backdrop-blur-xl relative"
            >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 rounded-t-xl" />

                <div className="text-center mb-8 mt-2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="mx-auto w-16 h-16 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30 group"
                    >
                        <Lock className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400 tracking-tight">DevVault</h2>
                    <p className="text-slate-400 mt-2 text-sm uppercase tracking-wider font-semibold">Secure Access Portal</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Username</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field pl-16"
                                placeholder="Enter your username"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-16"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {showMfaInput && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide text-primary-300">MFA Token Required</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    value={mfaToken}
                                    onChange={(e) => setMfaToken(e.target.value)}
                                    className="input-field pl-10 border-primary-500/50 bg-primary-500/5 focus:bg-primary-500/10"
                                    placeholder="000 000"
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {showMfaInput ? 'Verify Identity' : 'Authenticate'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-sm text-slate-400">
                        Internal Access Only. <br />
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium inline-block mt-1 hover:underline decoration-primary-400/30 underline-offset-4">
                            Request Clearance (Register)
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
