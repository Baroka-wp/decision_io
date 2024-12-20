import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, Home, Play, FileText, PhoneCall, 
    User, Briefcase, MessageCircle, 
    Mail, MapPin, Linkedin, Twitter, Instagram 
} from 'lucide-react';
import { generateDecisionNode, takeFinalDecision } from '../api';
import UserInfoModal from '../components/modal/UserInfoModal';
import CharlesPresentation from '../components/CharlesPresentation';
import DecisionFinaleComponent from '../components/startUp/DecisionFinaleComponent';
import { api } from '../api';
import ProgressBar from '../components/ProgressBar';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Domaines = () => {
    const [etape, setEtape] = useState(-1);
    const [questions, setQuestions] = useState([]);
    const [reponses, setReponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [decisionFinale, setDecisionFinale] = useState(null);
    const [hasFinalDecision, setHasFinalDecision] = useState(false);
    const [progression, setProgression] = useState(0);
    const navigate = useNavigate();

    const etapes = [
        "Passions et intérêts",
        "Compétences intellectuelles",
        "Préférences de travail",
        "Rêves et aspirations",
        "Expériences pratiques",
        "Valeurs personnelles",
        "Défis et obstacles",
        "Vision du futur",
        "Impact souhaité"
    ];

    useEffect(() => {
        if (userInfo && etape === 0 && questions.length === 0) {
            initierProcessus();
        }
    }, [userInfo, etape, questions.length]);

    const initierProcessus = async () => {
        setIsLoading(true);
        try {
            const questionInitiale = await generateDecisionNode(1, "", {});
            setQuestions([questionInitiale]);
            setEtape(0);
        } catch (error) {
            console.error("Erreur lors de l'initialisation du processus:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserInfoSubmit = (info) => {
        if (info.name) {
            localStorage.setItem('user_Name', JSON.stringify(info));
            setUserInfo({ id: info.id, name: info.name, phoneNumber: info.phoneNumber });
        } else {
            console.error('Nom d\'utilisateur non trouvé dans les informations soumises');
            return;
        }
        setShowUserInfoModal(false);
        setEtape(0);
    };

    const handleExistingDecision = (decision) => {
        setHasFinalDecision(true);
        setDecisionFinale(decision);
    };

    const handleStartOrientation = () => {
        const storedUserName = localStorage.getItem('user_Name');
        if (storedUserName) {
            try {
                const user = JSON.parse(storedUserName);
                setUserInfo({ id: user.id, name: user.name, phoneNumber: user.phoneNumber });
                setEtape(0);
                setQuestions([]);
                setReponses([]);
                setIsLoading(false);
                setAnalysisProgress(0);
                setDecisionFinale(null);
                setHasFinalDecision(false);
                setProgression(0);
            } catch (err) {
                setShowUserInfoModal(true);
            }
        } else {
            setShowUserInfoModal(true);
        }
    };

    const handleViewExistingDecision = () => {
        const storedUserName = localStorage.getItem('user_Name');
        if (storedUserName) {
            try {
                const user = JSON.parse(storedUserName);
                setUserInfo({ id: user.id, name: user.name, phoneNumber: user.phoneNumber });
                api.get(`/history/session/${user.id}`)
                    .then(response => {
                        if (response.data) {
                            setHasFinalDecision(true);
                            setDecisionFinale(JSON.parse(response.data[0]?.decision));
                            setEtape(10);
                        } else {
                            setEtape(0);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } catch (err) {
                setShowUserInfoModal(true);
            }
        } else {
            setShowUserInfoModal(true);
        }
    };

    const handleReponse = async (reponse) => {
        const nouvellesReponses = [...reponses.slice(0, etape), reponse];
        setReponses(nouvellesReponses);
        setProgression(((etape + 1) / etapes.length) * 100);

        if (etape < etapes.length - 1) {
            setIsLoading(true);
            if (etape + 1 < questions.length) {
                setEtape(etape + 1);
            } else {
                try {
                    const prochainNode = await generateDecisionNode(
                        etape + 2,
                        JSON.stringify(nouvellesReponses.map((r, i) => ({ question: questions[i].question, answer: r }))),
                        {}
                    );
                    setQuestions([...questions, prochainNode]);
                    setEtape(etape + 1);
                } catch (error) {
                    console.error("Erreur lors de la génération de la prochaine question:", error);
                }
            }
            setIsLoading(false);
        } else {
            setIsLoading(true);
            let progress = 0;
            const intervalId = setInterval(() => {
                progress += 5;
                setAnalysisProgress(progress);
                if (progress >= 100) {
                    clearInterval(intervalId);
                }
            }, 500);

            try {
                const sessionData = questions.map((q, i) => ({
                    question: q.question,
                    answer: nouvellesReponses[i]
                }));

                if (hasFinalDecision) {
                    await api.put('/history', {
                        user_id: userInfo.id,
                        session_data: JSON.stringify(sessionData)
                    });
                } else {
                    await api.post('/history', {
                        user_id: userInfo.id,
                        session_data: JSON.stringify(sessionData)
                    });
                }

                const decision = await takeFinalDecision(
                    "Orientation professionnelle pour un bachelier au Bénin",
                    sessionData,
                    userInfo.name
                );

                await api.post('/history/final-decision', {
                    user_id: userInfo.id,
                    decision: decision
                });

                clearInterval(intervalId);
                setAnalysisProgress(100);
                setHasFinalDecision(true);
                setDecisionFinale(JSON.parse(decision));
                setProgression(100);
            } catch (error) {
                console.error('Erreur lors de la finalisation de la décision:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleReturnHome = () => {
        if (etape >= 0 && etape < etapes.length - 1) {
            // If in progress, show confirmation dialog
            const confirmQuit = window.confirm('Voulez-vous vraiment quitter le processus d\'orientation ? Toutes vos réponses seront perdues.');
            if (!confirmQuit) return;
        }
        
        // Reset all states
        setEtape(-1);
        setQuestions([]);
        setReponses([]);
        setDecisionFinale(null);
        setHasFinalDecision(false);
        setAnalysisProgress(0);
        setProgression(0);
    };

    const handleBackclick = () => {
        setHasFinalDecision(false);
        setDecisionFinale(null);
        setEtape(-1);
        setQuestions([]);
        setReponses([]);
    };

    const handleTalkToCoach = () => {
        navigate('/coaches');
    };

    const handlePreviousQuestion = () => {
        if (etape > 0) {
            setEtape(etape - 1);
        }
    };

    const QuestionComponent = ({ question, onReponse, currentAnswer }) => (
        <div className="flex flex-col items-center justify-center w-full px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-[#2C3E50]">{etapes[etape]}</h2>
            <h3 className="text-lg md:text-xl mb-6 text-center text-[#4A4A4A]">{question.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md md:max-w-2xl">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onReponse(option)}
                        className={`flex items-center justify-center p-4 rounded-lg transition-all hover:scale-105 text-sm md:text-base
                            ${currentAnswer === option
                                ? 'bg-[#6A5ACD] text-white shadow-md'
                                : 'bg-white text-[#6A5ACD] border-2 border-[#6A5ACD] hover:bg-[#6A5ACD]/10'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {etape > 0 && (
                <button
                    onClick={handlePreviousQuestion}
                    className="mt-4 px-4 py-2 bg-white text-[#6A5ACD] border-2 border-[#6A5ACD] rounded-lg hover:bg-[#6A5ACD]/10 transition"
                >
                    Question précédente
                </button>
            )}
        </div>
    );

    // Composant de loader
    const Loader = () => (
        <div className="loader">
            <div></div><div></div><div></div><div></div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F5F5FA] to-[#FFFFFF]">
            {/* Navbar */}
            <Navbar />

            {/* Progress Bar Container - Positioned right after Navbar */}
            {etape >= 0 && !decisionFinale && (
                <div className="w-full px-4 pt-2 absolute top-16 left-0 z-10">
                    <ProgressBar progress={progression} />
                </div>
            )}

                       {/* {decisionFinale && ( */}
                       <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-8 mt-12">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {etape < etapes.length ? (
                                <Loader />
                            ) : (
                                <>
                                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#2C3E50]">Analyse en cours...</h2>
                                    <ProgressBar progress={analysisProgress} />
                                </>
                            )}
                        </div>
                    ) : decisionFinale ? (
                        <DecisionFinaleComponent
                            decision={decisionFinale}
                            userInfo={userInfo}
                            onback={handleBackclick}
                        />
                    ) : etape >= 0 && questions.length > 0 && (
                        <div className="w-full max-w-4xl">
                            <QuestionComponent
                                question={questions[etape]}
                                onReponse={handleReponse}
                                currentAnswer={reponses[etape]}
                            />
                        </div>
                    )}
                </div>
            {/* )} */}

            {etape === -1 && (
                <CharlesPresentation
                    onStartOrientation={handleStartOrientation}
                    onViewExistingDecision={handleViewExistingDecision}
                />
            )}
            {showUserInfoModal && (
                <UserInfoModal
                    onSubmit={handleUserInfoSubmit}
                    onExistingDecision={handleExistingDecision}
                />
            )}
            {(etape >= 0 && etape < etapes.length) && (
                <button
                    onClick={handleReturnHome}
                    className="absolute top-20 left-4 flex items-center text-[#2C3E50] hover:text-[#1A1D23] z-20"
                >
                    <Home size={20} className="mr-2" />
                    <span className="hidden md:inline">Accueil</span>
                </button>
            )}

 
        </div>
           
    );
};

export default Domaines;