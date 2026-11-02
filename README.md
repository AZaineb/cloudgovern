# CloudGovern

Dashboard de gestion de ressources **Microsoft Azure** (données fictives). Mini projet Web : HTML5, CSS3 (Grid), puis JavaScript.

## Lancer le projet

Les modules JavaScript demandent un serveur local (un double-clic sur `index.html` ne suffit pas) :

1. Ouvrir le dossier dans VS Code.
2. Installer l'extension **Live Server**.
3. Clic droit sur `index.html` puis **Open with Live Server**.

Une connexion Internet est nécessaire (Chart.js et Google Fonts viennent d'un CDN).

## Fonctionnalités JavaScript (sujet 3)

| Exigence | Où |
|----------|----|
| Tri, filtrage et mise à jour dynamique des tableaux | `pages/ressources.html` (`js/ressources.js`) |
| Graphiques interactifs (Chart.js) | Vue d'ensemble et Coûts (`js/charts.js`) |
| Actualisation automatique (`setInterval`, toutes les 5 s) | Toutes les pages (`startLive` dans `js/utils.js`) |
| Sauvegarde des préférences (`localStorage`) | Tri, filtres, recherche, type de graphique, actualisation |
| Bonus : plusieurs types de graphiques | Barres ou courbe (page Coûts) |
| Bonus : export CSV | Bouton sur la page Ressources |

## Structure

```
index.html, pages/*.html     pages
css/*.css                    un fichier CSS par page
js/data.js                   données fictives et simulation
js/utils.js                  fonctions partagées (tableaux, localStorage, actualisation)
js/charts.js                 graphiques Chart.js
js/index.js, ressources.js, abonnements.js, couts.js   un module par page
```

## Bibliothèque externe

[Chart.js](https://www.chartjs.org/) 4.4.7, chargée depuis jsDelivr.
