# Backend API Development Guide

NestJS backend REST API.

## Core Architecture Patterns

### Repository Pattern
**ALL database queries MUST be encapsulated in repository files.**
Services should not write raw queries or interact with the ORM directly for data fetching.
- Use a base Repository class that implements common methods (`findOne`, `findAll`, `create`, `update`, `softDelete`).
- Inject the repository into the Service.
- Keep query logic separate from business logic.

### Service Pattern
Services contain business logic and orchestrate calls to repositories and other services.
**CRITICAL: Transaction Management with Supabase**
- Because we use Supabase and PostgREST, we cannot manage multi-step database transactions natively in the NestJS application layer across multiple HTTP calls.
- Therefore, any operation requiring atomicity (e.g., creating a customer and charging a card in the DB) MUST be encapsulated entirely within a single PostgreSQL RPC.
- Services must call a single Repository method for writes, which executes the single RPC. Do not orchestrate multiple mutating RPCs for the same transactional boundary from the Service.

### Background Tasks
- Always offload slow or side-effect operations (e.g., sending emails, generating reports) to background jobs (using BullMQ or similar).
- Do not block API responses on background tasks.

## Stripe Integration
*Note: Stripe is used for payment processing, but we abstract this away internally. Ensure that any Stripe API keys or configuration details remain strictly encapsulated and are NOT exposed in client-facing APIs, logs, or local dev scripts.*
