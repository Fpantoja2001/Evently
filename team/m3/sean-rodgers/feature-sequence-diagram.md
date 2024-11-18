### Feature: Event Details
- **Description**: The event details page, which is accessed from clicking on specific events in the events tab. The event details page also includes the navigation bar and the footer which can access other parts of the website like the profile, sign up, and back to the events / homepage.
```mermaid
graph TD;
  A[Home Page] --> B[Events Page]
  B[Events Page] --> C[Clicking Event]
  C[Clicking Event] --> D[Event Details]
  D[Event Details] --> E[Navigation Bar]
  D[Event Details] --> H[Footer]
  E[Navigation Bar] --> A[Home Page]
  E[Navigation Bar] --> B[Events Page]
  E[Navigation Bar] --> F[Profile]
  E[Navigation Bar] --> G[Sign In/Up]

```