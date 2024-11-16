const body = document.body;

const navbar = document.getElementById('navbar');
const nav = document.createElement('ul');
/* nav.id = 'navbar'; */

Object.assign(nav.style, {
  display: 'flex',
  justifyContent: 'space-around',
  listStyle: 'none',
  backgroundColor: '#e76f51',
  padding: '10px',
  margin: '0',
  borderRadius: '8px',
});

function scrollToEvent(element) {
  element.scrollIntoView({ behavior: 'smooth' });
}

const links = [
  { href: '../home/index.html', text: 'Event TBD' },
  { href: '../event/index.html', text: 'Events', onclick: scrollToEvent },
  { href: '../about/index.html', text: 'Profile' }
];

//window.onload = function() {

links.forEach(link => {
  const li = document.createElement('li'); 
  const a = document.createElement('a');

  a.href = link.href;
  a.textContent = link.text;

  // when Event is clicked, scroll to the event section in Homepage
  if (link.onclick) {
    a.onclick = function() {
      link.onclick(document.getElementById('eventlist_wrapper'));
      return false;
    };
    a.href = '#';
  }

  Object.assign(a.style, {
    color: '#fec89a',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'color 0.3s, transform 0.2s',
  });

  a.addEventListener('mouseover', () => {
    a.style.color = '#FDFEFE';
    a.style.transform = 'scale(1.1)';
  });

  a.addEventListener('mouseout', () => {
    a.style.color = '#fec89a';
    a.style.transform = 'scale(1)';
  });

  li.appendChild(a);
  nav.appendChild(li);
});

navbar.appendChild(nav);

//}