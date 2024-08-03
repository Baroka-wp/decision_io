import React from 'react';
import { Calendar, Info } from 'lucide-react';

const CoachCard = ({ coach, handleAppointmentRequest, handleShowDetails }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full min-h-[28rem] sm:min-h-[30rem]">
            <div className="relative h-56 sm:h-64">
                <img
                    src={coach.photo_url}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h2 className="text-xl font-semibold text-white">{coach.name}</h2>
                    <p className="text-sm text-gray-300">{coach.diplomes}</p>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-3">{coach.experience}</p>
                    <p className="text-fuschia-600 font-semibold mb-2">Prix: {coach.price} FCFA</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                        onClick={() => handleAppointmentRequest(coach)}
                        className="flex-1 bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-3 px-3 rounded hover:from-fuschia-600 hover:to-violet-600 flex items-center justify-center text-sm"
                    >
                        <Calendar size={16} className="mr-1 flex-shrink-0" />
                        <span className="truncate">Rendez-vous</span>
                    </button>
                    <button
                        onClick={() => handleShowDetails(coach)}
                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-3 rounded hover:bg-gray-300 flex items-center justify-center text-sm"
                    >
                        <Info size={16} className="mr-1 flex-shrink-0" />
                        <span className="truncate">Plus d'infos</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoachCard;