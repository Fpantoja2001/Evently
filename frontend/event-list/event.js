// const startTime = performance.now();

// const eventWrapper = document.getElementById('eventlist_wrapper');

// // Fetch the event data from the server
// fetch('http://localhost:3000/api/event/getAll')
//     .then((response) => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then((events) => {
//         // Ensure events is an array, fallback to empty array if not available
//         const eventData = events || [];

//         const title_UE = document.createElement('div')
//         title_UE.className = 'title'
//         title_UE.textContent = "Your Events"
//         const userEvents = document.createElement('div')
//         userEvents.className = `eventColumns`
//         userEvents.appendChild(title_UE)

//         const title_PE = document.createElement('div')
//         title_PE.className = 'title'
//         title_PE.textContent = "Public Events"
//         const publicEvents = document.createElement('div')
//         publicEvents.className = `eventColumns`
//         publicEvents.appendChild(title_PE)

//         eventData.forEach((i) => {
//             console.log(i)
//             const newEvent = document.createElement('div');
//             const a = document.createElement('a');
//             a.href = `../event-details/index.html?eventid=${i.eventid}`;
//             a.appendChild(newEvent);

//             a.className = 'column is-one-fifth bordered-column';
//             a.id = 'card'
//             const imageClass = document.createElement('div');
//             imageClass.className = 'event_image image is-2by1';
//             const nameClass = document.createElement('div');
//             nameClass.className = 'event_name';

//             const eventName = document.createTextNode(i.eventName);
//             nameClass.appendChild(eventName);

//             const eventDate = document.createTextNode(new Date(i.eventDate).toLocaleDateString());
//             nameClass.appendChild(eventDate);

//             const eventImg = document.createElement('img');
//             eventImg.className = 'event_image';
//             eventImg.src = '../event/image.jpg';
//             imageClass.appendChild(eventImg);

//             newEvent.appendChild(imageClass);
//             newEvent.appendChild(nameClass);

//             // Check if events on dash belong to logged in user
//             const currentUser = JSON.parse(localStorage.getItem("auth")).userId;

//             if (i.eventCreator === currentUser){
//                 userEvents.append(a)
//             } else {
//                 publicEvents.append(a)
//             }
            
//         });

//         if(userEvents.childElementCount > 1) {
//             eventWrapper.append(userEvents)
//         }

//         if(publicEvents.childElementCount > 1){
//             eventWrapper.append(publicEvents)
//         }
        
        

//         // Extract unique categories from the event data
//         //const categories = [...new Set(eventData.map((event) => event.eventCategory))];

//         // categories.forEach((e) => {
//         //     // Make the div for the category
//         //     const cat = document.createElement('div');
//         //     cat.className = `category`;

//         //     const cat_top = document.createElement('div');
//         //     cat_top.className = "column_heading";
//         //     const catText = document.createTextNode(e);

//         //     const button_all = document.createElement('button');
//         //     button_all.className = 'button_all';
//         //     button_all.appendChild(document.createTextNode("See All"));

//         //     cat_top.appendChild(catText);
//         //     cat_top.appendChild(button_all);

//         //     let button_l, button_r;
//         //     const eventsInCategory = eventData.filter((i) => i.eventCategory === e);
//         //     if (eventsInCategory.length >= 5) {
//         //         button_l = document.createElement('button');
//         //         button_l.className = 'button_l';
//         //         button_l.appendChild(document.createTextNode("< Left"));

//         //         button_r = document.createElement('button');
//         //         button_r.className = 'button_r';
//         //         button_r.appendChild(document.createTextNode("Right >"));

//         //         cat_top.appendChild(button_l);
//         //         cat_top.appendChild(button_r);
//         //     }

//         //     const column = document.createElement('scroll');
//         //     column.className = 'category_scroll';
//         //     column.setAttribute("id", "category_scroll");

//         //     const columnscroll = document.createElement('div');
//         //     columnscroll.className = 'columns scrollable_column';

//         //     // Append the events to their corresponding category
//         //     eventsInCategory.forEach((i) => {
//         //         const newevent = document.createElement('div');
//         //         const a = document.createElement('a');
//         //         a.href = `../event-details/index.html?eventid=${i.eventid}`;
//         //         a.appendChild(newevent);

//         //         a.className = 'column is-one-fifth bordered-column';

//         //         const imgeClass = document.createElement('div');
//         //         imgeClass.className = 'event_image image is-2by1';
//         //         const nameClass = document.createElement('div');
//         //         nameClass.className = 'event_name';

//         //         const eventName = document.createTextNode(i.eventName);
//         //         nameClass.appendChild(eventName);

//         //         const eventDate = document.createTextNode(new Date(i.eventDate).toLocaleDateString());
//         //         nameClass.appendChild(eventDate);

//         //         const eventImg = document.createElement('img');
//         //         eventImg.className = 'event_image';
//         //         eventImg.src = '../event/image.jpg';
//         //         imgeClass.appendChild(eventImg);

//         //         newevent.appendChild(imgeClass);
//         //         newevent.appendChild(nameClass);
//         //         columnscroll.appendChild(a);
//         //     });

//         //     column.appendChild(columnscroll);
//         //     cat.appendChild(cat_top);
//         //     cat.appendChild(column);
//         //     eventWrapper.appendChild(cat);
//         //});

