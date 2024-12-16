import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, X, CreditCard, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import UserInfoModal from '../components/modal/UserInfoModal';
import CoachCard from '../components/CoachCard';
import Navbar from '../components/Navbar';

const KKIA_PAY = import.meta.env.VITE_KKIA_PAY_KEY;

const CoachesList = () => {
    const navigate = useNavigate();
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [coachesList, setCoachList] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fecthCoaches = async () => {
            setIsLoading(true)
            const response = await api.get(`/coaches`);
            setCoachList(response.data)
            setIsLoading(false)
        }
        fecthCoaches();

    }, [])

    const handleAppointmentRequest = (coach) => {
        const fecthUserData = () => {
            const storedUserName = localStorage.getItem('user_Name');
            if (storedUserName) {
                const user = JSON.parse(storedUserName);
                setUserInfo({ id: user.id, name: user.name, phoneNumber: user.phoneNumber });
            } else {
                navigate('/');
            }
        }
        fecthUserData();

        setShowDetailsModal(false)
        setSelectedCoach(coach);
        setShowModal(true);

    };

    const handlePayment = async () => {
        openKkiapayWidget({
            amount: selectedCoach.price,
            position: "center",
            callback: "",
            data: "",
            theme: "orange",
            key: KKIA_PAY
        });

        addSuccessListener(async (response) => {
            console.log(response)
            await api.post('/appointments', {
                user_id: userInfo.id,
                coach_id: selectedCoach.id,
                date_time: null
            })
            setPaymentSuccess(true);

            setTimeout(() => {
                setPaymentSuccess(false);
                setShowModal(false);
                navigate('/');
            }, 2000);
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

    const Loader = () => (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6A5ACD]"></div>
        </div>
    );

    if (isLoading) return <Loader />

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F5F5FA] to-[#FFFFFF]">
            <Navbar />

            <div className="container mx-auto p-4 flex-grow pt-20">
                <h1 className="text-3xl font-bold mb-6 text-center text-[#6A5ACD]">Nos Coachs en Orientation</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {coachesList.map(coach => (
                        <CoachCard
                            key={coach.id}
                            coach={coach}
                            handleAppointmentRequest={handleAppointmentRequest}
                            handleShowDetails={handleShowDetails}
                        />
                    ))}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-[#6A5ACD]">Demande de rendez-vous</h2>
                            <p className="mb-4 text-[#4A4A4A]">
                                Votre demande sera envoyée à {selectedCoach.name}. Le coach vous contactera pour fixer une date de coaching.
                            </p>
                            <p className="mb-4 font-semibold text-[#2C3E50]">
                                Prix du coaching : {selectedCoach.price} FCFA
                            </p>
                            {paymentSuccess ? (
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <p className="mt-2 text-lg font-semibold text-[#2C3E50]">Paiement réussi !</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handlePayment}
                                    className="w-full bg-gradient-to-r from-[#6A5ACD] to-[#5A4ACD] text-white font-bold py-2 px-4 rounded hover:from-[#5A4ACD] hover:to-[#4A3ABD] transition-colors flex items-center justify-center"
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
                            <div className="p-6 bg-gradient-to-r from-[#6A5ACD] to-[#5A4ACD] text-white relative">
                                <h2 className="text-3xl font-bold">{selectedCoach.name}</h2>
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
                                        <img src={selectedCoach.photo_url} alt={selectedCoach.name} className="w-full h-64 object-cover rounded-lg shadow-md mb-4" />
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h3 className="font-semibold text-lg mb-2 text-[#6A5ACD]">Contact</h3>
                                            <p className="text-sm text-[#2C3E50]">Email: {selectedCoach.email}</p>
                                            <p className="text-sm text-[#2C3E50]">Tél: {selectedCoach.phone_number}</p>
                                            <p className="text-sm mt-2 text-[#2C3E50]">Prix: <span className="font-bold text-[#6A5ACD]">{selectedCoach.price} FCFA</span></p>
                                        </div>
                                    </div>

                                    {/* Colonne de droite */}
                                    <div className="md:w-2/3">
                                        <div className="mb-6">
                                            <h3 className="font-semibold text-xl mb-2 text-[#5A4ACD]">Diplômes</h3>
                                            <p className="text-[#2C3E50]">{selectedCoach.diplomes}</p>
                                        </div>
                                        <div className="mb-6">
                                            <h3 className="font-semibold text-xl mb-2 text-[#5A4ACD]">Expérience</h3>
                                            <p className="text-[#2C3E50]">{selectedCoach.experience}</p>
                                        </div>
                                        <div className="mb-6">
                                            <h3 className="font-semibold text-xl mb-2 text-[#5A4ACD]">Spécialités</h3>
                                            <ul className="list-disc pl-5">
                                                {selectedCoach.specialites && selectedCoach.specialites.map((specialite, index) => (
                                                    <li key={index} className="mb-1 text-[#2C3E50]">{specialite}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mb-6">
                                            <h3 className="font-semibold text-xl mb-2 text-[#5A4ACD]">Parcours</h3>
                                            <ul className="list-disc pl-5">
                                                {selectedCoach.parcours && selectedCoach.parcours.map((poste, index) => (
                                                    <li key={index} className="mb-1 text-[#2C3E50]">{poste}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-2 text-[#5A4ACD]">Formation</h3>
                                            <ul className="list-disc pl-5">
                                                {selectedCoach.formation && selectedCoach.formation.map((formation, index) => (
                                                    <li key={index} className="mb-1 text-[#2C3E50]">{formation}</li>
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
                                    className="w-full bg-gradient-to-r from-[#6A5ACD] to-[#5A4ACD] text-white font-bold py-3 px-4 rounded-lg hover:from-[#5A4ACD] hover:to-[#4A3ABD] transition-colors flex items-center justify-center"
                                >
                                    <Calendar size={20} className="mr-2" />
                                    Demander un rendez-vous
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachesList;