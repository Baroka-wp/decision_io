import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, RefreshCw, FileText, PhoneCall } from 'lucide-react';

const CharlesPresentation = ({ onStartOrientation, onViewExistingDecision }) => {
    const [hasExistingDecision, setHasExistingDecision] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingDecision = async () => {
            const storedUserName = localStorage.getItem('userName');
            if (storedUserName) {
                const user = JSON.parse(storedUserName);
                try {
                    const response = await axios.get(`http://localhost:5001/api/history/session/${user.id}`);
                    if (response.data.length > 0) {
                        setHasExistingDecision(true);
                    }
                } catch (error) {
                    console.error('Error checking existing decision:', error);
                }
            }
            setIsLoading(false);
        };

        checkExistingDecision();
    }, []);

    const handleStartNewOrientation = () => {
        onStartOrientation();
    };

    const handleViewExistingDecision = () => {
        onViewExistingDecision();
    };

    const handleTalkToCoach = () => {
        navigate('/coaches');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-fuschia-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-fuschia-100 to-violet-100 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-fuschia-500 to-violet-500 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2m0-4h2a2 2 0 012 2v4m6 3v3h2a2 2 0 012 2v3m0-10h2a2 2 0 012 2v3m-3 3h6"
                            />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center text-fuschia-600">Bonjour, je suis Charles !</h2>
                {
                    !hasExistingDecision && (
                        <>
                            <p className="text-lg text-gray-700">
                                Mon objectif est de t'aider à découvrir le chemin professionnel
                                qui te correspond le mieux.
                            </p>
                            <p className="text-lg text-gray-700">
                                Je vais te poser une série de questions pour comprendre tes passions, tes compétences et tes aspirations.
                            </p>
                        </>
                    )
                }
                <p className="text-xl font-semibold text-center text-violet-600">
                    {hasExistingDecision
                        ? "Tu as déjà une fiche d'orientation. Que souhaites-tu faire ?"
                        : "Prêt à commencer cette aventure passionnante vers ton futur métier ?"}
                </p>
                <div className="space-y-4">
                    <button
                        className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-3 px-4 rounded-xl hover:from-fuschia-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-fuschia-200 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                        onClick={handleStartNewOrientation}
                    >
                        {hasExistingDecision ? (
                            <>
                                <RefreshCw size={20} className="mr-2" />
                                Générer une nouvelle fiche
                            </>
                        ) : (
                            <>
                                <Play size={20} className="mr-2" />
                                Commencer l'aventure
                            </>
                        )}
                    </button>
                    {hasExistingDecision && (
                        <button
                            className="w-full bg-white text-fuschia-500 font-bold py-3 px-4 rounded-xl border-2 border-fuschia-500 hover:bg-fuschia-50 focus:outline-none focus:ring-2 focus:ring-fuschia-200 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                            onClick={handleViewExistingDecision}
                        >
                            <FileText size={20} className="mr-2" />
                            Consulter ma fiche existante
                        </button>
                    )}
                    <button
                        className="w-full bg-violet-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                        onClick={handleTalkToCoach}
                    >
                        <PhoneCall size={20} className="mr-2" />
                        Parler à un coach
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharlesPresentation;