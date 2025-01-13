# Operational Procedures

## 1. Introduction

### 1.1 Objective
This document defines the operational procedures of lomi.africa. It covers all the business and technical processes necessary for the provision of our innovative payment and disbursement services, which aim to facilitate digital payments for merchants and businesses in francophone West Africa.

### 1.2 Scope
The procedures apply to daily operations, service management, customer support, and technical maintenance.

## 2. Payment Services

### 2.1 Merchant Payments
lomi.africa's payment processing is handled through a set of APIs and webhook handlers that integrate with various payment providers. The key components involved are:

- **Checkout API**: This API is responsible for initiating the checkout process. It creates a checkout session with the necessary payment details (amount, currency, success URL etc.) and passes the request to the appropriate payment provider module. The main APIs are:
  - `createCheckoutSession`: Creates a new checkout session and returns a session ID.
  - `confirmPayment`: Handles the payment confirmation flow, verifying the payment status with the provider.
  - `getCheckoutSession`: Retrieves the details of a checkout session by ID.

- **Payment Provider Modules** (`src/api/providers`): These modules encapsulate the integration with each supported payment provider (Visa, Mastercard, MTN, Orange Money, Wave). They handle the provider-specific API calls, authentication, and response parsing. The main functions in each module are:
  - `initiatePayment`: Sends a payment request to the provider's API with the necessary details.
  - `getPaymentStatus`: Checks the status of a payment with the provider.
  - `refundPayment`: Initiates a refund request for a previous payment.

- **Webhook Handlers**: Webhooks are used to receive real-time payment status updates from the providers. The webhook handler functions process these events and update the corresponding payment records in the system. Key webhook events handled are:
  - `paymentSucceeded`: Indicates a successful payment. Updates the payment status and notifies the merchant.
  - `paymentFailed`: Indicates a failed payment attempt. Updates the status and notifies the merchant.
  - `paymentRefunded`: Indicates a refunded payment. Updates the payment status and amount.

- **Control Portal** (`src/pages/portal`): The merchant portal provides a web interface for merchants to manage their payments. It includes pages for viewing transaction history, issuing refunds, and managing saved payment methods. These pages interact with the backend APIs to fetch and update payment data. Key pages are:
  - `Transactions page`: Displays a list of past transactions with filtering and search options.
  - `Payment Links page`: Merchants can create
  - `Reporting page`: M

The payment processing flow typically involves the following steps:

1. The merchant's customer initiates a checkout through the generated checkout sessiosn from a payment link or through the applicaiton of our merchants. 
2. The checkout APIs create a new session and pass the payment request to the relevant provider module.
3. The provider module makes the necessary API calls to process the payment with the chosen provider.
4. The payment provider sends status updates via webhooks, which are handled by our webhook functions to update the payment records.
5. The merchant can view and manage their customers payments through the portal pages, which interact with the backend APIs.

This architecture allows for a modular and extensible payment processing system that can easily integrate new providers and payment methods as needed.

Security is a top priority in handling sensitive payment data. All communication with the payment providers is done over secure HTTPS channels. Sensitive data like API keys and secrets are stored securely and never logged or exposed. PCI-DSS compliance is maintained throughout the payment flow.

Monitoring and error handling are implemented at multiple levels. Key payment events and errors are logged for traceability. Alerts are set up to notify the team of any critical issues or anomalies. Retry mechanisms and circuit breakers are used to handle temporary provider outages gracefully.

### 2.2 Mobile Money
Mobile money procedures cover operator connection, flow management, reconciliation, and technical support.

### 2.3 Bank Cards
Bank card procedures encompass the acquisition process, transaction management, data security, and PCI-DSS compliance.

## 3. Disbursement Services

### 3.1 Bank Transfers
Bank transfer procedures involve beneficiary validation, balance control, transfer execution, and confirmation.

### 3.2 Mobile Money Transfers
Mobile money transfer procedures include number verification, limit control, transfer sending, and notification.

## 4. Account Management

### 4.1 Account Creation
Account creation procedures include document verification, initial configuration, access attribution, and client training.

## 5. Customer Support

### 5.1 Level 1 Support
Level 1 support procedures include request reception, initial diagnosis, quick resolution, and escalation.

