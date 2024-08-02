import React from 'react';
import { genererPDF } from './utils/pdfUtils';
import { ChevronLeft, PhoneCall, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DecisionFinaleComponent = ({ decision, userInfo, onback }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="w-full mb-6">
                <button
                    onClick={onback}
                    className="flex items-center text-fuschia-600 hover:text-fuschia-700 transition-colors duration-200"
                >
                    <ChevronLeft size={24} className="mr-2" />
                    Retour à l'accueil
                </button>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-center text-fuschia-600">Ton orientation professionnelle, {userInfo.nom}</h2>
            <div className="text-lg mb-8 text-center">
                <p className="italic">{decision.introduction}</p>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Ton profil</h3>
                <p className="mb-4">{decision.analyse.profil}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Tes points forts :</h4>
                        <ul className="list-disc pl-5">
                            {decision.analyse.points_forts.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Tes domaines d'intérêt :</h4>
                        <ul className="list-disc pl-5">
                            {decision.analyse.domaines_interet.map((domaine, index) => (
                                <li key={index}>{domaine}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Métier recommandé</h3>
                <h4 className="text-xl font-medium mb-2">{decision.recommandations.metier_principal.nom}</h4>
                <p className="mb-4">{decision.recommandations.metier_principal.description}</p>
                <p className="italic mb-4">{decision.recommandations.metier_principal.adequation}</p>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Autres métiers à considérer</h3>
                <ul className="list-disc pl-5">
                    {decision.recommandations.metiers_alternatifs.map((metier, index) => (
                        <li key={index} className="mb-2">
                            <span className="font-medium">{metier.nom}</span> : {metier.description}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Filière d'études recommandée</h3>
                <h4 className="text-xl font-medium mb-2">{decision.recommandations.filiere.nom}</h4>
                <p className="mb-4">{decision.recommandations.filiere.description}</p>
                <h5 className="font-semibold mb-2">Établissements proposant cette filière :</h5>
                <ul className="list-disc pl-5">
                    {decision.recommandations.filiere.etablissements.map((etablissement, index) => (
                        <li key={index}>{etablissement}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-8 w-full">
                <h3 className="text-2xl font-semibold mb-4 text-violet-600">Conseils pour réussir</h3>
                <ul className="list-decimal pl-5">
                    {decision.recommandations.conseils.map((conseil, index) => (
                        <li key={index} className="mb-2">{conseil}</li>
                    ))}
                </ul>
            </div>

            <div className="text-lg mb-8 text-center italic">
                <p>{decision.conclusion}</p>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => navigate('/coaches')}
                    className="flex items-center justify-center px-6 py-3 bg-fuschia-500 text-white rounded-lg transition-all hover:bg-fuschia-600"
                >
                    <PhoneCall size={20} className="mr-2" />
                    Parler à un coach
                </button>
                <button
                    onClick={() => genererPDF(decision, userInfo.name)}
                    className="flex items-center justify-center px-6 py-3 bg-violet-500 text-white rounded-lg transition-all hover:bg-violet-600"
                >
                    <Download size={20} className="mr-2" />
                    Télécharger ta fiche
                </button>
            </div>
        </div>
    )
};

export default DecisionFinaleComponent