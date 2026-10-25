# NUTRI V1.1.0 — Stockage et sauvegardes sécurisées

PWA autonome à publier sur HTTPS (GitHub Pages). Installer depuis Safari > Partager > Sur l’écran d’accueil.

## Nouveautés
- Sauvegarde manuelle chiffrée AES-256-GCM, PBKDF2-SHA256 (310 000 itérations), mot de passe >= 12 caractères.
- Vérification locale du fichier chiffré avant téléchargement.
- Restauration chiffrée ou import des anciennes sauvegardes JSON V1.0.0.
- Contrôle de stockage et demande de persistance lorsque le navigateur le permet.
- Écritures IndexedDB confirmées à la fin de la transaction.
- Mise à jour du cache PWA.

## Limites importantes
Le bouton Exporter prépare un téléchargement : il ne garantit pas que le fichier a été conservé dans Fichiers. Vérifiez manuellement son emplacement. Aucun accès automatique à iCloud Drive. Le stockage IndexedDB peut être supprimé par iOS ; la demande de persistance n'est pas une garantie. La date de dernière sauvegarde est un indicateur local, pas une preuve d'enregistrement. Les mots de passe ne sont pas récupérables. L'import remplace les données uniquement après validation et confirmation. La restauration d'une ancienne sauvegarde JSON n'est pas chiffrée.

## Déploiement
Décompressez et publiez tous les fichiers à la racine de votre site GitHub Pages. La PWA mise à jour utilise le cache `nutri-v1.1.0`. Conservez une sauvegarde externe avant mise à jour.
