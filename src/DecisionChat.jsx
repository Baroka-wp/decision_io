import React, { useState, useEffect, useRef } from 'react';
import { generateDecisionNode, takeFinalDecision } from './api';
import { Send, RotateCcw, Save, Home } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import logo from './assets/logo.png';
import ChatMessage from './ChatMessage';
import NameModal from './components/modal/NameModal';
import { saveChatToPdf } from './utils/pdfUtils';
import './DecisionChat.css';


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
    const chatContainerRef = useRef(null);
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const storedName = localStorage.getItem('user_Name');
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
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

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
        const decision = await generateDecisionNode(question, context, depth, askedQuestions);
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
            const finalDecision = await takeFinalDecision(initialQuestion, [...decisionPath, { question: messages[messages.length - 1].content, answer: option }], userName);
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

    function handleNameSubmit() {
        if (userName.trim() !== '') {
            localStorage.setItem('userName', userName);
            setShowNameModal(false);
            addMessageToChat(`Bonjour ${userName} ! Qu'est-ce qui te préoccupes aujourd'hui ?`, false);
        }
    }

    return (
        <div className="decision-chat-container" style={{ height: `${windowDimensions.height}px` }}>
            <header className="decision-chat-header">
                <img src={logo} alt="Logo" className="decision-chat-logo" />
                <h1 className="decision-chat-title">
                    Décision
                </h1>
            </header>
            <div className="decision-chat-body">
                <div
                    ref={chatContainerRef}
                    className="decision-chat-messages"
                >
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} handleOptionClick={handleOptionClick} />
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="loader">
                            <div></div><div></div><div></div><div></div>
                        </div>
                    )}
                </div>
                <div className="decision-chat-input">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
                        placeholder="Posez votre question..."
                        className="decision-chat-input-field"
                    />
                    <button
                        onClick={handleUserInput}
                        className="decision-chat-send-button"
                    >
                        <Send size={18} />
                        <span className="decision-chat-send-text">Envoyer</span>
                    </button>
                </div>
            </div>
            {showNewConversation && (
                <div className="decision-chat-actions">
                    <button
                        onClick={startNewConversation}
                        className="decision-chat-action-button"
                    >
                        <RotateCcw size={18} />
                        <span>Nouvelle</span>
                    </button>
                    <button
                        onClick={() => saveChatToPdf(messages)}
                        className="decision-chat-action-button"
                    >
                        <Save size={18} />
                        <span>PDF</span>
                    </button>
                </div>
            )}
            {showNameModal && (
                <NameModal
                    userName={userName}
                    setUserName={setUserName}
                    handleNameSubmit={handleNameSubmit}
                />
            )}
        </div>
    );
}