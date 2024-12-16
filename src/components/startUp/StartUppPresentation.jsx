import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RefreshCw, FileText, PhoneCall, User, Briefcase } from 'lucide-react';
import { api } from '../../api';
import UserInfoModal from '../modal/UserInfoModal';
import Service from '../services';
// import anime from './assets/anime.jpeg';

const StartUppPresentation = ({ onStartOrientation, onViewExistingDecision }) => {
    const [hasExistingDecision, setHasExistingDecision] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingDecision = async () => {
            const storedUserName = localStorage.getItem('user_Name');
            if (storedUserName) {
                try {
                    const user = JSON.parse(storedUserName);
                    const response = await api.get(`/history/session/${user.id}`);
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
        const storedUserName = localStorage.getItem('user_Name');
        if (storedUserName) {
            onStartOrientation();
        } else {
            setShowUserInfoModal(true);
        }
    };

    const handleViewExistingDecision = () => {
        onViewExistingDecision();
    };

    const handleTalkToCoach = () => {
        const storedUserName = localStorage.getItem('user_Name');
        if (storedUserName) {
            navigate('/coaches');
        } else {
            setShowUserInfoModal(true);
        }
    };

    const handleStartupEvaluation = () => {
        const storedUserName = localStorage.getItem('user_Name');
        if (storedUserName) {
            navigate('/startup');
        } else {
            setShowUserInfoModal(true);
        }
    };

    const handleUserInfoSubmit = (info) => {
        localStorage.setItem('user_Name', JSON.stringify(info));
        setShowUserInfoModal(false);
        navigate('/coaches');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-fuschia-500"></div>
            </div>
        );
    }

    const servicesData = [
        {
          icon: <Play size={32} className="text-fuschia-500 mb-4" />,
          title: "Orientation études",
          description: "Découvrez votre voie professionnelle idéale grâce à notre analyse approfondie.",
        },
        {
          icon: <Briefcase size={32} className="text-yellow-500 mb-4" />,
          title: "Évaluation startup",
          description: "Évaluez votre profil d'entrepreneur et trouvez votre voie dans le monde des startups.",
        },
        {
          icon: <FileText size={32} className="text-fuschia-500 mb-4" />,
          title: "Fiche détaillée",
          description: "Obtenez un rapport complet sur vos compétences et opportunités de carrière.",
        },
        {
          icon: <PhoneCall size={32} className="text-fuschia-500 mb-4" />,
          title: "Coaching personnalisé",
          description: "Bénéficiez de l'expertise de nos coachs pour affiner votre parcours professionnel.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-fuschia-100 to-violet-100 p-4 md:p-8 flex flex-col">
            <div className="flex-grow flex flex-col max-w-7xl mx-auto w-full">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-fuschia-600">Décision</h1>
                    <nav className="hidden md:flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-fuschia-600">À propos</a>
                        <a href="#" className="text-gray-600 hover:text-fuschia-600">Services</a>
                        <a href="#" className="text-gray-600 hover:text-fuschia-600">Contact</a>
                    </nav>
                    <User size={32} className="text-fuschia-600" />
                </header>

                <main className="flex-grow flex flex-col md:flex-row items-center justify-center">
                    <div className="md:w-1/2 mb-8 md:mb-0 order-2 md:order-1">
                        <h2 className="text-4xl md:text-5xl font-bold text-fuschia-600 mb-4 text-center md:text-left">Envie de créer une startup ?</h2>
                        <p className="text-lg text-gray-700 mb-6 text-center md:text-left">
                            Découvre ton profil d'entrepreneur et des conseil pour te lancer.
                        </p>
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <button
                                onClick={handleStartNewOrientation}
                                className="w-full md:w-auto bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:from-fuschia-600 hover:to-violet-600 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                            >
                                <Play size={20} className="mr-2" />
                                Mon profil entrepreneur
                            </button>
                            <button
                                onClick={handleStartupEvaluation}
                                className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-violet-600 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                            >
                                <Briefcase size={20} className="mr-2" />
                                Évaluation startup
                            </button>
                            {hasExistingDecision && (
                                <button
                                    onClick={handleViewExistingDecision}
                                    className="w-full md:w-auto bg-white text-fuschia-500 font-bold py-3 px-6 rounded-xl border-2 border-fuschia-500 hover:bg-fuschia-50 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                                >
                                    <FileText size={20} className="mr-2" />
                                    Consulter ma fiche existante
                                </button>
                            )}
                            <button
                                onClick={handleTalkToCoach}
                                className="w-full md:w-auto bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center"
                            >
                                <PhoneCall size={20} className="mr-2" />
                                Parler à un coach
                            </button>
                        </div>
                    </div>
                    {/* <div className="md:w-1/2 flex justify-center order-1 md:order-2 mb-8 md:mb-0">
                        <img src={anime} alt="Orientation professionnelle" className="rounded-full w-64 h-64 md:w-96 md:h-96 object-cover shadow-2xl" />
                    </div> */}
                </main>
                

                <section className="mt-16 hidden md:block">
                    <h3 className="text-2xl font-bold text-center text-fuschia-600 mb-8">Nos services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {servicesData.map((service, index) => (
                        <Service
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                        />
                        ))}
                    </div>
                </section>
                
            </div>

            {showUserInfoModal && (
                <UserInfoModal
                    onSubmit={handleUserInfoSubmit}
                    onExistingDecision={() => { }}
                />
            )}
        </div>
    );
};

export default StartUppPresentation;