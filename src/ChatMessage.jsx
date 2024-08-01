import React from 'react';
import { motion } from 'framer-motion';

const ChatMessage = ({ message, handleOptionClick }) => {
    return (
        <motion.div
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
    );
};

export default ChatMessage;