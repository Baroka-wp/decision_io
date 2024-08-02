import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const CoachLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/coach-dashboard');
        } catch (error) {
            setError('Email ou mot de passe incorrect');
            console.error('Erreur de connexion:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-fuschia-500 to-violet-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-fuschia-600">Connexion Coach</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-fuschia-500 pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-fuschia-500 pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-2 px-4 rounded hover:from-fuschia-600 hover:to-violet-600 transition-colors"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CoachLogin;