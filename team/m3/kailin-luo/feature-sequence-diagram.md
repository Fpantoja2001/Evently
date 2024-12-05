### Feature: Footer
- **Description**: A footnote at the bottom of every page to provide supplementary information about the group and the members that contributed to the website.

```mermaid
graph TD;
  A[Homepage]-->B[Footer]
  C[About]-->B[Footer]
```

### Feature: Review page
- **Description**: A review page where users can leave a review for an event by pressing a button to access the review page. The review page allows users to rate the event from 1 to 5 and write a comment about the event.

```mermaid
graph TD;
  A[Event]-->B[Review]

  B[Review]-->C[Enter Event name]
  B[Review]-->D[Enter rating 1-5]
  B[Review]-->E[Write a comment about the event]
  B[Review]-->F[Submit]
```
