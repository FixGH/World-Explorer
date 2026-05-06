# World Explorer

Application web de visualisation de pays construite avec Vue 3 et Vuetify, basée sur l’API REST Countries.  
Le projet propose une expérience moderne pour explorer, comparer et analyser des données pays avec une interface responsive.

## Présentation rapide

World Explorer est un projet scolaire orienté front-end qui met en pratique :
- la consommation d’API REST,
- la gestion d’état centralisée avec Pinia,
- le routage dynamique,
- la persistance locale côté navigateur.

## Objectifs du projet

- Concevoir une application Vue structurée et maintenable.
- Afficher des données pays de manière claire et utile pour l’utilisateur.
- Proposer des interactions concrètes : recherche, filtres, tri, favoris, comparaison.
- Appliquer de bonnes pratiques de qualité (composants réutilisables, états loading/error, configuration environnement).

## Fonctionnalités principales

- Explorateur de pays avec recherche, filtre par région et tri.
- Détail d’un pays via route dynamique.
- Comparaison de deux pays avec mise en évidence des écarts.
- Carte Leaflet sur la page détail.
- Gestion des favoris avec persistance `localStorage`.
- Historique des pays récemment consultés (persisté).
- Vue statistiques globale.
- Recherche globale dans la barre de navigation.
- Page 404 pour routes inconnues.

## Technologies utilisées

- **Vue 3** (Composition API)
- **Vuetify 3**
- **Pinia**
- **Vue Router 4**
- **Axios**
- **Leaflet**
- **REST Countries API**
- **localStorage** (persistance favoris/récents)

## Installation

```bash
npm install
```

## Variables d’environnement

Le projet utilise une variable pour l’URL de base de l’API :

```env
VITE_REST_COUNTRIES_API_URL=https://restcountries.com/v3.1
```

Fichier fourni :
- `.env.example`

Vous pouvez copier ce fichier vers `.env` si vous souhaitez personnaliser la configuration locale :

```bash
cp .env.example .env
```

> `.env` est optionnel : une valeur de fallback est prévue dans le service API.

## Lancer le projet en développement

```bash
npm run dev
```

## Build de production

```bash
npm run build
```

## Structure du projet

```text
src/
├── App.vue
├── main.js
├── components/          # Composants UI réutilisables
├── pages/               # Pages routées
├── router/              # Définition des routes
├── services/            # Accès API (Axios)
├── stores/              # Stores Pinia
├── plugins/             # Configuration Vuetify
└── styles/              # Styles globaux
```

## Architecture technique

- **Pages (`src/pages`)**  
  Regroupent la logique de présentation des écrans principaux : accueil, exploration, comparaison, détail, statistiques, favoris, etc.

- **Composants (`src/components`)**  
  Contiennent des briques réutilisables (cartes pays, filtres, états loading/error, table de comparaison, recherche globale, etc.).

- **Store Pinia (`src/stores/countries.js`)**  
  Centralise l’état applicatif : données API, recherche/filtres/tri, comparaison, favoris, récents, statistiques calculées.

- **Services API (`src/services`)**  
  Encapsulent les appels HTTP via Axios (`apiClient` + `countriesService`) pour éviter de disperser les requêtes dans les composants/pages.

- **Routing (`src/router/index.js`)**  
  Gère la navigation, dont la route dynamique de détail (`/countries/:code`) et la page 404.

- **Persistance locale (`localStorage`)**  
  Utilisée pour conserver les favoris et les pays récemment consultés entre les sessions.

## API utilisée

- **REST Countries** : [https://restcountries.com](https://restcountries.com)
- Données récupérées :
  - liste des pays (nom, drapeau, région, population, superficie, etc.),
  - détail d’un pays (capitale, langues, monnaies, coordonnées, frontières, cartes, etc.).

## Détail des fonctionnalités clés

- **Country Explorer**  
  Liste de pays consultable avec cartes et accès au détail.

- **Recherche / filtre / tri**  
  Recherche textuelle, filtre par région, tri par nom ou population.

- **Détail pays**  
  Vue complète d’un pays avec informations structurées.

- **Carte Leaflet**  
  Positionnement visuel du pays via coordonnées.

- **Favoris**  
  Ajout/retrait rapide + notifications snackbar + persistance locale.

- **Comparaison**  
  Comparaison côte à côte de deux pays sur des indicateurs pertinents.

- **Statistiques**  
  Vue d’ensemble mondiale avec classements et indicateurs.

- **Récemment consultés**  
  Historique limité et persistant des dernières fiches ouvertes.

- **Recherche globale**  
  Accès rapide à un pays depuis la barre de navigation.

- **Page 404**  
  Gestion propre des routes invalides.

## Qualité et bonnes pratiques

- Composants réutilisables et découplage UI/logique.
- État global centralisé dans Pinia.
- Abstraction des appels API via services dédiés.
- Design responsive (desktop/tablette/mobile).
- Gestion explicite des états de chargement et d’erreur.
- Persistance `localStorage` robuste (fallback et validation de données).

## Améliorations possibles

- Déploiement (Vercel/Netlify) avec pipeline CI simple.
- Enrichissement des graphiques/statistiques.
- Recommandations de pays (similitude région/population/langues).
- Fonctions cartographiques avancées (couches, interactions supplémentaires).
- Interface multilingue (i18n).
