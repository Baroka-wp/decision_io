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
                model: "gpt-4o",
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

export async function generateDecisionNode(question, context = '', depth = 0, askedQuestions) {
    const systemPrompt = `Vous êtes un expert en price de décision. Générez un nœud de décision au format JSON en fonction de la question et du contexte de l'utilisateur. Fournissez toujours des options pour chaque nœud. Posez exactement 4 questions avant de prendre une décision finale. Évitez de répéter les questions ou de poser des questions très similaires.`;

    const userPrompt = `Question: "${question}"
    ${context ? `Previous context: ${context}` : ''}
    Current depth: ${depth}
    Previously asked questions: ${Array.from(askedQuestions).join(", ")}
    
    Generate a JSON object with the following structure:
    {
        "question": "The next question to ask",
        "options": ["Option 1", "Option 2", "Option 3"],
        "isDecision": false
    }
    
    Règles :
    1. Incluez toujours au moins 2 options pour chaque nœud.
    2. Utilise la langue de l'utilisateur et tu doit être conviviale.
    3. Tu dois tutoyer l'utilisateur
    4. Définissez « isDecision » sur true uniquement s'il s'agit de la 4e question (profondeur 3).
    5. Ne répétez pas les questions qui ont déjà été posées ou ne posez pas de questions très similaires.
    6. Si vous ne pouvez pas générer une nouvelle question unique, essayez de la reformuler ou de l'aborder sous un angle différent.
    7. Il faut etre consis bref coherent et qualitatif dans tes questions et options
    
    IMPORTANT
    Utilisez un algorithme de décision avancé pour prendre une décision finale.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    const result = await JSONOpenAI(messages);
    return JSON.parse(result);
}

export async function takeFinalDecision(initialQuestion, decisionPath, userName) {
    const systemPrompt = `Vous êtes un assistant de prise de décision. Basez-vous sur la question initiale et les réponses fournies pour donner une décision finale simple et concise en une phrase maximum. La décision doit claire et sans ambiguité, suivie d'une brève explication. et des recommandations si necessaire`;

    const userPrompt = `Question initiale: "${initialQuestion}"
    
    Chemin de décision:
    ${decisionPath.map(step => `Q: ${step.question}\nR: ${step.answer}`).join('\n\n')}
    
    Basez-vous sur ces informations pour prendre une décision finale (OUI ou NON) et expliquez pourquoi en une phrase.
    Il faut tutoyer l'utilisateur, Rendre le message amical en utilisant le nom de l'utisateur ${userName}
    IMPORTANT
    Utilisez un algorithme de décision avancé pour prendre une décision finale.`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    return await callOpenAI(messages);
}