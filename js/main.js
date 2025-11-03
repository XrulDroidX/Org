// ===== Hamburger Menu =====
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// ===== Smooth Scroll =====
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    navbar.classList.remove('active'); // Tutup menu di mobile
    document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});

// ===== Back-to-Top Button =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if(window.scrollY > 300){
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }

    // ===== Navbar Highlight Active Section =====
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`nav a[href="#${id}"]`);
        if(window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight){
            document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
            if(link) link.classList.add('active');
        }
    });
});
backToTop.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
});

// ===== Dark Mode Toggle =====
const darkToggle = document.getElementById('dark-toggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')){
        darkToggle.textContent = '☀️';
    } else {
        darkToggle.textContent = '🌙';
    }
});

// ===== Load Gallery JSON =====
fetch('js/gallery.json')
.then(res => res.json())
.then(data => {
    const galleryContainer = document.getElementById('gallery-container');
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <h3>${item.title}</h3>
        `;
        galleryContainer.appendChild(div);
    });
});

// ===== Load News JSON =====
fetch('js/news.json')
.then(res => res.json())
.then(data => {
    const newsContainer = document.getElementById('news-container');
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
        `;
        newsContainer.appendChild(div);
    });
});

// ===== Load Blog JSON =====
fetch('js/blog.json')
.then(res => res.json())
.then(data => {
    const blogContainer = document.getElementById('blog-container');
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <a href="${item.link}">Baca Selengkapnya</a>
        `;
        blogContainer.appendChild(div);
    });
});
