// Fade-in saat scroll
const sections = document.querySelectorAll('section, header');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('fade-in');
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.2});
sections.forEach(sec => observer.observe(sec));

// Smooth scroll untuk menu
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});

// Load berita dari JSON
fetch('js/news.json')
.then(res => res.json())
.then(news => {
  const newsContainer = document.getElementById('news-container');
  news.forEach(n => {
    const div = document.createElement('div');
    div.innerHTML = `<a href="${n.link}"><h3>${n.title}</h3></a><p>${n.date}</p>`;
    newsContainer.appendChild(div);
  });
});

// Load galeri dari JSON
fetch('js/gallery.json')
.then(res => res.json())
.then(gallery => {
  const galleryContainer = document.querySelector('.gallery-container');
  gallery.forEach(img=>{
    const el = document.createElement('img');
    el.src = img.src;
    el.alt = img.alt;
    galleryContainer.appendChild(el);

    // Lightbox
    el.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.id='lightbox';
      Object.assign(lightbox.style,{
        position:'fixed', top:0, left:0, width:'100%', height:'100%',
        background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center',
        alignItems:'center', zIndex:'1000'
      });
      const imgEl = document.createElement('img');
      imgEl.src=el.src;
      imgEl.style.maxWidth='90%';
      imgEl.style.maxHeight='90%';
      imgEl.style.borderRadius='10px';
      lightbox.appendChild(imgEl);
      lightbox.addEventListener('click', ()=>lightbox.remove());
      document.body.appendChild(lightbox);
    });
  });
});

// Load blog/articles
const blogArticles = [
  {title:"Tips Kepemudaan Kreatif", link:"blog/article1.html", date:"1 Nov 2025"},
  {title:"Laporan Kegiatan XYZ", link:"blog/article2.html", date:"28 Oct 2025"}
];
const blogContainer = document.getElementById('blog-container');
blogArticles.forEach(b=>{
  const div = document.createElement('div');
  div.innerHTML = `<a href="${b.link}"><h3>${b.title}</h3></a><p>${b.date}</p>`;
  blogContainer.appendChild(div);
});