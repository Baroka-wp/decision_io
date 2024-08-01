import React, { useState, useEffect } from 'react';
import { ChevronLeft, PhoneCall, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDecisionNode, takeFinalDecision } from './api';
import { genererPDF } from './utils/pdfUtils';
import UserInfoModal from './UserInfoModal';
import ProgressBar from './ProgressBar';
import CharlesPresentation from './CharlesPresentation';


const Domaines = () => {
    const [etape, setEtape] = useState(-1);
    const [reponses, setReponses] = useState([]);
    const [questionActuelle, setQuestionActuelle] = useState(null);
    const [decisionFinale, setDecisionFinale] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);

    const navigate = useNavigate();

    const etapes = [
        "Passions et intérêts",
        "Compétences intellectuelles",
        "Préférences de travail",
        "Rêves et aspirations",
        "Modèles et inspirations",
        "Valeurs personnelles",
        "Défis et obstacles",
        "Vision du futur",
        "Impact souhaité"
    ];

    useEffect(() => {
        if (userInfo && etape === 0) {
            initierProcessus();
        }
    }, [userInfo, etape]);

    const initierProcessus = async () => {
        setIsLoading(true);
        const questionInitiale = await generateDecisionNode(1, "", {});
        setQuestionActuelle(questionInitiale);
        setIsLoading(false);
    };

    const handleUserInfoSubmit = (info) => {
        setUserInfo(info);
        setShowUserInfoModal(false);
        setEtape(0);
    };

    const handleStartOrientation = () => {
        setShowUserInfoModal(true);
    };

    const handleReponse = async (reponse) => {
        const nouvellesReponses = [...reponses, { question: questionActuelle.question, answer: reponse }];
        setReponses(nouvellesReponses);

        if (etape < etapes.length - 1) {
            setIsLoading(true);
            const prochainNode = await generateDecisionNode(
                etape + 2,
                JSON.stringify(nouvellesReponses),
                {}
            );
            setQuestionActuelle(prochainNode);
            setEtape(etape + 1);
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

            const decision = await takeFinalDecision(
                "Orientation professionnelle pour un bachelier au Bénin",
                nouvellesReponses,
                userInfo.nom
            );
            clearInterval(intervalId);
            setAnalysisProgress(100);
            setDecisionFinale(JSON.parse(decision));
            setIsLoading(false);
        }
    };

    const QuestionComponent = ({ question, onReponse }) => (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-center">{etapes[etape]}</h2>
            <h3 className="text-xl mb-4 text-center">{question.question}</h3>
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onReponse(option)}
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-fuschia-500 to-violet-500 text-white rounded-lg transition-all hover:scale-105"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );

    const DecisionFinaleComponent = ({ decision, userInfo }) => (
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-fuschia-600">Ton orientation professionnelle, {userInfo.nom}</h2>

            <div className="text-lg mb-8 text-center">
                <p className="italic">{decision.introduction}</p>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Ton profil</h3>
                <p className="mb-4">{decision.analyse.profil}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Tes points forts :</h4>
                        <ul className="list-disc pl-5">
                            {decision.analyse.points_forts.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Tes domaines d'intérêt :</h4>
                        <ul className="list-disc pl-5">
                            {decision.analyse.domaines_interet.map((domaine, index) => (
                                <li key={index}>{domaine}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Métier recommandé</h3>
                <h4 className="text-xl font-medium mb-2">{decision.recommandations.metier_principal.nom}</h4>
                <p className="mb-4">{decision.recommandations.metier_principal.description}</p>
                <p className="italic mb-4">{decision.recommandations.metier_principal.adequation}</p>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Autres métiers à considérer</h3>
                <ul className="list-disc pl-5">
                    {decision.recommandations.metiers_alternatifs.map((metier, index) => (
                        <li key={index} className="mb-2">
                            <span className="font-medium">{metier.nom}</span> : {metier.description}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Filière d'études recommandée</h3>
                <h4 className="text-xl font-medium mb-2">{decision.recommandations.filiere.nom}</h4>
                <p className="mb-4">{decision.recommandations.filiere.description}</p>
                <h5 className="font-semibold mb-2">Établissements proposant cette filière :</h5>
                <ul className="list-disc pl-5">
                    {decision.recommandations.filiere.etablissements.map((etablissement, index) => (
                        <li key={index}>{etablissement}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Conseils pour réussir</h3>
                <ul className="list-decimal pl-5">
                    {decision.recommandations.conseils.map((conseil, index) => (
                        <li key={index} className="mb-2">{conseil}</li>
                    ))}
                </ul>
            </div>

            <div className="text-lg mb-8 text-center italic">
                <p>{decision.conclusion}</p>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => navigate('/coaches')}
                    className="flex items-center justify-center px-6 py-3 bg-fuschia-500 text-white rounded-lg transition-all hover:bg-fuschia-600"
                >
                    <PhoneCall size={20} className="mr-2" />
                    Parler à un coach
                </button>
                <button
                    onClick={() => genererPDF(reponses, decision, userInfo.nom)}
                    className="flex items-center justify-center px-6 py-3 bg-violet-500 text-white rounded-lg transition-all hover:bg-violet-600"
                >
                    <Download size={20} className="mr-2" />
                    Télécharger ta fiche
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen p-4">
            {etape === -1 && (
                <>
                    <CharlesPresentation />
                    <button
                        onClick={handleStartOrientation}
                        className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-2 px-4 rounded hover:from-fuschia-600 hover:to-violet-600"
                    >
                        Commencer mon orientation
                    </button>
                </>
            )}
            {showUserInfoModal && <UserInfoModal onSubmit={handleUserInfoSubmit} />}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-full">
                    {etape < etapes.length ? (
                        <div className="loader">
                            <div></div><div></div><div></div><div></div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Analyse en cours...</h2>
                            <ProgressBar progress={analysisProgress} />
                        </>
                    )}
                </div>
            ) : decisionFinale ? (
                <DecisionFinaleComponent decision={decisionFinale} userInfo={userInfo} />
            ) : etape >= 0 && (
                <div className="flex flex-col justify-center items-center h-full">
                    {questionActuelle && (
                        <QuestionComponent
                            question={questionActuelle}
                            onReponse={handleReponse}
                        />
                    )}
                    {etape > 0 && etape < etapes.length && (
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
        </div>
    );
};

export default Domaines;