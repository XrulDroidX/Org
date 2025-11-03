// Hamburger menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Smooth scroll
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    navbar.classList.remove('active'); // tutup menu di mobile saat klik
    document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});

// Load Gallery JSON
fetch('js/gallery.json')
.then(res => res.json())
.then(data => {
    const galleryContainer = document.getElementById('gallery-container');
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<img src="${item.image}" alt="${item.title}"><h3>${item.title}</h3>`;
        galleryContainer.appendChild(div);
    });
});

// Load News JSON
fetch('js/news.json')
.then(res => res.json())
.then(data => {
    const newsContainer = document.getElementById('news-container');
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<img src="${item.image}" alt="${item.title}"><h3>${item.title}</h3><p>${item.summary}</p>`;
        newsContainer.appendChild(div);
    });
});
