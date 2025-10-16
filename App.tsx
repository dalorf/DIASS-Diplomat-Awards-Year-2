
import React, { useState, useCallback } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleLoginSuccess = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const handleLogout = useCallback(() => {
        if (confirm('Logout from admin dashboard?')) {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <div className="min-h-screen text-slate-200">
            {isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;
