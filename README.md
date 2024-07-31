# Assistant de Décision IA

## Description
L'Assistant de Décision IA est une application web interactive conçue pour aider les utilisateurs à prendre des décisions en posant une série de questions pertinentes. Utilisant une interface de chat alimentée par l'IA, l'application guide l'utilisateur à travers un processus de décision structuré, aboutissant à une recommandation finale.

## Fonctionnalités principales
- Interface de chat interactive
- Génération de questions personnalisées basées sur l'entrée de l'utilisateur
- Processus de décision en 5 étapes
- Recommandation finale (OUI/NON) avec une brève explication
- Sauvegarde de l'historique de conversation en PDF
- Possibilité de démarrer une nouvelle conversation

## Technologies utilisées
- React.js
- Tailwind CSS
- OpenAI API
- jsPDF

## Installation

1. Clonez le dépôt :
   ```
   git clone https://github.com/votre-nom/decision_io.git
   ```

2. Naviguez dans le répertoire du projet :
   ```
   cd decision_io
   ```

3. Installez les dépendances :
   ```
   npm install
   ```

4. Créez un fichier `.env` à la racine du projet et ajoutez votre clé API OpenAI :
   ```
   REACT_APP_OPENAI_API_KEY=votre_clé_api_ici
   ```

5. Démarrez l'application en mode développement :
   ```
   npm start
   ```

## Utilisation

1. Ouvrez l'application dans votre navigateur.
2. Entrez votre nom lorsque vous y êtes invité.
3. Posez votre question ou décrivez la décision que vous devez prendre.
4. Répondez aux questions générées par l'IA en choisissant parmi les options proposées.
5. Après 5 questions, l'assistant fournira une recommandation finale.
6. Vous pouvez alors sauvegarder la conversation en PDF ou démarrer une nouvelle conversation.

## Contribution
Les contributions à ce projet sont les bienvenues. Veuillez suivre ces étapes pour contribuer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence
Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## Contact
Votre Nom - [@votretwitter](https://twitter.com/votretwitter) - email@example.com

Lien du projet : [https://github.com/votre-nom/decision_io.git](https://github.com/votre-nom/decision_io.git)