import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { api } from './api';
import 'react-phone-number-input/style.css';
import { ConstructionIcon } from 'lucide-react';

const UserInfoModal = ({ onSubmit, onExistingDecision }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!phoneNumber) {
            setError('Veuillez entrer un numéro de téléphone valide');
            return;
        }

        console.log("login")

        setIsLoading(true);



        try {
            const checkUserResponse = await api.get(`/users/${phoneNumber}`);

            if (checkUserResponse.data) {
                const historyResponse = await api.get(`/history/session/${checkUserResponse.data.id}`);
                const finalDecision = historyResponse.data.find(entry => entry.final_decision);

                console.log(finalDecision)

                if (finalDecision) {
                    onExistingDecision(finalDecision.final_decision);
                    return;
                }

                onSubmit({ id: checkUserResponse.data.id, name: checkUserResponse.data.name, phoneNumber });
            } else {
                const createUserResponse = await api.post('/users', { name, phone_number: phoneNumber });
                onSubmit({ id: createUserResponse.data.user.id, name, phoneNumber: createUserResponse.data.user.phone_number });
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-fuschia-600">Bienvenue dans ton orientation</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Ton nom</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm placeholder-gray-400
                                       focus:outline-none focus:border-fuschia-500 focus:ring-2 focus:ring-fuschia-200 transition duration-200"
                            required
                            placeholder="Entrez votre nom"
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Ton numéro de téléphone</label>
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="BJ"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm placeholder-gray-400
                                       focus:outline-none focus:border-fuschia-500 focus:ring-2 focus:ring-fuschia-200 transition duration-200"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-3 px-4 rounded-xl hover:from-fuschia-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-fuschia-200 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Chargement...' : 'Commencer l\'aventure'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserInfoModal;