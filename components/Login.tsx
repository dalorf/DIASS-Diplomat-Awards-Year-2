
import React, { useState, useEffect } from 'react';
import { db, ref, get, set } from '../services/firebase';
import { sanitizeInput, simpleHash } from '../utils/helpers';
import { MAX_ATTEMPTS, LOCKOUT_TIME } from '../constants';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lastAttemptTime, setLastAttemptTime] = useState(0);

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');
        const now = Date.now();

        if (loginAttempts >= MAX_ATTEMPTS) {
            const timeSinceLastAttempt = now - lastAttemptTime;
            if (timeSinceLastAttempt < LOCKOUT_TIME) {
                const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000);
                setError(`🚫 Too many failed attempts. Wait ${remainingTime} min.`);
                setIsLoading(false);
                return;
            }
            setLoginAttempts(0);
        }

        const sanitizedPassword = sanitizeInput(password);
        if (!sanitizedPassword || sanitizedPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const passwordRef = ref(db, 'settings/adminPasswordHash');
            const snapshot = await get(passwordRef);

            if (!snapshot.exists()) {
                setError('⚠️ Admin password not configured');
                setIsLoading(false);
                return;
            }

            const storedHash = String(snapshot.val());
            const enteredHash = simpleHash(sanitizedPassword);

            if (enteredHash === storedHash) {
                setLoginAttempts(0);
                await set(ref(db, `adminLogs/${Date.now()}`), { action: 'login', timestamp: Date.now(), success: true });
                onLoginSuccess();
            } else {
                const newAttempts = loginAttempts + 1;
                setLoginAttempts(newAttempts);
                setLastAttemptTime(now);
                await set(ref(db, `adminLogs/${Date.now()}`), { action: 'login_failed', timestamp: Date.now(), attempts: newAttempts, success: false });
                const remaining = MAX_ATTEMPTS - newAttempts;
                if (remaining > 0) {
                    setError(`Incorrect password. ${remaining} attempt(s) left`);
                } else {
                    setError('Account locked for 5 minutes');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('❌ Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white text-slate-800 rounded-3xl p-10 max-w-sm w-full shadow-2xl shadow-slate-900/50">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 text-4xl">
                    🔒
                </div>
                <h2 className="text-center text-3xl font-bold text-gray-800">Admin Access</h2>
                <p className="text-center text-gray-500 mb-8">Enter admin password to continue</p>
                <div className="mb-6">
                    <label htmlFor="passwordInput" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        id="passwordInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter admin password"
                        autoComplete="current-password"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                    />
                    {error && <div className="text-red-600 text-sm mt-2 text-center">{error}</div>}
                </div>
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-br from-red-600 to-red-800 text-white py-4 rounded-xl text-lg font-bold cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Accessing...' : 'Access Dashboard'}
                </button>
            </div>
        </div>
    );
};

export default Login;