//         // Add scroll functionality
//         // document.querySelectorAll('.scrollable_column').forEach((scrollContainer) => {
//         //     scrollContainer.addEventListener('wheel', (event) => {
//         //         event.preventDefault(); // Prevents scrolling vertically
//         //         scrollContainer.scrollBy({
//         //             left: event.deltaY * 4, // Adjust the multiplier to control scroll speed
//         //             behavior: 'smooth',    // Enables smooth scrolling
//         //         });
//         //     });
//         // });

//         // document.querySelectorAll('.category').forEach((category) => {
//         //     const scrollContainer = category.querySelector('.scrollable_column');
//         //     const scrollLeftButton = category.querySelector('.button_l');
//         //     const scrollRightButton = category.querySelector('.button_r');

//         //     // Function to scroll left
//         //     if (scrollLeftButton) {
//         //         scrollLeftButton.addEventListener('click', () => {
//         //             scrollContainer.scrollBy({
//         //                 left: -400, // Adjust this value to control scroll amount
//         //                 behavior: 'smooth',
//         //             });
//         //         });
//         //     }
//         //     // Function to scroll right
//         //     if (scrollRightButton) {
//         //         scrollRightButton.addEventListener('click', () => {
//         //             scrollContainer.scrollBy({
//         //                 left: 400, // Adjust this value to control scroll amount
//         //                 behavior: 'smooth',
//         //             });
//         //         });
//         //     }
//         // });
//     })
//     .catch((error) => {
//         console.error('Error fetching events:', error);
//     });

// // Calculate the time it takes for this script to run
// const endTime = performance.now();
// const timeDiff = endTime - startTime;
// console.log(`Time taken: ${timeDiff} ms`);

const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="../event-list/event.css">
    
    <div class= "eventlist_wrapper" id="eventlist_wrapper"></div>
`;

export class eventListComponent extends HTMLElement {
    // Initializing Component
    constructor() {
        super();
        const shadow =  this.attachShadow({mode:"open"})
        shadow.append(template.content.cloneNode(true))
        this.component = document.getElementById("event-list-component")
    }

    async connectedCallback() {
        // Getting Dom Elements to Append to Dynamically
        const shadowRoot = this.component.shadowRoot
        const event_list_component = shadowRoot.getElementById('eventlist_wrapper')

        // check if a user is logged in, if not reroute (TBA to nav later on)
        // solves issue of user staying logged in due to localstorage not syncing with DB
        const user = JSON.parse(localStorage.getItem("auth"))
        
        try {
            if (user.userId === '' && (user.isAuth === null || user.isAuth === false)) {
                throw new Error("User not logged in.")

            } else {
                const userCheck  = await fetch(`http://localhost:3000/api/user/${user.userId}`);
                
                if(!userCheck.ok){
                    throw new Error(`User does not exist in DB.`);
                } 
            }   
        } catch (e) {
            console.log(`Rerouting to login..${e}`)
            window.location.href = '../login/index.html'
        }

        // Fetch the event data from the server
        fetch('http://localhost:3000/api/event/getAll')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((events) => {
                // Ensure events is an array, fallback to empty array if not available
                const eventData = events || [];

                const title_UE = document.createElement('div')
                title_UE.className = 'title'
                title_UE.textContent = "Your Events"
                const userEvents = document.createElement('div')
                userEvents.className = `eventColumns`
                userEvents.appendChild(title_UE)

                const title_PE = document.createElement('div')
                title_PE.className = 'title'
                title_PE.textContent = "Public Events"
                const publicEvents = document.createElement('div')
                publicEvents.className = `eventColumns`
                publicEvents.appendChild(title_PE)

                eventData.forEach((i) => {
                    // console.log(i)
                    const newEvent = document.createElement('div');
                    const a = document.createElement('a');
                    a.href = `../event-details/index.html?eventid=${i.eventid}`;
                    a.appendChild(newEvent);

                    a.className = 'column is-one-fifth bordered-column';
                    a.id = 'card'
                    const imageClass = document.createElement('div');
                    imageClass.className = 'event_image image is-2by1';
                    const nameClass = document.createElement('div');
                    nameClass.className = 'event_name';

                    const eventName = document.createTextNode(i.eventName);
                    nameClass.appendChild(eventName);

                    const eventDate = document.createTextNode(new Date(i.eventDate).toLocaleDateString());
                    nameClass.appendChild(eventDate);

                    const eventImg = document.createElement('img');
                    eventImg.className = 'event_image';
                    eventImg.src = '../event-list/image.jpg';
                    imageClass.appendChild(eventImg);

                    newEvent.appendChild(imageClass);
                    newEvent.appendChild(nameClass);

                    // Check if events on dash belong to logged in user
                    const currentUser = JSON.parse(localStorage.getItem("auth")).userId;

                    if (i.eventCreator === currentUser){
                        userEvents.append(a)
                    } else {
                        publicEvents.append(a)
                    }
                    
                });

                if(userEvents.childElementCount > 1) {
                    event_list_component.append(userEvents)
                }

                if(publicEvents.childElementCount > 1){
                    event_list_component.append(publicEvents)
                }
            });
        
    }

    disconnectedCallback(){
        console.log("Event List Component disconnected")
    }

}

customElements.define("event-list-component", eventListComponent);