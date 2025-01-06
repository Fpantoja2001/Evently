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

// Check login state using userId in localStorage
const isLoggedIn = () => {
  try {
    const session = JSON.parse(localStorage.getItem("auth"))
    return session.isAuth;
  } catch (e){
    return false;
  }
};

const links = [
  { href: '../index.html', text: 'Event TBD' },
  { href: '../index.html', text: 'Events', onclick: scrollToEvent },
  { href: '../create-event/index.html', text: 'Create Event' },
  { href: '../profile/index.html', text: 'Profile', showWhenLoggedIn: true },
  {
    href: '#',
    text: 'Login/Sign Up',
    showWhenLoggedOut: true,
    onClick: function () {
      // Redirect to login page
      window.location.href = '../login/index.html';
    },
  },
  // {
  //   href: '#',
  //   text: 'Sign Out',
  //   showWhenLoggedIn: true,
  //   onClick: async function () {
  //     // Sign out logic

  //     const logoutResponse = await fetch('http://localhost:3000/api/user/logout')
  //     console.log(logoutResponse)
  //     localStorage.removeItem('auth');
  //     location.reload(); // Reload to reflect changes
  //     window.location.href = '../login/index.html';
  //   },
  // },
];

// Dynamically add links based on login state
links.forEach(link => {
  // Skip links that shouldn't be displayed based on login state
  if (link.showWhenLoggedIn && !isLoggedIn()) {
    window.location.href = '../login/index.html';
    return;
  }
  if (link.showWhenLoggedOut && isLoggedIn()) {
    return;
  }

  const li = document.createElement('li'); 
  const a = document.createElement('a');

  a.href = link.href;
  a.textContent = link.text;

  // Handle custom onclick events
  if (link.onClick) {
    a.onclick = link.onClick;
  }

  // When "Events" is clicked, scroll to the event section in the homepage
  const eventlist_wrapper = document.getElementById('eventlist_wrapper');
  if (link.onclick) {
    a.onclick = function () {
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

// navbar.appendChild(nav);