### 5.2 Level 2 Support
Level 2 support procedures cover technical analysis, investigation, complex resolution, and documentation.

### 5.3 Level 3 Support
Level 3 support procedures involve technical expertise, solution development, system correction, and corrective production deployments.

## 6. Technical Management

### 6.1 System Maintenance
System maintenance procedures include regular monitoring of system health, performance metrics, and error logs. Key maintenance tasks are:

- **Dependency Updates**: Regularly updating all dependencies (libraries, frameworks, tools) to their latest stable versions. This ensures we have the latest bug fixes, security patches, and performance improvements.
- **Database Maintenance**: Monitoring database performance, optimizing queries, and running regular backups. Cleaning up old data and archiving as needed to maintain optimal database size and speed.
- **Scaling and Load Balancing**: Monitoring system load and resource utilization. Dynamically scaling the infrastructure based on traffic patterns. Using load balancers to distribute traffic evenly across service instances.
- **Continuous Integration and Deployment**: Automating the build, test, and deployment process using CI/CD pipelines. Ensuring all code changes pass the required tests and checks before being deployed to production.

### 6.2 Security
Security is a critical aspect of the lomi.africa platform. Key security measures include:

- **Secure Coding Practices**: Following OWASP guidelines for secure coding. Regular code reviews and security audits to identify and fix potential vulnerabilities.
- **Authentication and Authorization**: Implementing secure user authentication using industry-standard protocols like OAuth2 and JWT. Fine-grained authorization controls to ensure users can only access the resources they are permitted to.
- **Data Encryption**: Encrypting all sensitive data both at rest and in transit. Using strong encryption algorithms and properly managing encryption keys.
- **Network Security**: Implementing firewalls, VPNs, and access controls to secure the network perimeter. Regular vulnerability scans and penetration testing to identify and fix any weaknesses.
- **Compliance**: Ensuring compliance with relevant security standards and regulations, such as PCI-DSS for handling payment data.

### 6.3 Infrastructure
lomi.africa's platform is built on a modern, scalable infrastructure using cloud-native technologies. Key components of the infrastructure are:

- **Microservices Architecture**: The system is designed as a set of small, loosely coupled services that can be developed, deployed, and scaled independently. This allows for greater flexibility, resilience, and maintainability.
- **Containerization**: All services are packaged as Docker containers, which provides a consistent and reproducible runtime environment. Containers enable efficient resource utilization and easy scaling.
- **Orchestration**: Kubernetes is used for container orchestration, automating the deployment, scaling, and management of the services. Kubernetes ensures high availability, self-healing, and efficient resource utilization.
- **Cloud Infrastructure**: The platform is hosted on AWS, leveraging various managed services like EC2, EKS, RDS, S3, and CloudFront. This provides scalability, reliability, and global reach.
- **Serverless Functions**: Certain tasks like webhook handling and background jobs are implemented as serverless functions using AWS Lambda. This allows for cost-effective and scalable execution without managing servers.

The technology stack is chosen to enable a robust, scalable, and maintainable platform:

- **TypeScript**: The primary language for both frontend and backend development. TypeScript adds static typing to JavaScript, catching potential bugs early and enabling better tooling and refactoring.
- **Node.js**: The runtime environment for the backend services, chosen for its performance, scalability, and rich ecosystem of libraries and tools.
- **React**: The frontend framework for building interactive and reusable UI components. React's component-based architecture and virtual DOM enable efficient rendering and updates.
- **Next.js**: The framework for server-side rendering and route management in the frontend. Next.js enables better performance, SEO, and developer experience.
- **Express**: The web application framework for building the backend APIs and handling HTTP requests and responses.
- **PostgreSQL**: The primary relational database for storing structured data. Chosen for its robustness, feature-richness, and strong consistency guarantees.
- **GraphQL**: The query language and runtime for building efficient and flexible APIs. GraphQL enables clients to request exactly the data they need, reducing over-fetching and under-fetching.

### 6.4 Monitoring and Observability
Comprehensive monitoring and observability are essential for ensuring the health and performance of the platform. Key practices include:

