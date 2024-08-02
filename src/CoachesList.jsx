import React, { useState } from 'react';
import { ArrowLeft, Calendar, X, CreditCard, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KKIA_PAY = import.meta.env.VITE_KKIA_PAY_KEY;

const coachesList = [
    {
        id: 1,
        nom: "Dr. Désiré",
        diplomes: "Docteur en Management",
        experience: "Inspecteur général des affaires étrangères du Bénin depuis 2015",
        specialites: [
            "Management et leadership",
            "Affaires internationales et diplomatie",
            "Analyse stratégique et organisation",
            "Audit et contrôle de gestion"
        ],
        parcours: [
            "Inspecteur Général au Ministère des Affaires Etrangères et de la Coopération",
            "Directeur Associé à Cerpos Afrique"
        ],
        formation: [
            "Economie et Gestion des Entreprises à Université de Paris I Panthéon-Sorbonne",
            "Spécialité Prospective Innovation Analyse Stratégique et Organisation au CNAM Paris",
            "AUDIT ET CONTROLE DE GESTION à Pigier"
        ],
        email: "yassodesire@yahoo.fr",
        tel: "+229 66 54 76 09",
        prix: 5000,
        image: "https://res.cloudinary.com/baroka/image/upload/v1722555812/382455218_7003862366299206_5996969636059975263_n_quywfp.jpg"
    },
    {
        id: 2,
        nom: "Mr Christian David Kpondehou",
        diplomes: "Leadership/Business, van Duyse Entrepreneurial Leadership Institute - VELI Bénin",
        experience: "Président & Fondateur de Africa Diaspora Network Japan, Fondateur de Africa Samurai",
        specialites: [
            "Leadership entrepreneurial",
            "Réseautage international",
            "Développement des affaires Afrique-Japon",
            "Gestion d'organisations à but non lucratif"
        ],
        parcours: [
            "Président & Fondateur, Africa Diaspora Network Japan",
            "Fondateur et Président du Conseil, Africa Samurai"
        ],
        formation: [
            "Leadership/Business à van Duyse Entrepreneurial Leadership Institute - VELI Bénin",
            "Université d'Abomey Calavi (UAC)",
            "LYCEE CLASSIQUE ET MODERNE 1 DE DALOA, TCB (2008-2009)"
        ],
        localisation: "Awaji-shi, Hyogo, Japon",
        email: "davidkpondehou@gmail.com",
        tel: "+81912345678",
        prix: 5000,
        image: "https://res.cloudinary.com/baroka/image/upload/v1722556548/451224832_8165666756798644_8463613308947712322_n_o6csgs.jpg"
    }
];

const CoachesList = () => {
    const navigate = useNavigate();
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleAppointmentRequest = (coach) => {
        setShowDetailsModal(false)
        setSelectedCoach(coach);
        setShowModal(true);

    };

    const handlePayment = () => {
        openKkiapayWidget({
            amount: selectedCoach.prix,
            position: "center",
            callback: "",
            data: "",
            theme: "orange",
            key: KKIA_PAY
        });

        addSuccessListener(async (response) => {
            console.log({ response });
            setPaymentSuccess(true);
            setTimeout(() => {
                setPaymentSuccess(false);
                setShowModal(false);
                navigate('/');
            }, 3000);
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setPaymentSuccess(false);
    };

    const handleShowDetails = (coach) => {
        setSelectedCoach(coach);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedCoach(null);
    };

    return (
        <div className="container mx-auto p-4">
            <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-fuschia-600">
                <ArrowLeft size={20} className="mr-2" />
                Retour
            </button>
            <h1 className="text-3xl font-bold mb-6 text-center text-fuschia-600">Nos Coachs en Orientation</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coachesList.map(coach => (
                    <div key={coach.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                        <div className="h-64 bg-gray-200">
                            <img src={coach.image} alt={coach.nom} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                            <h2 className="text-xl font-semibold mb-2 text-violet-600">{coach.nom}</h2>
                            <p className="text-gray-600 text-sm mb-1">{coach.diplomes}</p>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{coach.experience}</p>
                            <p className="text-fuschia-600 font-semibold mb-2">Prix: {coach.prix} FCFA</p>
                            <div className="mt-auto pt-4 space-y-2">
                                <button
                                    onClick={() => handleAppointmentRequest(coach)}
                                    className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-2 px-4 rounded hover:from-fuschia-600 hover:to-violet-600 flex items-center justify-center"
                                >
                                    <Calendar size={20} className="mr-2" />
                                    Rendez-vous
                                </button>
                                <button
                                    onClick={() => handleShowDetails(coach)}
                                    className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Info size={20} className="mr-2" />
                                    Plus d'infos
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-fuschia-600">Demande de rendez-vous</h2>
                        <p className="mb-4">
                            Votre demande sera envoyée à {selectedCoach.nom}. Le coach vous contactera pour fixer une date de coaching.
                        </p>
                        <p className="mb-4 font-semibold">
                            Prix du coaching : {selectedCoach.prix} FCFA
                        </p>
                        {paymentSuccess ? (
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <p className="mt-2 text-lg font-semibold">Paiement réussi !</p>
                            </div>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-2 px-4 rounded hover:from-fuschia-600 hover:to-violet-600 flex items-center justify-center"
                            >
                                <CreditCard size={20} className="mr-2" />
                                Procéder au paiement
                            </button>
                        )}
                    </div>
                </div>
            )}
            {showDetailsModal && selectedCoach && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* En-tête du modal */}
                        <div className="p-6 bg-gradient-to-r from-fuschia-500 to-violet-500 text-white relative">
                            <h2 className="text-3xl font-bold">{selectedCoach.nom}</h2>
                            <button
                                onClick={closeDetailsModal}
                                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Corps du modal avec scroll */}
                        <div className="flex-grow overflow-y-auto p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Colonne de gauche */}
                                <div className="md:w-1/3">
                                    <img src={selectedCoach.image} alt={selectedCoach.nom} className="w-full h-64 object-cover rounded-lg shadow-md mb-4" />
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-2 text-fuschia-600">Contact</h3>
                                        <p className="text-sm">Email: {selectedCoach.email}</p>
                                        <p className="text-sm">Tél: {selectedCoach.tel}</p>
                                        <p className="text-sm mt-2">Prix: <span className="font-bold text-fuschia-600">{selectedCoach.prix} FCFA</span></p>
                                    </div>
                                </div>

                                {/* Colonne de droite */}
                                <div className="md:w-2/3">
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-xl mb-2 text-violet-600">Diplômes</h3>
                                        <p>{selectedCoach.diplomes}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-xl mb-2 text-violet-600">Expérience</h3>
                                        <p>{selectedCoach.experience}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-xl mb-2 text-violet-600">Spécialités</h3>
                                        <ul className="list-disc pl-5">
                                            {selectedCoach.specialites.map((specialite, index) => (
                                                <li key={index} className="mb-1">{specialite}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-xl mb-2 text-violet-600">Parcours</h3>
                                        <ul className="list-disc pl-5">
                                            {selectedCoach.parcours.map((poste, index) => (
                                                <li key={index} className="mb-1">{poste}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl mb-2 text-violet-600">Formation</h3>
                                        <ul className="list-disc pl-5">
                                            {selectedCoach.formation.map((formation, index) => (
                                                <li key={index} className="mb-1">{formation}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pied du modal */}
                        <div className="p-6 bg-gray-100 border-t border-gray-200">
                            <button
                                onClick={() => handleAppointmentRequest(selectedCoach)}
                                className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-3 px-4 rounded-lg hover:from-fuschia-600 hover:to-violet-600 transition-colors flex items-center justify-center"
                            >
                                <Calendar size={20} className="mr-2" />
                                Demander un rendez-vous
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachesList;