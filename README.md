# CTr Website

Site web personnel créé avec React, présentant un portfolio, une carte interactive des voyages et des informations personnelles.

## 🚀 Technologies utilisées

- **React** 16.10.1 (à migrer vers React 18)
- **React Router** 5.1.1 (à migrer vers v6)
- **Leaflet** - Cartes interactives
- **Bootstrap** - Framework CSS
- **AWS S3 & CloudFront** - Hébergement

## 📁 Structure du projet

```
src/
├── Components/
│   ├── About/          # Composants "À propos"
│   ├── Home/           # Page d'accueil et carousel
│   ├── Map/            # Composants de carte interactive
│   ├── HeaderComponent.js
│   ├── MiniBioComponent.js
│   └── NotFoundComponent.js
├── App.js              # Composant principal avec routing
├── index.js            # Point d'entrée de l'application
└── utils/              # Utilitaires (logger, etc.)
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📜 Scripts disponibles

### `npm start`
Lance l'application en mode développement avec hot-reload.

### `npm run build`
Construit l'application pour la production dans le dossier `build/`.

### `npm test`
Lance les tests en mode interactif.

### `npm run deploy`
Déploie le build sur AWS S3 (nécessite la configuration AWS CLI).

## 🚢 Déploiement

Le déploiement est automatisé via GitHub Actions lors d'un push sur la branche `master`.

### Déploiement manuel

1. **Build de l'application**
   ```bash
   npm run build
   ```

2. **Synchroniser avec S3**
   ```bash
   aws s3 sync build/ s3://clementtailleur.com --delete --profile user-clement
   ```

3. **Synchroniser les images de la carte (si nécessaire)**
   ```bash
   aws s3 sync public/img/map/ s3://clementtailleur.com/img/map/ --profile user-clement
   ```

4. **Invalider le cache CloudFront**
   ```bash
   aws cloudfront create-invalidation --distribution-id E2294DXPG9HTGF --paths "/*" --profile user-clement
   ```

### Configuration CI/CD

Le workflow GitHub Actions (`.github/workflows/main.yml`) :
- Build automatique sur push vers `master`
- Déploiement automatique sur S3
- Invalidation du cache CloudFront

**Secrets GitHub requis :**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION`

**⚠️ Permissions IAM requises :**
Consultez [AWS_PERMISSIONS.md](./AWS_PERMISSIONS.md) pour configurer les permissions nécessaires (S3 et CloudFront).

## 📝 Améliorations prévues

Consultez le fichier [IMPROVEMENTS.md](./IMPROVEMENTS.md) pour la liste complète des améliorations proposées.

**Priorités :**
- ✅ Migration vers React 18
- ✅ Migration vers React Router v6
- ✅ Nettoyage des console.log
- ✅ Amélioration de l'accessibilité
- ✅ Code splitting et lazy loading

## 📚 Documentation

- [Guide de migration](./MIGRATION_GUIDE.md) - Instructions pour migrer vers les dernières versions
- [Améliorations proposées](./IMPROVEMENTS.md) - Liste détaillée des améliorations
- [Permissions AWS](./AWS_PERMISSIONS.md) - Configuration des permissions IAM pour le déploiement

## 🔗 Liens utiles

- [React Documentation](https://reactjs.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Leaflet Documentation](https://leafletjs.com/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
