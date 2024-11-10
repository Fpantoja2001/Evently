//these are placeholders in place of the database, when we have the actual database setup, we can remove this
const category = ['category1', 'category2', 'category3', 'category4', 'category5'];
import data from './event.json' with { type: "json" };
const startTime = performance.now();


const eventWrapper = document.getElementById('eventlist_wrapper');

const events = data.events;

//algorithm below not efficient, imporve later after we finish frontend implementation 
category.forEach((e) => {

    // make the div for the category 
    const cat = document.createElement('div');
    cat.className = `category`; 


    const cat_top = document.createElement('div');
    cat_top.className = "column_heading"
    const catText = document.createTextNode(e);

    const button_all = document.createElement('button');
    button_all.className = 'button_all'; 
    button_all.appendChild(document.createTextNode("See All"))

    const button_r = document.createElement('button');
    button_r.className = 'button_r';  
    button_r.appendChild(document.createTextNode("R"))

    //append right arrow circle immage
    const button_l = document.createElement('button'); 
    button_l.className = 'button_l';
    button_l.appendChild(document.createTextNode("L"))
    //append left arrow circle image

    cat_top.appendChild(catText); 
    cat_top.appendChild(button_all);
    cat_top.appendChild(button_l);
    cat_top.appendChild(button_r);

    const column = document.createElement('scroll'); 
    column.className = 'category_scroll'
    column.setAttribute("id", "category_scroll"); 

    const columnscroll = document.createElement('div'); 
    columnscroll.className = 'columns scrollable_column'; 

    // append the events to their corresponding category 
    events.forEach((i) => {
        if(i.category === e){
            const newevent = document.createElement('div');
            newevent.className = 'column is-one-fifth bordered-column'; 
            const eventName = document.createTextNode(i.name); 
            newevent.appendChild(eventName); 
            
            columnscroll.appendChild(newevent);
        }
    })
    
    column.appendChild(columnscroll);
    cat.appendChild(cat_top);
    cat.appendChild(column); 
    eventWrapper.appendChild(cat);    
})

// scroll horizonaly for the scrollable column 
document.querySelectorAll('.scrollable_column').forEach((scrollContainer) => {
    scrollContainer.addEventListener('wheel', (event) => {
        event.preventDefault(); //prevents scrolling vertically
        scrollContainer.scrollBy({
            left: event.deltaY * 4,      // Adjust the multiplier to control scroll speed
            behavior: 'smooth'           // Enables smooth scrolling
        });
    });
});








//to calculate the time it takes for this script to run
const endTime = performance.now();
const timeDiff = endTime - startTime;
console.log(`Time taken: ${timeDiff} ms`);
