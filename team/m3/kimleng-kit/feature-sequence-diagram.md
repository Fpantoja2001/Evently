### Feature: Navigation Bar:
- **Description**: A navigation tab above the page that allow users to navigate between pages (homepage, events, profiles, event details, and login/sign up page).

```mermaid
graph TD;
  
  A[Homepage]-->A[Homepage]
  A[Homepage]-->B[Events]
  A[Homepage]-->C[Profile]
  A[Homepage]-->D[Login/Sign up]

  B[Events]-->A[Homepage]
  C[Profile]-->A[Homepage]
  D[Login/Sign up]-->A[Homepage]
  E[Event Details]-->A[Homepage]

  B[Events]-->C[Profile]
  B[Events]-->D[Login/Sign up]
  B[Events]-->E[Event details]

  C[Profile]-->B[Events]
  C[Profile]-->D[Login/Sign up]

  D[Login/Sign up]-->B[Events]
  D[Login/Sign up]-->C[Profile]

```

### Feature: Display Event
- **Description**: A section of the homepage that displays the lists of events separated by categories. Clicking on each event will lead to the event description page.

```mermaid
graph TD;
  A[Homepage]-->B[Events]
  B[Events]-->C[View events by category]
  C[View events by category]-->D[Clicking on event]
  D[Clicking on event]-->E[Event description page]
```

### Feature: Profile Page
- **Description**: A page that displays the user's information such as profile picture, name, phone number, email, age, and biography.

```mermaid
graph TD;
  A[Homepage Navigation Bar]-->B[Profile]
  B[Profile]-->C[Display user data]
```
