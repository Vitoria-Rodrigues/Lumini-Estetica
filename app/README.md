# Lumini Estética - App Workspace

> [!NOTE]
> **Project Creator:** Vitória Rodrigues Ferreira
> **Tech Stack:** React.js, TypeScript, Supabase (PostgreSQL)

This workspace contains the frontend application and backend integrations for the Lumini Estética management system. It provides the centralized, intuitive interface required for aesthetic clinic administration, as outlined in the core business rules.

## Key Modules

Based on the core requirements outlined in the root [README.md](../README.md), this application is structured around the following domains:

- **Authentication & RBAC:** Secure login restricting access across Admin, Attendant, and Specialist profiles.
- **Client & Employee Management:** CRUD interfaces ensuring data protection for sensitive information (e.g., CPF encryption).
- **Procedures Catalog:** Categorization of services into "Facial" and "Corporal" domains.
- **Scheduling & Agenda:** Status tracking (scheduled, performed, canceled) with referential integrity to prevent accidental deletion of linked records.
- **Financial Module:** Tracking transaction values, payment methods, and statuses.

## Development

*(Development scripts and commands will be documented here as the project evolves.)*
