import React, { useState } from 'react';
import api from '../services/api';
import { Lock, Unlock, Key, Split } from 'lucide-react';
import { motion } from 'framer-motion';

const CryptoLab = () => {
    const [keys, setKeys] = useState(null);
    const [msgToEncrypt, setMsgToEncrypt] = useState('');
    const [encryptedResult, setEncryptedResult] = useState(null);
    const [decryptedMsg, setDecryptedMsg] = useState('');

    const [secretToSplit, setSecretToSplit] = useState('');
    const [shares, setShares] = useState(null);
    const [reconstructedSecret, setReconstructedSecret] = useState('');

    const generateKeys = async () => {
        const res = await api.get('/crypto/keys');
        setKeys(res.data);
    };

    const handleEncrypt = async () => {
        if (!keys) return alert('Generate keys first!');
        const res = await api.post('/crypto/encrypt', {
            message: msgToEncrypt,
            public_key: keys.public_key
        });
        setEncryptedResult(res.data);
    };

    const handleDecrypt = async () => {
        if (!keys || !encryptedResult) return;
        try {
            const res = await api.post('/crypto/decrypt', {
                encrypted_data: encryptedResult,
                private_key: keys.private_key
            });
            setDecryptedMsg(res.data.message);
        } catch (e) {
            alert('Decryption failed');
        }
    };

    const handleSplit = async () => {
        const res = await api.post('/crypto/split', {
            secret: secretToSplit,
            n: 5,
            k: 3
        });
        setShares(res.data.shares);
    };

    const handleReconstruct = async () => {
        if (!shares) return;
        // Take first 3 shares
        const res = await api.post('/crypto/reconstruct', {
            shares: shares.slice(0, 3)
        });
        setReconstructedSecret(res.data.secret);
    };

    return (
        <div className="p-8 grid gap-8 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Lock className="text-primary-400" />
                    <h2 className="text-xl font-bold">Hybrid Encryption (RSA + AES)</h2>
                </div>

                <button onClick={generateKeys} className="btn-secondary w-full mb-4">
                    {keys ? 'Keys Generated' : 'Generate Key Pair'}
                </button>

                {keys && (
                    <div className="space-y-4">
                        <textarea placeholder="Message to Encrypt" className="input-field min-h-[100px]"
                            value={msgToEncrypt} onChange={e => setMsgToEncrypt(e.target.value)} />

                        <button onClick={handleEncrypt} className="btn-primary w-full">Encrypt</button>

                        {encryptedResult && (
                            <div className="bg-slate-900 p-2 rounded text-xs break-all font-mono text-slate-400">
                                {JSON.stringify(encryptedResult).substring(0, 100)}...
                            </div>
                        )}

                        <button onClick={handleDecrypt} className="btn-secondary w-full" disabled={!encryptedResult}>
                            Decrypt Result
                        </button>

                        {decryptedMsg && (
                            <div className="bg-green-500/10 border border-green-500/50 p-2 rounded text-green-200">
                                {decryptedMsg}
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Split className="text-purple-400" />
                    <h2 className="text-xl font-bold">Shamir's Secret Sharing</h2>
                </div>

                <div className="space-y-4">
                    <input type="text" placeholder="Enter Secret" className="input-field"
                        value={secretToSplit} onChange={e => setSecretToSplit(e.target.value)} />

                    <button onClick={handleSplit} className="btn-primary w-full">Split (3-of-5)</button>

                    {shares && (
                        <div className="space-y-2">
                            <p className="text-sm text-slate-400">Generated 5 Shares:</p>
                            {shares.map((s, i) => (
                                <div key={i} className="bg-slate-900 px-2 py-1 rounded text-xs font-mono truncate">
                                    Share {s[0]}: {s[1].toString().substring(0, 20)}...
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={handleReconstruct} className="btn-secondary w-full" disabled={!shares}>
                        Reconstruct from 3 shares
                    </button>

                    {reconstructedSecret && (
                        <div className="bg-purple-500/10 border border-purple-500/50 p-2 rounded text-purple-200 font-bold text-center">
                            {reconstructedSecret}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CryptoLab;
