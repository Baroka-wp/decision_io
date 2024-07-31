import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from "jspdf";
import { callOpenAI } from './api';
import { Send, RotateCcw, Save, User } from 'lucide-react';


export default function DecisionChat() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [decisionPath, setDecisionPath] = useState([]);
    const [initialQuestion, setInitialQuestion] = useState('');
    const [askedQuestions, setAskedQuestions] = useState(new Set());
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [showNameModal, setShowNameModal] = useState(true);
    const [userName, setUserName] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
            setShowNameModal(false);
            addMessageToChat(`Bonjour ${storedName} ! Je vais t'aider à prendre une décision. Qu'est-ce qui te préoccupes aujourd'hui ?`, false);
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
            content: `Bonjour ${name} ! Je vais t'aider à prendre une décision. Qu'est-ce qui te préoccupes aujourd'hui ?`,
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
        const systemPrompt = `You are a decision-making assistant. Generate a decision node in JSON format based on the user's question and context. Always provide options for each node. Ask exactly 5 questions before making a final decision. Avoid repeating questions or asking very similar questions.`;

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
    
    Rules:
    1. Always include at least 2 options for each node.
    2. User user language be frendly and you can somtimes use client name ${userName} to personalize conversation
    2. Set "isDecision" to true only if this is the 4th question (depth 3).
    3. Do not repeat questions that have been asked before or ask very similar questions.
    4. If you can't generate a new, unique question, try to rephrase or approach from a different angle.`;

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
    
    Basez-vous sur ces informations pour prendre une décision finale (OUI ou NON) et expliquez brièvement pourquoi en une phrase.`;

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
        <div className="container mx-auto p-4 flex flex-col h-screen">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuschia-600 to-violet-600 mb-4 text-center">Décision</h1>
            {showNameModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
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
                            className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-4 py-2 rounded"
                        >
                            Commencer
                        </button>
                    </div>
                </div>
            )}
            <div className="flex-grow flex flex-col bg-white rounded-lg shadow overflow-hidden">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-4 p-4 rounded-lg ${message.isUser ? 'bg-gradient-to-r from-fuschia-200 to-violet-200 ml-auto' : 'bg-gradient-to-r from-fuschia-100 to-violet-100 mr-auto'} max-w-[80%]`}>
                            {message.content}
                            {message.options && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {message.options.map((option, optionIndex) => (
                                        <button key={optionIndex} onClick={() => handleOptionClick(option)} className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-3 py-1 rounded hover:from-fuschia-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-fuschia-700">
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="loader mb-4 p-4 rounded-lg bg-gradient-to-r from-fuschia-100 to-violet-100 mr-auto max-w-[80%]">
                            <div></div><div></div><div></div><div></div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gradient-to-r from-fuschia-200 to-violet-200">
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
                            className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-4 py-2 rounded-r-lg hover:from-fuschia-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-fuschia-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                        >
                            <Send className="mr-2" size={18} />
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
            {showNewConversation && (
                <div className="mt-4 text-center">
                    <button
                        onClick={startNewConversation}
                        className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-6 py-2 rounded-full hover:from-fuschia-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-fuschia-700 mr-2 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                    >
                        <RotateCcw className="mr-2" size={18} />
                        Nouvelle conversation
                    </button>
                    <button
                        onClick={saveChatToPdf}
                        className="bg-gradient-to-r from-fuschia-500 to-violet-500 text-white px-6 py-2 rounded-full hover:from-fuschia-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-fuschia-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                    >
                        <Save className="mr-2" size={18} />
                        Sauvegarder en PDF
                    </button>
                </div>
            )}
        </div>
    );
}