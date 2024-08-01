import React from 'react';
import { User } from 'lucide-react';

const NameModal = ({ userName, setUserName, handleNameSubmit }) => {
    return (
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
    );
};

export default NameModal;