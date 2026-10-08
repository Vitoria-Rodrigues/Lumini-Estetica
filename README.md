# Lumini Estética

> [!NOTE]
> **Project Creator:** Vitória Rodrigues Ferreira
> **Tech Stack:** React.js, TypeScript, Supabase (PostgreSQL)

This repository contains the complete management system designed for aesthetic clinics.
The platform centralizes all business-critical information in a single digital environment,
optimizing customer service, internal organization, and operational efficiency.

## Core Features and Roles

The platform centralizes all critical business information, facilitating control and
decision-making.

### Managed Entities

- Client
- Employee
- Procedure
- Consultation

### Roles and Permissions

- **Admin:** Full access to all system functions.
- **Attendant:** Full access to Clients, read access to procedures, create and read access for
  consultations, update and read access for the calendar agenda.
- **Specialist:** Read access to procedures, read access to Clients, read access to the calendar
  agenda, and read and confirm access for consultations.

## Functional Requirements (FR)

- **FR01 - Client Registration:** The system must allow creating, reading, updating, and deleting
  (CRUD) client records containing Name, CPF, Date of Birth, Observations, and Phone.
- **FR02 - Employee Registration:** The system must allow CRUD operations for employees with Name,
  CPF, Phone, Role, and Specialty.
- **FR03 - Procedure Registration:** The system must allow CRUD operations for procedures with
  Name, Description, Value, and Duration.
- **FR04 - Category Management:** The system must allow classifying procedures into the categories
  "Facial" or "Corporal".
- **FR05 - Appointment Scheduling:** The system must allow creating and viewing consultations,
  linking a Client, Employee, and Procedure to a specific Date/Time.
- **FR06 - Observation Records:** The system must allow the employee to insert observations about
  the patient before or after the consultation.
- **FR07 - Agenda Status Control:** The system must allow updating the status of a consultation
  (e.g., scheduled, performed, canceled).
- **FR08 - Financial Records:** The system must store transaction details (value, payment method,
  and status).
- **FR09 - Profile Control (RBAC):** The system must restrict actions based on the logged-in
  profile (Admin, Attendant, or Specialist), according to the defined permissions matrix.

## Non-Functional Requirements (NFR)

- **NFR01 - Data Protection:** The system must encrypt sensitive data (such as CPF).
- **NFR02 - Authentication:** System access must be protected by a unique login and password for
  each user.
- **NFR03 - Centralized Interface:** Following the system's core objective, the interface must be
  intuitive, centralizing all information in a single digital environment to facilitate
  decision-making.
- **NFR04 - Referential Integrity:** The system must not allow the deletion of a "Procedure" or
  "Client" that has a history of linked consultations (it must apply logical deletion/archiving
  instead).

## Workspace Structure

- **[.agents/](./.agents/)**: AI agent skills, router contexts, and execution plans.
- **[app/](./app/)**: The main application workspace containing the frontend and integrations.
- **[docs/](./docs/)**: The unified Docusaurus documentation portal and technical guides.
- **[supabase/](./supabase/)**: The independent backend infrastructure with database schemas and edge functions.
