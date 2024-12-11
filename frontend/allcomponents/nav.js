const body = document.body;

const navbar = document.getElementById('navbar');
const nav = document.createElement('ul');
/* nav.id = 'navbar'; */

Object.assign(nav.style, {
  display: 'flex',
  justifyContent: 'space-around',
  listStyle: 'none',
  backgroundColor: '#fbb86d',
  padding: '10px',
  margin: '0',
  borderRadius: '8px',
});

function scrollToEvent(element) {
  element.scrollIntoView({ behavior: 'smooth' });
}

// Simulating login state; replace this with actual login check logic
const isLoggedIn = () => {
  // Example: Check if a user is logged in via localStorage or a cookie
  return localStorage.getItem('loggedIn') === 'true'; 
};

const links = [
  { href: '../index.html', text: 'Event TBD' },
  { href: '../index.html', text: 'Events', onclick: scrollToEvent },
  { href: '../about/index.html', text: 'Profile' },
  { href: '../eventMaker/index.html', text: 'Create Event' },
  { href: '../login/index.html', text: 'Login/Sign Up', hideWhenLoggedIn: true },
];

//window.onload = function() {

links.forEach(link => {
  // Skip links that should be hidden when logged in
  if (link.hideWhenLoggedIn && isLoggedIn()) {
    return;
  }

  const li = document.createElement('li'); 
  const a = document.createElement('a');

  a.href = link.href;
  a.textContent = link.text;

  // When "Events" is clicked, scroll to the event section in the homepage
  const eventlist_wrapper = document.getElementById('eventlist_wrapper');
  if (link.onclick) {
    a.onclick = function() {
      if (eventlist_wrapper) {
        link.onclick(document.getElementById('eventlist_wrapper'));
        return false;
      }
      return true;
    };
  }

  Object.assign(a.style, {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'color 0.3s, transform 0.2s',
  });

  a.addEventListener('mouseover', () => {
    a.style.color = '#fec89a';
    a.style.transform = 'scale(1.1)';
  });

  a.addEventListener('mouseout', () => {
    a.style.color = '#ffffff';
    a.style.transform = 'scale(1)';
  });

  li.appendChild(a);
  nav.appendChild(li);
});

navbar.appendChild(nav);

//}

// Example usage: Simulate login
localStorage.setItem('loggedIn', 'true'); // Uncomment to simulate a logged-in state
