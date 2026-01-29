import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Lock, AlertTriangle, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [mfaData, setMfaData] = useState(null);
    const [mfaToken, setMfaToken] = useState('');
    const [mfaStatus, setMfaStatus] = useState('');

    const setupMFA = async () => {
        try {
            const response = await api.post(`/auth/mfa/setup?username=${user.username}`);
            setMfaData(response.data);
        } catch (e) {
            console.error(e);
            alert("Failed to setup MFA: " + (e.response?.data?.detail || e.message));
        }
    };

    const verifyMFA = async () => {
        try {
            await api.post('/auth/mfa/enable', { username: user.username, token: mfaToken });
            setMfaStatus('MFA Enabled Successfully!');
            setMfaData(null);
        } catch (e) {
            setMfaStatus('Invalid Token, try again');
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
                <button onClick={logout} className="btn-secondary flex items-center gap-2">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-primary-400" />
                        <h3 className="text-xl font-semibold">Security Status</h3>
                    </div>
                    <p className="text-slate-400">Clearance: <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{user?.role}</span></p>
                    <div className="mt-4">
                        {!mfaStatus && <button onClick={setupMFA} className="btn-primary text-sm">Setup MFA</button>}
                        {mfaStatus && <div className="text-green-400 mt-2">{mfaStatus}</div>}
                    </div>
                </div>

                <a href="/repos" className="glass-panel p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="text-emerald-400 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold">Code Repositories</h3>
                    </div>
                    <p className="text-slate-400">Access secure repositories based on your clearance level.</p>
                </a>

                <a href="/crypto" className="glass-panel p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-purple-400 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold">Cryptography Lab</h3>
                    </div>
                    <p className="text-slate-400">Experiment with Post-Quantum & Threshold Cryptography.</p>
                </a>
            </div>

            {mfaData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="glass-panel p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Scan QR Code</h3>
                        <div className="bg-white p-4 rounded-lg mb-4 w-fit mx-auto">
                            <img src={`data:image/png;base64,${mfaData.qr_code}`} alt="MFA QR" />
                        </div>
                        <p className="text-center text-sm text-slate-400 mb-4 break-all font-mono">{mfaData.secret}</p>
                        <input
                            type="text"
                            value={mfaToken}
                            onChange={(e) => setMfaToken(e.target.value)}
                            className="input-field mb-4"
                            placeholder="Enter 6-digit code"
                        />
                        <div className="flex gap-2">
                            <button onClick={verifyMFA} className="btn-primary flex-1">Verify type</button>
                            <button onClick={() => setMfaData(null)} className="btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
