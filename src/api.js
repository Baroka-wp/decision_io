import axios from 'axios';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function JSONOpenAI(messages) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo-1106",
                messages: messages,
                response_format: { "type": "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Réponse inattendue de l\'API OpenAI');
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API OpenAI:', error);
        throw error;
    }
}

export async function callOpenAI(messages) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Réponse inattendue de l\'API OpenAI');
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API OpenAI:', error);
        throw error;
    }
}

export async function generateDecisionNode(etape, context = '', profil = {}) {
    const systemPrompt = `Tu es un conseiller d'orientation ludique et perspicace pour les bacheliers au Bénin. 
    Ton rôle est de poser des questions engageantes et réfléchies pour guider les étudiants vers leur futur métier.
    Sois amical, utilise un langage simple et tutoie l'étudiant.`;

    const etapesPrompt = {
        1: "Passions et intérêts : Explore ce qui passionne vraiment l'étudiant.",
        2: "Compétences intellectuelles : Évalue les forces académiques de l'étudiant de manière ludique.",
        3: "Préférences de travail : Découvre l'environnement de travail idéal pour l'étudiant.",
        4: "Rêves et aspirations : Questionne sur les ambitions à long terme de l'étudiant.",
        5: "Modèles et inspirations : Demande qui inspire l'étudiant dans sa vie ou sa carrière au plan mondial.",
        6: "Valeurs personnelles : Explore ce qui est vraiment important pour l'étudiant dans la vie.",
        7: "Défis et obstacles : Découvre comment l'étudiant aborde les difficultés.",
        8: "Vision du futur : Questionne sur la façon dont l'étudiant imagine le Bénin dans 10 ans.",
        9: "Impact souhaité : Demande quel changement l'étudiant aimerait apporter au monde."
    };

    const userPrompt = `Étape ${etape}/9 : ${etapesPrompt[etape]}
    
    Contexte précédent : ${context}
    Profil de l'étudiant : ${JSON.stringify(profil)}
    
    Génère un objet JSON avec la structure suivante :
    {
        "question": "Une question réfléchie et coherente à choix multiples pour orienter un nouveau bachelier",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "analyse": "Brève explication de l'importance de cette question (1 phrase)"
    }
    
    Règles :
    1. La question doit être engageante et faire réfléchir l'étudiant (max 25 mots).
    2. Fournis exactement 4 options variées et intéressantes (max 10 mots chacune).
    3. Les options doivent être claires et distinctes.
    4. L'analyse doit être concise (1 phrase) et montrer la pertinence de la question pour l'orientation.
    5. Adapte les questions et options au contexte béninois et aux jeunes.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    const result = await JSONOpenAI(messages);
    return JSON.parse(result);
}

export async function takeFinalDecision(initialQuestion, decisionPath, userName) {
    const systemPrompt = `Tu es un conseiller d'orientation expert pour les bacheliers au Bénin. 
    Ton rôle est d'analyser les réponses d'un bachelier et de fournir une recommandation 
    d'orientation professionnelle détaillée, personnalisée et directe. Tutoie l'étudiant et 
    adresse-toi directement à lui dans tes recommandations.`;

    const userPrompt = `Analyse les réponses de ${userName} et fournis une recommandation d'orientation 
    professionnelle détaillée. Utilise le format JSON suivant:

    {
        "introduction": "Une phrase personnalisée pour introduire la recommandation",
        "analyse": {
            "profil": "Résumé détaillé du profil de l'étudiant en 3-4 phrases",
            "points_forts": ["Point fort 1", "Point fort 2", "Point fort 3"],
            "domaines_interet": ["Domaine 1", "Domaine 2", "Domaine 3"]
        },
        "recommandations": {
            "metier_principal": {
                "nom": "Nom du métier principal recommandé",
                "description": "Description détaillée du métier (2-3 phrases)",
                "adequation": "Explication de pourquoi ce métier convient à l'étudiant (2-3 phrases)"
            },
            "metiers_alternatifs": [
                {
                    "nom": "Nom du métier alternatif 1",
                    "description": "Brève description"
                },
                {
                    "nom": "Nom du métier alternatif 2",
                    "description": "Brève description"
                }
            ],
            "filiere": {
                "nom": "Nom de la filière recommandée",
                "description": "Description de la filière et son lien avec le métier recommandé",
                "etablissements": ["Nom de l'établissement 1", "Nom de l'établissement 2"]
            },
            "conseils": [
                "Conseil détaillé 1 pour réussir dans ce métier",
                "Conseil détaillé 2",
                "Conseil détaillé 3"
            ]
        },
        "conclusion": "Un message d'encouragement personnalisé pour l'étudiant"
    }

    Réponses de l'étudiant :
    ${decisionPath.map(step => `Q: ${step.question}\nR: ${step.answer}`).join('\n\n')}

    Assure-toi que les recommandations sont claires, directes et sans ambiguïté.
    Base-toi sur les métiers et filières disponibles au Bénin, en tenant compte des universités et écoles mentionnées.
    Sois précis et concret dans tes suggestions, en te basant sur les réponses de l'étudiant et les opportunités au Bénin.
    Utilise un ton amical et encourageant, en tutoyant l'étudiant et en t'adressant directement à lui.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    return await JSONOpenAI(messages);
}


const API_URL = 'http://localhost:5001/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('coachToken');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { api };


export const coachesList = [
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
