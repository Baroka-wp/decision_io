import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, ChevronLeft, AlignLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { useAuth } from './context/AuthContext';

const CoachDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDecision, setSelectedDecision] = useState(null);
    const { coach } = useAuth();


    useEffect(() => {
        if (!coach) {
            const token = localStorage.getItem('coachToken');
            if (!token) {
                navigate('/coach-login');
            }
        } else {
            fetchAppointments();
        }
    }, [coach, navigate]);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/appointments/${coach.id}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
        }
        setIsLoading(false);
    };

    const handleStatusChange = async (appointmentId) => {
        try {
            setIsLoading(true);
            await api.put(`/appointments/confirm/${appointmentId}`);
            setAppointments(appointments.map(app =>
                app.id === appointmentId ? { ...app, status: 'confirmed' } : app
            ));
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserDecision = async (userId) => {
        try {
            const response = await api.get(`/history/session/${userId}`);
            if (response.data && response.data.length > 0) {
                setSelectedDecision(JSON.parse(response.data[0].decision));
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la décision:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-fuschia-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-fuschia-600 mb-6">Votre tableau de bord</h1>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-violet-600 mb-4">Historique des rendez-vous</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telephone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de demande</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiche</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valider</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <User size={20} className="mr-2 text-fuschia-500" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{appointment.users.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <User size={20} className="mr-2 text-fuschia-500" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">{appointment.users.phone_number}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <Calendar size={16} className="inline mr-1 text-fuschia-500" />
                                                    {new Date(appointment.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <Clock size={16} className="inline mr-1 text-fuschia-500" />
                                                    {new Date(appointment.created_at).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => fetchUserDecision(appointment.user_id)}
                                                    className="text-fuschia-600 hover:text-fuschia-900"
                                                    title="Voir les détails"
                                                >
                                                    <AlignLeft size={20} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id)}
                                                    className="text-green-600 hover:text-green-900 mr-2"
                                                    title="Confirmer"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {selectedDecision && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-fuschia-600">Décision finale de l'utilisateur</h2>
                            <button
                                onClick={() => setSelectedDecision(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        </div>

                        <div className="text-lg mb-8 text-center">
                            <p className="italic">{selectedDecision.introduction}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-4 text-violet-600">Profil</h3>
                            <p className="mb-4">{selectedDecision.analyse.profil}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Points forts :</h4>
                                    <ul className="list-disc pl-5">
                                        {selectedDecision.analyse.points_forts.map((point, index) => (
                                            <li key={index}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Domaines d'intérêt :</h4>
                                    <ul className="list-disc pl-5">
                                        {selectedDecision.analyse.domaines_interet.map((domaine, index) => (
                                            <li key={index}>{domaine}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-4 text-violet-600">Métier recommandé</h3>
                            <h4 className="text-xl font-medium mb-2">{selectedDecision.recommandations.metier_principal.nom}</h4>
                            <p className="mb-4">{selectedDecision.recommandations.metier_principal.description}</p>
                            <p className="italic mb-4">{selectedDecision.recommandations.metier_principal.adequation}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-4 text-violet-600">Autres métiers à considérer</h3>
                            <ul className="list-disc pl-5">
                                {selectedDecision.recommandations.metiers_alternatifs.map((metier, index) => (
                                    <li key={index} className="mb-2">
                                        <span className="font-medium">{metier.nom}</span> : {metier.description}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-4 text-violet-600">Filière d'études recommandée</h3>
                            <h4 className="text-xl font-medium mb-2">{selectedDecision.recommandations.filiere.nom}</h4>
                            <p className="mb-4">{selectedDecision.recommandations.filiere.description}</p>
                            <h5 className="font-semibold mb-2">Établissements proposant cette filière :</h5>
                            <ul className="list-disc pl-5">
                                {selectedDecision.recommandations.filiere.etablissements.map((etablissement, index) => (
                                    <li key={index}>{etablissement}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-4 text-violet-600">Conseils pour réussir</h3>
                            <ul className="list-decimal pl-5">
                                {selectedDecision.recommandations.conseils.map((conseil, index) => (
                                    <li key={index} className="mb-2">{conseil}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-lg mb-8 text-center italic">
                            <p>{selectedDecision.conclusion}</p>
                        </div>

                        <button
                            onClick={() => setSelectedDecision(null)}
                            className="w-full bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-2 px-4 rounded hover:from-fuschia-600 hover:to-violet-600 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachDashboard;