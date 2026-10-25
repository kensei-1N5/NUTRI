# NUTRI V1.2.0 — Recettes personnelles

PWA installable depuis Safari sur iPhone, publication HTTPS / GitHub Pages.

## Nouveautés
- Module Recettes : plusieurs ingrédients, quantités en grammes et nombre de portions.
- Calcul des calories et macros par portion ; ajout d’une portion au journal.
- Les recettes conservent un instantané nutritionnel des ingrédients : la suppression ultérieure d’un aliment ne casse pas la recette.
- Migration IndexedDB version 1 vers 2 sans suppression des données existantes.
- Export chiffré incluant les recettes ; restauration des sauvegardes v1 et v2.

## Limitations
La bibliothèque alimentaire externe, le scanner de codes-barres, les graphiques avancés et l’IA photo ne sont pas encore intégrés. Les valeurs sont basées sur les aliments créés par l’utilisateur. Les sauvegardes doivent être conservées dans Fichiers ou iCloud Drive et leur présence vérifiée manuellement.

## Mise à jour
Effectuez une sauvegarde externe avant publication. Remplacez les fichiers sur GitHub Pages sans désinstaller la PWA. Testez l’ajout d’une recette, son ajout au journal, puis export/restauration.
