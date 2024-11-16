### Feature: Navigation Bar:
- **Description**: A navigation tab above the page that allow users to navigate between pages (homepage, create events, and profiles).

```mermaid
graph TD;
  Homepage-->Profile
  Homepage-->Create-Event
```

### Feature: Display Event
- **Description**: A section of the homepage that displays the lists of events separated by categories.

```mermaid
graph TD;
  Homepage-->View-events-by-category
  View-events-by-category-->Clicking-on-event
  Clicking-on-event-->Event-description-page
```
