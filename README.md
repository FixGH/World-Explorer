# World Explorer

Application web **single-page** (SPA) de démonstration pédagogique : exploration des pays du monde à partir de l’API publique **REST Countries**, enrichie d’un **état local** (favoris, historique, pays personnalisés) et d’une **authentification front-end simulée** pour protéger certaines actions d’écriture.

---

## Présentation

**World Explorer** propose une interface en français (Vuetify 3, thème sombre) pour parcourir une liste de pays, consulter des fiches détaillées, comparer deux territoires, visualiser des statistiques agrégées et gérer des favoris. Une carte **Leaflet** (tuiles OpenStreetMap) illustre la localisation lorsque des coordonnées sont disponibles.

Le dépôt peut conserver le nom technique du paquet npm (`esig-141-demo-vuetify-api`) ; le produit présenté aux utilisateurs est **World Explorer**.

---

## Objectifs du projet

- Mettre en œuvre une **architecture Vue 3** claire (pages, composants, état global, services).
- Consommer une **API REST distante** de manière structurée (client HTTP dédié, couche service).
- Offrir une **expérience utilisateur** soignée : navigation, chargement, erreurs, responsive.
- Compléter avec des **données persistantes côté client** (`localStorage`) et une **démo d’authentification** sans backend (projet scolaire).

---

## Fonctionnalités principales

| Domaine | Description |
|--------|-------------|
| **Accueil** | Aperçu des accès rapides, statistiques globales, favoris et pays récemment consultés. |
| **Explorateur** | Liste des pays avec recherche, filtre par région, tri ; cartes pays avec accès fiche et favoris. |
| **Fiche pays** | Informations détaillées, cartes externes (Google Maps / OSM si disponibles), carte Leaflet, voisins frontaliers cliquables. |
| **Favoris** | Liste des pays marqués favoris, recherche et tri locaux. |
| **Comparer** | Choix de deux pays, tableau comparatif avec mise en évidence des écarts sur les indicateurs clés. |
| **Statistiques** | Synthèses et classements (population, superficie, frontières, répartition par région). |
| **Recherche globale** | Champ dans la barre d’application pour accéder rapidement à une fiche pays. |
| **Pays récemment vus** | Historique limité (dernières fiches ouvertes), persisté. |
| **Pays personnalisés** | Ajout / suppression **locale** de pays fictifs (utilisateur connecté en démo) ; données officielles REST Countries en lecture seule. |
| **Authentification démo** | Connexion simulée (`admin` / `admin`), persistance de session ; route `/add-country` protégée. |
| **À propos** | Page d’information sur le projet. |
| **404** | Route catch-all pour URL inconnues. |

---

## Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| **Vue 3** | Framework UI (Composition API, `<script setup>`). |
| **Vuetify 3** | Composants Material Design, thème, mise en page responsive. |
| **Pinia** | Stores `countries` et `auth` ; état partagé entre pages. |
| **Vue Router 4** | Navigation, routes dynamiques (`/countries/:code`), garde sur `/add-country`. |
| **Axios** | Client HTTP via `apiClient` (`src/services/apiClient.js`) pour REST Countries. |
| **Leaflet** | Carte interactive sur la fiche pays (`CountryMap.vue`). |
| **REST Countries** | API publique de données pays (JSON). |
| **Vite 5** | Build et serveur de développement. |
| **localStorage** | Persistance des favoris, historique, pays personnalisés, session auth démo. |

---

## Installation

Prérequis : **Node.js** (version compatible avec Vite 5, typiquement **18+** recommandé) et **npm**.

```bash
git clone <url-du-depot>
cd World-Explorer
npm install
```

---

## Variables d’environnement

1. Copier le fichier d’exemple (recommandé pour documenter la configuration locale) :

   ```bash
   copy .env.example .env
   ```

   Sous Linux ou macOS : `cp .env.example .env`

2. Définir l’URL de base de l’API (sans slash final en fin de chaîne ; le client normalise si besoin) :

   ```env
   VITE_REST_COUNTRIES_API_URL=https://restcountries.com/v3.1
   ```

Si `.env` est absent, l’application utilise la **même valeur par défaut** dans `apiClient.js`.

Les variables Vite doivent être préfixées par `VITE_` pour être exposées au code client.

---

## Commandes

