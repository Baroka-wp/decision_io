import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const coachesList = [
    {
        id: 1,
        nom: "Dr. Aïcha Koné",
        diplomes: "Doctorat en Psychologie de l'Orientation, Université de Parakou",
        experience: "15 ans d'expérience en orientation professionnelle",
        specialites: ["Orientation scolaire", "Reconversion professionnelle", "Coaching de carrière"],
        description: "Dr. Koné est une experte reconnue dans le domaine de l'orientation professionnelle au Bénin. Elle a aidé des centaines d'étudiants à trouver leur voie."
    },
    {
        id: 2,
        nom: "M. Olivier Houndété",
        diplomes: "Master en Gestion des Ressources Humaines, Université d'Abomey-Calavi",
        experience: "10 ans dans le recrutement et l'orientation professionnelle",
        specialites: ["Bilan de compétences", "Préparation aux entretiens", "Développement personnel"],
        description: "M. Houndété combine son expérience en RH avec sa passion pour l'orientation, offrant une perspective unique sur le marché du travail béninois."
    },
    // Ajoutez d'autres coachs ici
];

const CoachesList = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4">
            <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-fuschia-600">
                <ArrowLeft size={20} className="mr-2" />
                Retour
            </button>
            <h1 className="text-3xl font-bold mb-6 text-center text-fuschia-600">Nos Coachs en Orientation</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coachesList.map(coach => (
                    <div key={coach.id} className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-2 text-violet-600">{coach.nom}</h2>
                        <p className="text-gray-600 mb-2">{coach.diplomes}</p>
                        <p className="text-gray-600 mb-2">{coach.experience}</p>
                        <h3 className="font-semibold mt-4 mb-2">Spécialités :</h3>
                        <ul className="list-disc pl-5 mb-4">
                            {coach.specialites.map((specialite, index) => (
                                <li key={index}>{specialite}</li>
                            ))}
                        </ul>
                        <p className="text-gray-700">{coach.description}</p>
                        <button className="mt-4 bg-gradient-to-r from-fuschia-500 to-violet-500 text-white font-bold py-2 px-4 rounded hover:from-fuschia-600 hover:to-violet-600">
                            Contacter
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoachesList;