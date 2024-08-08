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
    const systemPrompt = `Tu es un conseiller d'orientation expert et empathique pour les bacheliers au Bénin. 
    Ton rôle est de poser des questions engageantes, réfléchies et adaptées au contexte béninois pour guider les étudiants vers leur futur métier.
    Utilise un langage simple, amical et tutoie l'étudiant. Sois attentif aux nuances culturelles et aux opportunités spécifiques au Bénin.`;

    const etapesPrompt = {
        1: "Passions et intérêts : Explore ce qui passionne vraiment l'étudiant dans le contexte béninois.",
        2: "Compétences intellectuelles : Évalue les forces académiques de l'étudiant en lien avec les filières disponibles au Bénin.",
        3: "Préférences de travail : Découvre l'environnement de travail idéal pour l'étudiant, en considérant les réalités du marché de l'emploi béninois.",
        4: "Rêves et aspirations : Questionne sur les ambitions à long terme de l'étudiant et leur faisabilité au Bénin.",
        5: "Expériences pratiques : Interroge sur les expériences concrètes, stages ou projets personnels de l'étudiant en lien avec ses intérêts professionnels.",
        6: "Valeurs personnelles : Explore ce qui est vraiment important pour l'étudiant dans la vie et comment cela s'aligne avec les valeurs de la société béninoise.",
        7: "Défis et obstacles : Découvre comment l'étudiant aborde les difficultés, en tenant compte des défis spécifiques au Bénin.",
        8: "Vision du futur : Questionne sur la façon dont l'étudiant imagine le Bénin dans 10 ans et son rôle dans ce futur.",
        9: "Impact souhaité : Demande quel changement l'étudiant aimerait apporter au Bénin et au monde."
    };

    const userPrompt = `Étape ${etape}/9 : ${etapesPrompt[etape]}

        Contexte précédent : ${context}
        Profil de l'étudiant : ${JSON.stringify(profil)}

        Génère un objet JSON avec la structure suivante :
        {
            "question": "Une question réfléchie et cohérente à choix multiples pour orienter un nouveau bachelier béninois",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "analyse": "Brève explication de l'importance de cette question pour l'orientation au Bénin (1-2 phrases)"
        }

        Règles :
        1. La question doit être engageante, faire réfléchir l'étudiant et être pertinente pour le contexte béninois (max 30 mots).
        2. Fournis exactement 4 options variées et intéressantes, adaptées aux réalités du Bénin (max 15 mots chacune).
        3. Les options doivent être claires, distinctes et refléter la diversité des parcours possibles au Bénin.
        4. L'analyse doit être concise (1-2 phrases) et montrer la pertinence de la question pour l'orientation dans le contexte béninois.
        5. Adapte les questions et options au contexte socio-économique du Bénin et aux opportunités locales.
        6. Intègre des éléments spécifiques au système éducatif et au marché du travail béninois dans tes questions et options.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    const result = await JSONOpenAI(messages);
    return JSON.parse(result);
}

export async function generateStartupDecisionNode(etape, context = '', profil = {}) {
    const systemPrompt = `Tu es un conseiller expert en entrepreneuriat pour les jeunes au Bénin. 
    Ton rôle est de poser des questions engageantes et réfléchies pour évaluer le profil entrepreneurial des jeunes et les guider dans leur projet de startup.
    Sois amical, utilise un langage simple et tutoie l'entrepreneur en herbe.`;

    const etapesPrompt = {
        1: "Motivations entrepreneuriales : Explore ce qui pousse le jeune à vouloir créer une startup.",
        2: "Compétences clés : Évalue les compétences entrepreneuriales du jeune.",
        3: "Expérience professionnelle : Découvre l'expérience pertinente du jeune pour l'entrepreneuriat.",
        4: "Idée de startup : Questionne sur l'idée de startup ou le domaine d'intérêt du jeune.",
        5: "Connaissances du marché : Évalue la compréhension du marché béninois par le jeune.",
        6: "Réseau et ressources : Explore les ressources et le réseau dont dispose le jeune.",
        7: "Gestion du risque : Découvre l'approche du jeune face aux risques entrepreneuriaux.",
        8: "Vision à long terme : Questionne sur la vision à long terme du jeune pour sa startup.",
        9: "Impact social : Demande quel impact social le jeune souhaite avoir avec sa startup."
    };

    const userPrompt = `Étape ${etape}/9 : ${etapesPrompt[etape]}

        Contexte précédent : ${context}
        Profil de l'étudiant : ${JSON.stringify(profil)}

        Génère un objet JSON avec la structure suivante :
        {
            "question": "Une question réfléchie et cohérente à choix multiples pour orienter un nouveau bachelier béninois",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "analyse": "Brève explication de l'importance de cette question pour l'orientation au Bénin (1-2 phrases)"
        }

        Règles :
        1. La question doit être engageante, faire réfléchir l'étudiant et être pertinente pour le contexte béninois (max 30 mots).
        2. Fournis exactement 4 options variées et intéressantes, adaptées aux réalités du Bénin (max 15 mots chacune).
        3. Les options doivent être claires, distinctes et refléter la diversité des parcours possibles au Bénin.
        4. L'analyse doit être concise (1-2 phrases) et montrer la pertinence de la question pour l'orientation dans le contexte béninois.
        5. Adapte les questions et options au contexte socio-économique du Bénin et aux opportunités locales.
        6. Intègre des éléments spécifiques au système éducatif et au marché du travail béninois dans tes questions et options.`;

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


export async function takeStartupFinalDecision(initialQuestion, decisionPath, userName) {
    const systemPrompt = `Tu es un conseiller expert en entrepreneuriat pour les jeunes au Bénin. 
    Ton rôle est d'analyser les réponses d'un jeune entrepreneur en herbe et de fournir une évaluation 
    détaillée de son profil entrepreneurial, ainsi que des recommandations personnalisées pour son projet de startup.`;

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


// const API_URL = 'http://localhost:5001/api';
const API_URL = import.meta.env.VITE_API_URL

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