| Commande | Usage |
|----------|--------|
| `npm run dev` | Lance le serveur de développement (**http://localhost:3000** selon `vite.config.mjs`). |
| `npm run build` | Compile l’application pour la production (`dist/`). |
| `npm run preview` | Sert le build localement pour vérification. |
| `npm run lint` | Analyse ESLint (avec `--fix` selon `package.json`). |

---

## Structure du projet

```
World-Explorer/
├── public/
├── src/
│   ├── assets/              # Ressources statiques (ex. image par défaut pays personnalisés)
│   ├── components/          # Composants réutilisables (cartes, filtres, carte, comparaison, etc.)
│   ├── pages/               # Vues associées aux routes
│   ├── plugins/             # Enregistrement Vuetify, etc.
│   ├── router/              # Définition des routes et garde d’authentification
│   ├── services/            # Client API Axios + appels REST Countries
│   ├── stores/              # Pinia (pays, authentification démo)
│   ├── styles/              # Styles globaux (ex. ui.css)
│   ├── utils/               # Utilitaires (ex. URL drapeau / placeholder)
│   ├── App.vue
│   └── main.js
├── .env.example
├── package.json
├── vite.config.mjs
└── README.md
```

---

## Architecture technique

### Pages (`src/pages/`)

Chaque fichier sous `pages/` correspond à une **vue principale** montée par le routeur : accueil, liste pays, détail (`:code`), favoris, comparer, statistiques, à propos, connexion, ajout de pays personnalisé, page 404.

### Composants (`src/components/`)

Fragments UI réutilisables : filtres, cartes pays, états chargement/erreur, tableau de comparaison, carte Leaflet, recherche globale dans la barre, formulaires, etc. Cela limite la duplication et facilite la maintenance.

### Stores Pinia (`src/stores/`)

- **`countries`** : liste officielle + pays personnalisés, chargement/erreur, filtres, favoris, comparaison, pays sélectionné pour la fiche, statistiques dérivées, persistance `localStorage` pour favoris, récents, pays custom.
- **`auth`** : session démo (`login` / `logout`), persistance `localStorage` ; **aucune sécurité réelle** (commentaire dans le code).

### Services (`src/services/`)

- **`apiClient.js`** : instance Axios (`baseURL`, timeout) branchée sur `VITE_REST_COUNTRIES_API_URL`.
- **`countriesService.js`** : fonctions `getAllCountries` et `getCountryByCode` (paramètre `fields` pour limiter la charge réseau).

### Routage (`src/router/index.js`)

Historique HTML5, routes nommées, props sur la fiche pays. **`beforeEach`** : si `meta.requiresAuth` (route `/add-country`) et utilisateur non connecté → redirection vers `/login` avec `redirect` dans la query.

### Persistance `localStorage`

Exemples de clés utilisées par l’application (à titre documentaire ; le code reste la référence) :

| Clé | Contenu |
|-----|---------|
| `world-explorer-auth` | Session de la démo d’authentification (non sécurisée). |
| `world-explorer-favorites` | Liste des codes pays favoris. |
| `world-explorer-recently-viewed` | Derniers pays consultés (aperçu). |
| `world-explorer-custom-countries` | Pays personnalisés ajoutés localement. |

Les données **officielles** ne sont jamais modifiées sur le serveur REST Countries ; seul le **navigateur** stocke les ajouts locaux.

---

## API utilisée : REST Countries

- **Base** : `https://restcountries.com/v3.1` (configurable).
- **Appels** :
  - `GET /all` avec filtre de champs pour la liste d’exploration.
  - `GET /alpha/{code}` pour le détail par code ISO alpha (ex. `FRA`).

Les réponses fournissent notamment noms, drapeaux, capitale, régions, population, superficie, frontières, langues, monnaies, fuseaux, coordonnées pour la carte, etc., selon les champs demandés.

---

## Fonctionnalités détaillées (référence rapide)

- **Explorateur** : chargement de la liste, filtres (`CountryFilters`), tri, cartes (`CountryCard`), lien vers fiche ; pays personnalisés mélangés à la liste avec badge dédié si applicable.
- **Recherche / filtre / tri** : gérés dans le store `countries` et reflétés sur la page liste.
- **Fiche pays** : chargement par code, affichage structuré, favori, cartes, Leaflet si `latlng` valide, liens vers pays frontaliers.
- **Carte Leaflet** : marqueur et popup ; tuiles OSM.
- **Favoris** : bascule depuis liste ou fiche ; page dédiée avec résumés.
- **Comparaison** : sélection A/B, tableau des champs et indicateurs avec surbrillance du « gagnant » sur les métriques numériques.
- **Statistiques** : agrégations et tops à partir du jeu de pays chargé (officiel + éventuels pays locaux).
- **Récemment vus** : mis à jour à l’ouverture d’une fiche ; affichage sur l’accueil.
- **Recherche globale** : composant dans la barre d’application pour sauter vers une fiche.
- **404** : route finale `pathMatch` pour chemins inconnus.

---

## Qualité et bonnes pratiques observées

- **Composants réutilisables** pour listes, erreurs, chargement, comparaison, carte.
- **État centralisé Pinia** pour éviter les duplications de logique entre pages.
- **Abstraction API** : appels REST regroupés dans `countriesService` + client Axios unique.
- **Interface responsive** : grille Vuetify, ajustements CSS (tableaux, mise en page).
- **États chargement / erreur** : retours visuels explicites sur les pages concernées.
- **Persistance locale** pour préférences et démo sans backend.

---

## Pistes d’amélioration (hors périmètre actuel)

- **Déploiement** : hébergement statique (GitHub Pages, Netlify, Vercel) avec `base` Vite adapté si sous-chemin.
- **Graphiques** : intégration d’une librairie de charts pour les statistiques.
- **Recommandations** : suggestions de pays proches (culture, région) à partir des données déjà chargées.
- **Carte avancée** : contours pays, clusters, autres fonds de carte.
- **Multilingue** : i18n (vue-i18n) pour EN/FR ou autres langues.
- **Tests automatisés** : tests unitaires sur le store et tests de composants (Vitest + Vue Test Utils).

---

## Avertissement (projet scolaire)

L’**authentification** et les **pays personnalisés** sont implémentés **côté client uniquement** : ce n’est pas un modèle de sécurité en production. Les identifiants démo et les données locales peuvent être modifiés ou effacés depuis les outils de développement du navigateur.

---

## Résumé de ce document

Ce **README.md** a été ajouté pour documenter de façon **complète et professionnelle** le projet **World Explorer** : objectifs, fonctionnalités réelles, stack (**Vue 3, Vuetify, Pinia, Vue Router, Axios, Leaflet, REST Countries, localStorage**), installation, variable `VITE_REST_COUNTRIES_API_URL`, commandes `dev` / `build`, structure des dossiers, architecture (pages, composants, stores, services, routeur, persistance), description de l’API, inventaire des écrans, bonnes pratiques et pistes d’évolution — le tout en **français**, sans inventer de fonctionnalités absentes du code.
