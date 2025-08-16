# Dako - Le deal est bouclé 🛡️

**La façon la plus sûre d'acheter et vendre sur les réseaux sociaux**

Dako est une plateforme d'escrow (séquestre) spécialement conçue pour sécuriser les transactions commerciales sur WhatsApp et autres réseaux sociaux en Afrique de l'Ouest.

## 🌟 Fonctionnalités

### MVP (Phase 1)
- ✅ **Création de liens de transaction sécurisés**
- ✅ **Interface mobile-first optimisée pour WhatsApp**
- ✅ **Intégration avec lomi. pour les paiements**
- ✅ **Système d'escrow simple**
- ✅ **Notifications SMS automatiques**
- ✅ **Interface de résolution de litiges**

### Phase 2 (À venir)
- 🔄 **Bot WhatsApp intégré**
- 👤 **Système de comptes utilisateurs**
- ⭐ **Système de réputation et avis**
- 🔍 **Résolution de litiges structurée**

### Phase 3 (Futur)
- 🚚 **Intégration avec services de livraison**
- 🏪 **Vitrines vendeurs**
- 📊 **Analytics et données de marché**
- 🛡️ **Micro-assurance**

## 🏗️ Architecture Technique

### Stack
- **Frontend**: Next.js 15 + React + TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Base de données**: Supabase (PostgreSQL)
- **Paiements**: Intégration lomi. (MTN, Orange, Wave)
- **Notifications**: Infobip (SMS/WhatsApp)
- **Déploiement**: Vercel

### Structure du projet
```
apps/dako/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── deal/[dealId]/     # Pages de transaction
│   │   ├── globals.css        # Styles globaux
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants React
│   └── lib/                   # Utilitaires et configuration
├── supabase/                  # Configuration et migrations DB
├── public/                    # Assets statiques
└── ...
```

## 🚀 Installation et développement

### Prérequis
- Node.js 18+
- pnpm
- Compte Supabase
- Compte lomi. (pour les paiements)

### Configuration locale

1. **Cloner et installer**
```bash
cd apps/dako
pnpm install
```

2. **Configuration de l'environnement**
```bash
cp environment.example .env.local
# Remplir les variables d'environnement
```

3. **Base de données Supabase**
```bash
# Installer Supabase CLI
npm install -g @supabase/cli

# Démarrer Supabase localement
supabase start

# Appliquer les migrations
supabase db push
```

4. **Lancer le serveur de développement**
```bash
pnpm dev
```

L'application sera disponible sur `http://localhost:3000`

## 📱 Fonctionnement

### Pour les vendeurs
1. **Créer une transaction** : Description + prix + numéro acheteur
2. **Partager le lien** : Via WhatsApp/SMS à l'acheteur
3. **Recevoir notification** : Quand l'acheteur paie
4. **Livrer l'article** : Expédier en toute sécurité
5. **Recevoir paiement** : Une fois l'acheteur satisfait

### Pour les acheteurs
1. **Recevoir le lien** : Du vendeur via WhatsApp
2. **Vérifier les détails** : Article, prix, vendeur
3. **Payer en sécurité** : Via MTN/Orange/Wave
4. **Recevoir l'article** : Attendre la livraison
5. **Confirmer réception** : Libérer le paiement au vendeur

## 🛡️ Sécurité

- **Escrow système** : Les fonds sont bloqués jusqu'à confirmation
- **Chiffrement** : Toutes les communications sont sécurisées
- **Audit trail** : Toutes les actions sont enregistrées
- **Compliance** : Respect des normes BCEAO

## 🔗 Intégrations

### lomi. Payments
- Support multi-providers (MTN, Orange, Wave)
- Webhooks pour notifications temps réel
- Système de fees transparent

### Notifications
- SMS via Infobip
- WhatsApp Business API
- Templates personnalisés par statut

## 📊 Base de données

### Tables principales
- `deals` : Transactions escrow
- `users` : Profils utilisateurs et réputation
- `payment_sessions` : Sessions de paiement
- `disputes` : Gestion des litiges
- `notifications` : Log des notifications
- `audit_log` : Traçabilité des actions

### Fonctions SQL
- `create_deal()` : Création de transaction
- `mark_deal_as_funded()` : Confirmation paiement
- `release_funds()` : Libération des fonds
- `create_dispute()` : Ouverture de litige

## 🌍 Déploiement

### Vercel (Recommandé)
```bash
# Connecter à Vercel
npx vercel

# Configurer les variables d'environnement
# Déployer
npx vercel --prod
```

### Variables d'environnement de production
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOMI_API_KEY`
- `LOMI_MERCHANT_ID`
- `INFOBIP_API_KEY`

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests e2e
pnpm test:e2e

# Linting
pnpm lint
```

## 📖 Documentation API

### Endpoints principaux

#### `POST /api/deals`
Créer une nouvelle transaction
```json
{
  "itemDescription": "iPhone 13 Pro",
  "price": 450000,
  "currency": "XOF",
  "sellerPhone": "221771234567",
  "buyerPhone": "221779876543"
}
```

#### `GET /api/deals/[dealId]`
Récupérer les détails d'une transaction

#### `POST /api/deals/[dealId]/pay`
Initier le paiement

#### `POST /api/deals/[dealId]/release`
Libérer les fonds

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet fait partie de l'écosystème lomi. - Voir [LICENSE](../../../LICENSE)

## 🆘 Support

- **Email** : support@dako.ci
- **Documentation** : [docs.dako.ci](https://docs.dako.ci)
- **Discord** : [Communauté lomi.](https://discord.gg/lomi)

---

**Dako** - Sécurisons le commerce social en Afrique de l'Ouest 🌍
