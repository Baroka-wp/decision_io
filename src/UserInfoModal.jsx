import React, { useState } from 'react';

const UserInfoModal = ({ onSubmit }) => {
    const [nom, setNom] = useState('');
    const [telephone, setTelephone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nom, telephone });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Bienvenue dans ton orientation professionnelle</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Ton nom</label>
                        <input
                            type="text"
                            id="nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuschia-300 focus:ring focus:ring-fuschia-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Ton numéro de téléphone</label>
                        <input
                            type="tel"
                            id="telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-fuschia-300 focus:ring focus:ring-fuschia-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-2 px-4 rounded hover:bg-gradient-to-r hover:from-fuschia-600 hover:to-violet-600"
                    >
                        Commencer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserInfoModal;