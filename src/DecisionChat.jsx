import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from "jspdf";
import { callOpenAI } from './api';
import { Send, RotateCcw, Save, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/logo.png';

export default function DecisionChat({ domaine }) {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [decisionPath, setDecisionPath] = useState([]);
    const [initialQuestion, setInitialQuestion] = useState('');
    const [askedQuestions, setAskedQuestions] = useState(new Set());
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [showNameModal, setShowNameModal] = useState(true);
    const [userName, setUserName] = useState('');
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
            setShowNameModal(false);
            addMessageToChat(`Bonjour ${storedName} Qu'est-ce qui te préoccupes aujourd'hui ?`, false);
        }
    }, []);


    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Empêcher le zoom sur mobile
        const metaViewport = document.querySelector('meta[name=viewport]');
        if (metaViewport) {
            metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }, []);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    function addWelcomeMessage(name) {
        setMessages(prevMessages => [...prevMessages, {
            id: Date.now(),
            content: `Bonjour ${name} ! Qu'est-ce qui te préoccupes aujourd'hui ?`,
            isUser: false
        }]);
    }

    function handleNameSubmit() {
        if (userName.trim() !== '') {
            localStorage.setItem('userName', userName);
            setShowNameModal(false);
            addWelcomeMessage(userName);
        }
    }

    async function handleUserInput() {
        if (userInput.trim() === '') return;

        addMessageToChat(userInput, true);
        setInitialQuestion(userInput);
        setUserInput('');
        setIsLoading(true);

        try {
            await processDecision(userInput);
        } catch (error) {
            console.error('Erreur lors du traitement de la décision:', error);
            addMessageToChat("Désolé, une erreur s'est produite. Peux-tu réessayer ?", false);
        } finally {
            setIsLoading(false);
        }
    }

    async function generateDecisionNode(question, context = '', depth = 0) {
        const systemPrompt = `Vous êtes un expert en price de décision. Générez un nœud de décision au format JSON en fonction de la question et du contexte de l'utilisateur. Fournissez toujours des options pour chaque nœud. Posez exactement 4 questions avant de prendre une décision finale. Évitez de répéter les questions ou de poser des questions très similaires.`

        const userPrompt = `Question: "${question}"
    ${context ? `Previous context: ${context}` : ''}
    Current depth: ${depth}
    Previously asked questions: ${Array.from(askedQuestions).join(", ")}
    
    Generate a JSON object with the following structure:
    {
        "question": "The next question to ask",
        "options": ["Option 1", "Option 2", "Option 3"],
        "isDecision": false
    }
    
    Règles :
    1. Incluez toujours au moins 2 options pour chaque nœud.
    2. Utilise la langue de l'utilisateur et tu doit être conviviale.
    3. Tu dois tutoyer l'utilisateur
    4. Définissez « isDecision » sur true uniquement s'il s'agit de la 4e question (profondeur 3).
    5. Ne répétez pas les questions qui ont déjà été posées ou ne posez pas de questions très similaires.
    6. Si vous ne pouvez pas générer une nouvelle question unique, essayez de la reformuler ou de l'aborder sous un angle différent.
    7. Il faut etre consis bref coherent et qualitatif dans tes questions et options
    
    IMPORTANT
    Utilisez un algorithme de décision avancé pour prendre une décision finale.`

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];

        const result = await callOpenAI(messages);
        return JSON.parse(result);
    }

    async function takeFinalDecision(initialQuestion, decisionPath) {
        const systemPrompt = `Vous êtes un assistant de prise de décision. Basez-vous sur la question initiale et les réponses fournies pour donner une décision finale simple et concise en une phrase maximum. La décision doit être soit "OUI" soit "NON", suivie d'une brève explication.`;

        const userPrompt = `Question initiale: "${initialQuestion}"
    
    Chemin de décision:
    ${decisionPath.map(step => `Q: ${step.question}\nR: ${step.answer}`).join('\n\n')}
    
    Basez-vous sur ces informations pour prendre une décision finale (OUI ou NON) et expliquez pourquoi en une phrase.
    Il faut tutoyer l'utilisateur, Rendre le message amical en utilisant le nom de l'utisateur ${userName}
    IMPORTANT
    Utilisez un algorithme de décision avancé pour prendre une décision finale.
    
    `;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];

        return await callOpenAI(messages);
    }

    function addMessageToChat(content, isUser = false, options = null) {
        setMessages(prevMessages => [...prevMessages, { content, isUser, options }]);
    }

    async function handleUserInput() {
        if (userInput.trim() === '') return;

        addMessageToChat(userInput, true);
        setInitialQuestion(userInput);
        setUserInput('');
        setIsLoading(true);

        await processDecision(userInput);
        setIsLoading(false);
    }

    async function processDecision(question, context = '', depth = 0) {
        const decision = await generateDecisionNode(question, context, depth);
        addMessageToChat(decision.question, false, decision.options);
        setAskedQuestions(prev => new Set(prev).add(decision.question));
    }

    async function handleOptionClick(option) {
        addMessageToChat(option, true);
        setDecisionPath(prev => [...prev, { question: messages[messages.length - 1].content, answer: option }]);

        if (decisionPath.length < 4) {
            setIsLoading(true);
            await processDecision(initialQuestion, option, decisionPath.length + 1);
            setIsLoading(false);
        } else {
            setIsLoading(true);
            const finalDecision = await takeFinalDecision(initialQuestion, [...decisionPath, { question: messages[messages.length - 1].content, answer: option }]);
            addMessageToChat(finalDecision);
            setIsLoading(false);
            setShowNewConversation(true);
        }
    }

    function startNewConversation() {
        setMessages([{ content: `Bon retour ${userName} ! Quelle nouvelle question te préoccupe ?`, isUser: false }]);
        setDecisionPath([]);
        setInitialQuestion('');
        setAskedQuestions(new Set());
        setShowNewConversation(false);
    }

    function saveChatToPdf() {
        const doc = new jsPDF();

        let yOffset = 10;
        doc.setFontSize(16);
        doc.text('Historique de la décision', 105, yOffset, { align: 'center' });
        yOffset += 10;

        doc.setFontSize(12);
        messages.forEach((message) => {
            const prefix = message.isUser ? 'Vous : ' : 'IA : ';
            const text = prefix + message.content;

            const lines = doc.splitTextToSize(text, 180);

            if (yOffset + lines.length * 7 > 280) {
                doc.addPage();
                yOffset = 10;
            }

            doc.text(lines, 15, yOffset);
            yOffset += lines.length * 7 + 5;
        });

        doc.save('decision-chat.pdf');
    }

    return (
        <div className="flex flex-col h-full" style={{ height: `${windowHeight}px` }}>
            <header className="flex-shrink-0 bg-white py-2 px-4 flex justify-center items-center">
                <img src={logo} alt="Logo" className="h-6 w-6 mr-2" />
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuschia-600 to-violet-600">
                    Décision : {domaine}
                </h1>
            </header>
            <div className="flex-grow flex flex-col overflow-hidden">
                <div
                    ref={chatContainerRef}
                    className="flex-grow overflow-y-auto p-4 space-y-4"
                >
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                                className={`p-3 rounded-lg ${message.isUser
                                    ? 'bg-gradient-to-r from-fuschia-200 to-violet-200 ml-auto'
                                    : 'bg-gradient-to-r from-fuschia-100 to-violet-100 mr-auto'
                                    } max-w-[80%]`}
                            >
                                {message.content}
                                {message.options && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="mt-2 flex flex-wrap gap-2"
                                    >
                                        {message.options.map((option, optionIndex) => (
                                            <button
                                                key={optionIndex}
                                                onClick={() => handleOptionClick(option)}
                                                className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-2 py-1 rounded text-sm"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="loader mr-auto">
                            <div></div><div></div><div></div><div></div>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 p-4 bg-gradient-to-r from-fuschia-200 to-violet-200">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
                            placeholder="Posez votre question..."
                            className="flex-grow p-2 border border-fuschia-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-fuschia-500"
                        />
                        <button
                            onClick={handleUserInput}
                            className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-4 py-2 rounded-r-lg flex items-center"
                        >
                            <Send className="mr-2" size={18} />
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
            {showNewConversation && (
                <div className="flex-shrink-0 mt-4 flex justify-center space-x-2 p-2">
                    <button
                        onClick={startNewConversation}
                        className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-4 py-2 rounded-full flex items-center"
                    >
                        <RotateCcw className="mr-2" size={18} />
                        Nouvelle
                    </button>
                    <button
                        onClick={saveChatToPdf}
                        className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-4 py-2 rounded-full flex items-center"
                    >
                        <Save className="mr-2" size={18} />
                        PDF
                    </button>
                </div>
            )}
            {showNameModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl mb-4">Bienvenue ! Quel est ton nom ?</h2>
                        <div className="flex items-center mb-4">
                            <User className="mr-2" size={18} />
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Entre ton nom"
                            />
                        </div>
                        <button
                            onClick={handleNameSubmit}
                            className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-4 py-2 rounded"
                        >
                            Commencer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}