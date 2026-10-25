# NUTRI V2.6.0 — Refonte esthétique

Version de validation esthétique. Nouveau journal d’accueil avec 4 repas et ajout direct, nouvelle navigation à 5 onglets, raccourcis pour conserver l’accès aux anciens modules.

La base IndexedDB conserve son nom et sa version : aucune migration ni suppression de données. Avant publication, créer une sauvegarde externe.

## Tests attendus sur iPhone
1. Ouvrir Journal, vérifier les 4 repas.
2. Toucher + sur Déjeuner, sélectionner un aliment et une quantité, enregistrer.
3. Vérifier le retour sur Journal et la mise à jour des calories.
4. Vérifier les 5 onglets, les raccourcis des fonctionnalités historiques et la date.
5. Vérifier les sauvegardes.

Limites : scanner dépend des API Safari ; reconnaissance automatique IA non disponible.
