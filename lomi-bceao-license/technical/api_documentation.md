# Documentation API LOMI AFRICA

## 1. Introduction

Cette documentation détaille l'architecture technique et les interfaces de programmation (API) de la plateforme LOMI AFRICA, conformément aux exigences de la BCEAO en matière de services de paiement.

## 2. Architecture Générale

Notre architecture API repose sur une conception RESTful moderne, utilisant les standards HTTPS/TLS 1.3 pour toutes les communications. L'ensemble des échanges est effectué au format JSON, avec une authentification basée sur des tokens JWT et une validation stricte des requêtes.

## 3. Authentification et Sécurité

### Processus d'Authentification
L'authentification utilise le protocole OAuth 2.0 avec support du PKCE (Proof Key for Code Exchange) pour une sécurité renforcée. Chaque requête nécessite un token Bearer JWT valide dans l'en-tête Authorization.

### Gestion des Clés API
Les clés API sont générées en paires (publique/privée) avec une rotation automatique tous les 90 jours. La clé privée doit être conservée de manière sécurisée et n'est jamais transmise en clair.

## 4. Points d'Entrée API

### Paiements
POST /api/v1/payments
Description : Initie une nouvelle transaction de paiement
Paramètres requis :
- amount : Montant de la transaction
- currency : Devise (XOF)
- description : Description de la transaction
- customer : Informations du client
- callback_url : URL de notification

### Transactions
GET /api/v1/transactions
Description : Récupère l'historique des transactions
Paramètres optionnels :
- start_date : Date de début
- end_date : Date de fin
- status : État des transactions
- page : Numéro de page
- limit : Nombre d'éléments par page

### Remboursements
POST /api/v1/refunds
Description : Initie un remboursement
Paramètres requis :
- transaction_id : Identifiant de la transaction
- amount : Montant à rembourser
- reason : Motif du remboursement

## 5. Gestion des Webhooks

### Configuration
Les webhooks permettent la notification en temps réel des événements de la plateforme. Chaque notification est signée numériquement pour garantir son authenticité.

### Événements Supportés
- payment.success : Paiement réussi
- payment.failed : Échec du paiement
- refund.processed : Remboursement effectué
- dispute.created : Litige créé
- transfer.completed : Transfert terminé

## 6. Gestion des Erreurs

### Format Standard
Toutes les erreurs suivent un format JSON standardisé :
{
    "error": {
        "code": "ERROR_CODE",
        "message": "Description détaillée",
        "reference": "Identifiant unique"
    }
}

### Codes d'Erreur
- 400 : Requête invalide
- 401 : Authentification requise
- 403 : Accès non autorisé
- 404 : Ressource non trouvée
- 429 : Limite de taux dépassée
- 500 : Erreur serveur

## 7. Limites et Quotas

### Limites de Taux
- API Production : 100 requêtes/seconde
- API Sandbox : 20 requêtes/seconde
- Webhooks : 50 événements/seconde

### Timeouts
- Requêtes synchrones : 30 secondes
- Webhooks : 10 secondes
- Connexions persistantes : 5 minutes

## 8. Environnements

### Production
- URL : https://api.lomi.africa
- Documentation : https://docs.lomi.africa
- Console : https://console.lomi.africa

### Sandbox
- URL : https://sandbox-api.lomi.africa
- Documentation : https://sandbox-docs.lomi.africa
- Console : https://sandbox-console.lomi.africa

## 9. Support et Maintenance

### Support Technique
- Email : support@lomi.africa
- Téléphone : [Numéro]
- Temps de réponse : < 2 heures en production

### Maintenance
Les maintenances planifiées sont notifiées 72 heures à l'avance via email et le tableau de bord.
