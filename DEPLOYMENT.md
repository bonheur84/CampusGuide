# Guide de déploiement sur Vercel

## Prérequis

- Un compte Vercel (https://vercel.com)
- Un compte GitHub (pour connecter votre repository)
- Une base de données MySQL (PlanetScale, Supabase, ou autre)

## Étape 1 : Préparer le projet

1. **Pousser le code sur GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Configurer les variables d'environnement sur Vercel**
   - Allez sur https://vercel.com
   - Connectez-vous avec votre compte GitHub
   - Importez le projet CampusGuide

## Étape 2 : Configurer les variables d'environnement

Dans le dashboard Vercel, allez dans **Settings > Environment Variables** et ajoutez :

```
DB_HOST = votre_host_mysql
DB_USER = votre_utilisateur_mysql
DB_PASSWORD = votre_mot_de_passe_mysql
DB_NAME = campusguide
JWT_SECRET = votre_secret_jwt_aleatoire
FRONTEND_URL = https://votre-projet.vercel.app
```

## Étape 3 : Déployer

1. Cliquez sur **Deploy** dans Vercel
2. Attendez que le build se termine
3. Votre application sera disponible à une URL comme : `https://campusguide-xxxx.vercel.app`

## Étape 4 : Configurer la base de données

### Option A : PlanetScale (Recommandé pour Vercel)

1. Créez un compte sur https://planetscale.com
2. Créez une nouvelle base de données
3. Importez votre schéma de base de données
4. Copiez les credentials et ajoutez-les aux variables d'environnement Vercel

### Option B : Supabase

1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Allez dans Settings > Database
4. Copiez les credentials de connexion

## Étape 5 : Tester le déploiement

1. Visitez l'URL de votre application Vercel
2. Testez l'inscription et la connexion
3. Vérifiez que les fonctionnalités API fonctionnent

## Limitations importantes

⚠️ **Socket.IO ne fonctionne pas sur Vercel Serverless Functions**
- Les fonctionnalités en temps réel (chat, notifications en temps réel) ne fonctionneront pas
- Pour utiliser Socket.IO, vous devez déployer le backend sur un serveur dédié (Railway, Render, Heroku)

## Alternative : Déploiement séparé

Si vous avez besoin de Socket.IO, déployez séparément :

1. **Frontend sur Vercel** (comme décrit ci-dessus)
2. **Backend sur Railway/Render** :
   - Poussez le backend sur un repository séparé
   - Déployez sur https://railway.app ou https://render.com
   - Mettez à jour `VITE_API_URL` avec l'URL du backend

## Commandes utiles

```bash
# Build local pour tester
cd frontend
npm run build

# Tester localement avec les variables d'environnement
npm run preview
```

## Support

- Documentation Vercel : https://vercel.com/docs
- Documentation PlanetScale : https://planetscale.com/docs
