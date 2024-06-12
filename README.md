# Projet GUI Editeur

## Description

Ce projet est une interface graphique de contrôle optimal qui permet de soumettre des descriptions de problèmes et d'afficher les solutions correspondantes.

## Fonctionnalités

- Soumission de descriptions de problèmes via un éditeur de texte.
- Affichage des solutions, du code et des options renvoyés par le backend.
- Éditeur de texte avec coloration syntaxique.

## Problèmes Potentiels

### Backend
- le backend doit être démarré et doit écouter sur le bon port.
- les routes API doivent être correctes.
- les configurations CORS doivent être correctes pour permettre les requêtes depuis le frontend.

## Installation

1. Clonez le dépôt.
2. Installez les dépendances avec `npm install`.
3. Démarrez l'application avec `npm start`.

## Dépendances

- React
- Axios
- React CodeMirror2
- CodeMirror

## Problèmes Rencontrés et solution proposées

Problème de duplication avec React-Codemirror2

J'ai rencontré un problème de duplication lors de l'utilisation de React-Codemirror2 pour intégrer un éditeur de code dans l'interface .J'ai constaté que deux instances de l'éditeur de code étaient rendues à chaque fois que le composant était monté, ce qui causait des erreurs et un comportement inattendu dans notre application.

J'ai essayé plusieurs approches pour résoudre ce problème, notamment la vérification des configurations de rendu, la recherche de problèmes dans ma logique de rendu de composants, ainsi que la recherche de problèmes dans la configuration de React-Codemirror2 elle-même. Cependant, aucune de ces approches n'a résolu le problème.

Finalement, après avoir consulté la communauté sur Stack Overflow et examiné un commentaire d'un autre développeur confronté au même problème, j'ai découvert une solution intéressante. En supprimant simplement le composant React.StrictMode de mon fichier index.js, j'ai réussi à résoudre le problème de duplication des instances de React-Codemirror2.

