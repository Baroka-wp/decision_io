import React, { useState, useEffect } from 'react';
import { ChevronLeft, PhoneCall, Download } from 'lucide-react';
import { generateDecisionNode, takeFinalDecision } from './api';
import UserInfoModal from './UserInfoModal';
import ProgressBar from './ProgressBar';
import CharlesPresentation from './CharlesPresentation';
import DecisionFinaleComponent from './DecisionFinaleComponent';
import { api } from './api';

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

    const etapes = [
        "Passions et intérêts",
        "Compétences intellectuelles",
        "Préférences de travail",
        "Rêves et aspirations",
        "Inspirations",
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

        if (etape < etapes.length - 1) {
            setIsLoading(true);
            if (etape + 1 < questions.length) {
                // La question suivante est déjà générée
                setEtape(etape + 1);
            } else {
                // Générer la prochaine question
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
            // Logique pour la décision finale (inchangée)
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
                // Stocker l'historique de la discussion
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

                // Stocker la décision finale
                await api.post('/history/final-decision', {
                    user_id: userInfo.id,
                    decision: decision
                });

                clearInterval(intervalId);
                setAnalysisProgress(100);
                setHasFinalDecision(true);
                setDecisionFinale(JSON.parse(decision));
            } catch (error) {
                console.error('Erreur lors de la finalisation de la décision:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBackclick = () => {
        setHasFinalDecision(false);
        setDecisionFinale(null);
        setEtape(-1);
        setQuestions([]);
        setReponses([]);
    };

    const QuestionComponent = ({ question, onReponse, currentAnswer }) => (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-center">{etapes[etape]}</h2>
            <h3 className="text-xl mb-4 text-center">{question.question}</h3>
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onReponse(option)}
                        className={`flex items-center justify-center p-4 ${currentAnswer === option
                                ? 'bg-violet-600 text-white'
                                : 'bg-gradient-to-r from-fuschia-500 to-violet-500 text-white'
                            } rounded-lg transition-all hover:scale-105`}
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
        <div className="flex flex-col h-screen p-4">
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

            <>
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-full">
                        {etape < etapes.length ? (
                            <Loader />
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold mb-4">Analyse en cours...</h2>
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
                    <div className="flex flex-col justify-center items-center h-full">
                        <QuestionComponent
                            question={questions[etape]}
                            onReponse={handleReponse}
                            currentAnswer={reponses[etape]}
                        />
                        {etape > 0 && (
                            <button
                                onClick={() => setEtape(etape - 1)}
                                className="mt-4 flex items-center text-fuschia-600"
                            >
                                <ChevronLeft size={20} />
                                Question précédente
                            </button>
                        )}
                    </div>
                )}
            </>
        </div>
    );
};

export default Domaines;