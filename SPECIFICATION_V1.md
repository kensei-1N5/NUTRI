# NUTRI — Spécification technique V1

## 1. Périmètre et principes
Application PWA nutritionnelle mono-utilisateur, indépendante de NEXO, française, mobile-first, design original, local-first. La V1 cible les fonctions comparables à celles d'une application nutrition premium ; la fondation V1.0.0 livrée est un sous-ensemble opérationnel.

## 2. Architecture cible
- Frontend : React + TypeScript + Tailwind CSS ; composants accessibles, navigation en cinq onglets.
- Stockage : IndexedDB via Dexie ; schéma versionné et migrations testées.
- Offline : service worker avec cache statique versionné et indicateur réseau fiable.
- Métier : services purs pour calculs nutritionnels, journal, recettes, objectifs et tendances.
- Données externes : adaptateurs Open Food Facts / CIQUAL ; conserver source, date et niveau de confiance, gérer les aliments incomplets.
- Photo IA : backend facultatif, clés secrètes côté serveur uniquement, consentement explicite, correction avant sauvegarde.
- Distribution : hébergement HTTPS statique (GitHub Pages possible) ; backend séparé seulement pour fonctions réseau sécurisées.

## 3. Modèle de données cible
- Profile : paramètres de profil facultatifs, unités, objectifs, préférences.
- Food : id, nom, marque, code-barres, source, valeurs pour 100 g/100 ml, portions, provenance.
- DiaryEntry : id, date locale, repas, foodSnapshot, quantité, unité, heure, createdAt.
- Recipe : id, nom, ingrédients référencés et quantités, portions, étapes, nutrition calculée.
- WaterEntry : id, date, quantité ml, heure.
- WeightEntry : id, date, poids kg, source.
- Activity : id, date, type, durée, dépense estimée, source.
- FastingSession : id, début, fin, objectif, état.
- Settings : objectifs, confidentialité, affichage et sauvegardes.
- SchemaVersion : numéro de migration.

Les entrées du journal doivent conserver un instantané nutritionnel pour ne pas modifier rétroactivement l'historique lorsqu'un aliment est édité. La fondation implémente déjà ce principe.

## 4. Règles de calcul
- Pour chaque macro : valeur/100 g × masse en grammes /100 ; conserver les décimales en stockage, arrondir seulement à l'affichage.
- Calories : utiliser l'énergie renseignée sur l'aliment plutôt que recalculer systématiquement à partir des macros.
- Recettes : additionner les contributions de chaque ingrédient, diviser par le nombre de portions ou le poids final selon l'unité.
- Énergie restante = objectif - énergie consommée ; la prise en compte des activités sera un paramètre explicite.
- Dates : dates civiles locales, sans décalage UTC implicite.
- Objectifs énergétiques : calcul configurable et vérifiable, jamais imposé sans validation.

## 5. Parcours utilisateur
Accueil → consulter la journée → ajouter un aliment → choisir quantité et repas → enregistrer → mise à jour immédiate des totaux. Profil → ajuster objectifs → enregistrer. Profil → exporter/restaurer. Progrès → ajouter mesure de poids.

## 6. Confidentialité et résilience
- Aucun compte obligatoire, aucune collecte analytique par défaut.
- Données sensibles stockées localement ; exports chiffrés à prévoir via Web Crypto (AES-GCM + dérivation de clé robuste) ; ne jamais stocker de clé en clair.
- Import atomique et validé ; avertissement avant remplacement.
- Tests de migration et restauration sur données de démonstration.
- Photos envoyées au serveur seulement après consentement et avec politique de rétention explicite.

## 7. Tests d'acceptation
1. Ajouter 150 g d'un aliment à 120 kcal/100 g donne 180 kcal.
2. Fermer/réouvrir la PWA conserve aliments et journal.
3. Changer la date affiche les entrées de la bonne journée.
4. Supprimer un aliment du catalogue ne supprime pas ses anciennes entrées.
5. Sauvegarder puis restaurer restitue objectifs, aliments, journal, eau et poids.
6. Hors ligne après premier chargement, l'application et les fonctions locales restent disponibles.
7. Un export invalide ne détruit pas la base existante.
8. Navigation clavier et VoiceOver fonctionnelles sur les parcours essentiels.

## 8. Phases et jalons
- A — Fondation (livrée en prototype V1.0.0) : PWA, IndexedDB, UI, journal et export JSON.
- B — Consolidation : React/TS, modules, tests, édition des entrées, migrations et graphiques.
- C — Catalogue : Open Food Facts, CIQUAL, recherche, scanner, cache et fiabilité.
- D — Nutrition avancée : recettes, menus, courses, objectifs et activités.
- E — Premium : IA photo avec backend, jeûne, rappels, analyses et export chiffré.
- F — Stabilisation : sécurité, performances, tests iOS, accessibilité, documentation.

## 9. Contraintes spécifiques iPhone
- PWA installable via Safari → Sur l'écran d'accueil.
- HealthKit non accessible directement depuis le navigateur.
- Notifications web soumises aux restrictions d'iOS et autorisations utilisateur.
- Stockage local susceptible d'être supprimé ; exports fréquents recommandés.


## Addendum V1.1.0
Sauvegarde externe chiffrée AES-GCM 256 bits avec dérivation PBKDF2 SHA-256 310000 itérations et sels/IV aléatoires. Format `.nutri` JSON versionné. Restauration transactionnelle multi-stores après validation. Détection de quota et demande de persistance si disponible. Stockage local iOS/WebKit non garanti ; sauvegarde manuelle obligatoire.


## Livraison V1.2.0
- Store `recipes` (migration IndexedDB v2), `{id,name,servings,ingredients[]}`.
- Chaque ingrédient contient un instantané des macros par 100 g et sa quantité.
- Ajout d’une portion dans `entries`, normalisée sur 100 g pour réutiliser le calcul existant.
- Sauvegarde version 2, restauration version 1 avec `recipes=[]`.
