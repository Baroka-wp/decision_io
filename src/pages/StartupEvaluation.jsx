import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { generateStartupDecisionNode, takeStartupFinalDecision } from '../api';
import UserInfoModal from '../components/modal/UserInfoModal';
import StartUppPresentation from '../components/startUp/StartUppPresentation';
import DecisionFinaleComponent from '../components/startUp/DecisionFinaleComponent';
import { api } from '../api';
import ProgressBar from '../components/ProgressBar';

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

    const etapes = [
        "Motivations entrepreneuriales",
        "Compétences clés",
        "Expérience professionnelle",
        "Idée de startup",
        "Connaissances du marché",
        "Réseau et ressources",
        "Gestion du risque",
        "Vision à long terme",
        "Impact social"
    ];

    useEffect(() => {
        if (userInfo && etape === 0 && questions.length === 0) {
            initierProcessus();
        }
    }, [userInfo, etape, questions.length]);

    const initierProcessus = async () => {
        setIsLoading(true);
        try {
            const questionInitiale = await generateStartupDecisionNode(1, "", {});
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
                    const prochainNode = await generateStartupDecisionNode(
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

                const decision = await takeStartupFinalDecision(
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
                setProgression(0);
            } catch (error) {
                console.error('Erreur lors de la finalisation de la décision:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleReturnHome = () => {
        setEtape(-1);
        setQuestions([]);
        setReponses([]);
        setDecisionFinale(null);
        setHasFinalDecision(false);
        setAnalysisProgress(0);
    };

    const handleBackclick = () => {
        setHasFinalDecision(false);
        setDecisionFinale(null);
        setEtape(-1);
        setQuestions([]);
        setReponses([]);
    };

    const QuestionComponent = ({ question, onReponse, currentAnswer }) => (
        <div className="flex flex-col items-center justify-center w-full px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-fuschia-600">{etapes[etape]}</h2>
            <h3 className="text-lg md:text-xl mb-6 text-center">{question.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md md:max-w-2xl">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onReponse(option)}
                        className={`flex items-center justify-center p-4 ${currentAnswer === option
                            ? 'bg-violet-600 text-white'
                            : 'bg-gradient-to-r from-fuschia-500 to-violet-500 text-white'
                            } rounded-lg transition-all hover:scale-105 text-sm md:text-base`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );

    // Composant de loader
    const Loader = () => (
        <div className="loader">
            <div></div><div></div><div></div><div></div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-violet-100">
            {etape === -1 && (
                <StartUppPresentation
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
            {etape >= 0 && (
                <button
                    onClick={handleReturnHome}
                    className="absolute top-4 left-4 flex items-center text-fuschia-600 hover:text-fuschia-700 z-10"
                >
                    <Home size={20} className="mr-2" />
                    <span className="hidden md:inline">Accueil</span>
                </button>
            )}

            {etape >= 0 && etape < etapes.length && (
                <ProgressBar progress={progression} />
            )}

            <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-8">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center">
                        {etape < etapes.length ? (
                            <Loader />
                        ) : (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold mb-4">Analyse en cours...</h2>
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
                        {etape > 0 && (
                            <button
                                onClick={() => setEtape(etape - 1)}
                                className="mt-6 flex items-center text-fuschia-600 mx-auto"
                            >
                                <ChevronLeft size={20} className="mr-1" />
                                <span className="text-sm md:text-base">Question précédente</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Domaines;