- **Metrics Collection**: Collecting and aggregating various metrics like CPU usage, memory usage, request rates, error rates, and latency. Using tools like Prometheus and Grafana for metrics storage and visualization.
- **Log Aggregation**: Centralized logging of all services using a log aggregation platform like ELK stack (Elasticsearch, Logstash, Kibana). Structured logging enables easy searching, filtering, and analysis of logs.
- **Distributed Tracing**: Implementing distributed tracing using tools like Jaeger or Zipkin to monitor and troubleshoot requests flowing through multiple services. Tracing helps identify performance bottlenecks and error sources.
- **Error Tracking**: Using error tracking tools like Sentry or Rollbar to capture and alert on exceptions and errors in real-time. This enables proactive identification and resolution of issues.
- **Alerting**: Setting up alerts based on key metrics and thresholds to proactively notify the team of any anomalies or issues. Using tools like PagerDuty or OpsGenie for alert management and escalation.
- **Status Page**: Maintaining a public status page to communicate the real-time status of the platform and any ongoing incidents or maintenance activities.

### 6.5 Documentation
Comprehensive and up-to-date documentation is crucial for the effective development, operation, and maintenance of the platform. Key documentation artifacts include:

- **Architecture Diagrams**: High-level diagrams depicting the overall system architecture, components, and their interactions. Regularly updated to reflect any changes in the architecture.
- **API Documentation**: Detailed documentation of all external and internal APIs, including request/response formats, authentication, error codes, and example usage. Tools like Swagger or Postman are used for API documentation.
- **Code Documentation**: Inline documentation of code modules, classes, functions, and key algorithms. Following a consistent documentation style and using tools like JSDoc for generating documentation.
- **Operational Runbooks**: Step-by-step guides for common operational tasks like deployment, scaling, backup, and recovery. Regularly updated and tested to ensure accuracy and effectiveness.
- **Incident Postmortems**: Detailed analysis and documentation of any major incidents, outages, or security breaches. Postmortems include root cause analysis, timeline of events, impact assessment, and action items for prevention and improvement.

By following these technical best practices and maintaining a robust and scalable infrastructure, lomi.africa ensures a reliable and performant platform for its users.

## 7. Incident Management

### 7.1 Detection
Incident detection procedures include active monitoring, system alerts, client reporting, and service verification.

### 7.2 Resolution
Incident resolution procedures cover impact analysis, immediate action, long-term solution, and communication.

### 7.3 Follow-up
Incident follow-up procedures involve documentation, cause analysis, preventive measures, and reporting.

## 8. Reconciliation

### 8.1 Daily Process
The daily reconciliation process includes data collection, transaction matching, discrepancy identification, and anomaly correction.

### 8.2 Reporting
Reconciliation reporting procedures cover daily reports, monthly analysis, quarterly audits, and archiving.

## 9. Business Continuity

### 9.1 Continuity Plan
The business continuity plan includes backup procedures, alternative sites, relay teams, and regular testing.

### 9.2 Activity Recovery
Activity recovery procedures involve plan activation, communication, service resumption, and return to normal.

## 10. Compliance and Control

### 10.1 Daily Checks
Daily control procedures include operation verification, compliance validation, anomaly detection, and reporting.

### 10.2 Internal Audit
Internal audit procedures cover procedure review, control testing, risk assessment, and recommendations.

At lomi.africa, we are committed to maintaining the highest standards of security and compliance in all our operations. We are in the process of obtaining a BCEAO License as a Payment Method Aggregator and are fully compliant with the African Union Convention on Cyber Security and Personal Data Protection.

Our value-added services focus on compliance management, including KYC/KYB verification, transaction monitoring, fraud detection, and regulatory reporting, ensuring secure and compliant transactions.

## Appendices

### A. Detailed Procedures
Detailed procedures include user guides, technical manuals, work instructions, and checklists.

### B. Forms
Forms cover account creation, support request, incident report, and quality control.

### C. Contacts
Contact information is provided for the support team, technical managers, partners, and suppliers.

### D. Technical Documentation
Technical documentation includes:
- System architecture diagrams
- Network topology 
- API specifications
- Security policies and procedures

Key architectural principles we follow:
- Modularity and extensibility
- Security by design
- Performance optimization 
- Scalability
- User-centric approach
- Continuous iteration and improvement
- Comprehensive monitoring and observability
- Automated testing and deployment
- Clear documentation and knowledge sharing 