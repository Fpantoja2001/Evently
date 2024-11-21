# Data Overview

### 1. **User Profile**
- **Description**: This data type captures key information about the users of the application, such as account details and personal preferences.
- Attributes: 
    - `Username` (String): Unique identifier for the user’s account.
    - `Password` (String): Credential for account security.
    - `Hobbies` (String): Describes the type of exercise or activity the user is interested in.
    - `Location` (String): The geographical area where the user prefers to participate in events.
- **Data Sources**: User-Input Data

### 2. **Individual User**
- **Description**: Contains personal event preferences and social connections with other users.
- Attributes: 
    - **Interests Event Lists**
        - `Dates` (String): The date of the event the user is interested in.
        - `Locations` (String): The location of the interested event.
- **Data Sources**: User-Input Data

### 3 **Events**
- **Description**: Stores details about events such as dates, locations, participants, and any restrictions or fees involved.
- Attributes: 
    - `Past Events` (Event): Stores data on events that have already occurred.
    - `People Joining (Population)` (Integer): Number of users participating in the event.
    - `Dates` (String): Date of the event.
    - `Locations` (String): Venue or area where the event will take place.
    - `Plan` (String): Description of the activities or agenda for the event.
    - `Restrictions` (String): Information about any restrictions (age limits, fitness requirements, etc.).
    - `Fee` (Integer): Cost to participate in the event, if any.
- **Data Sources**: User-Input Data, Third-Party APIs

---

## Relationships Between Data

- **User Profile & Individual User**: The profile data (e.g., hobbies and location) informs the individual user's event preferences and recommendations.
- **Individual User & Events**: The list of interested events is linked with specific event details, such as dates and locations from the events data.
---

## Data Sources

- **User-Input Data**: Data related to user profiles, interests, and personal event preferences will be collected through user inputs.
- **Third-Party APIs**: Location-based data will rely on third-party mapping services (such as Google Maps API or similar tools) to visualize user interest and event locations on a map.
- **System-Generated Data**: The application will generate other analytics based on user interaction data and event statistics.
