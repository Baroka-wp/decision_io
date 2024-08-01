import React, { useState, useEffect } from 'react';
import DecisionChat from './DecisionChat'
import { Users, Heart, Briefcase, Coins, Leaf } from 'lucide-react';

const Domaines = () => {
    const [domaine, setDomaine] = useState('');
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDomaineSelect = (domaine) => {
        setDomaine(domaine);
        setShowChat(true);
    };

    const domaines = [
        { id: 'famil', label: 'Familial/Amical', icon: Users },
        { id: 'amoureux', label: 'Amoureux', icon: Heart },
        { id: 'travail', label: 'Travail', icon: Briefcase },
        { id: 'invest', label: 'Investissement/Argent', icon: Coins },
        { id: 'spirituel', label: 'Spirituel', icon: Leaf },
    ];

    return (
        <div className="flex flex-col h-screen p-4">
            {showChat ? (
                <DecisionChat domaine={domaine} />
            ) : (
                <div className="flex flex-col justify-center items-center h-full">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuschia-600 to-violet-600">
                        Choisissez un domaine pour prendre une décision
                    </h1>
                    <div className="w-full max-w-6xl grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4">
                        {domaines.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => handleDomaineSelect(d.id)}
                                className="flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-r from-fuschia-500 to-violet-500 text-white rounded-lg transition-all hover:scale-105 hover:shadow-lg"
                            >
                                <d.icon className="mb-1 sm:mb-2" size={24} />
                                <span className="text-xs sm:text-sm md:text-base font-semibold text-center">{d.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Domaines;