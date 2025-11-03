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

// Lightbox gallery
const galleryImages = document.querySelectorAll('.gallery-container img');
galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.position='fixed';
    lightbox.style.top=0;
    lightbox.style.left=0;
    lightbox.style.width='100%';
    lightbox.style.height='100%';
    lightbox.style.background='rgba(0,0,0,0.8)';
    lightbox.style.display='flex';
    lightbox.style.justifyContent='center';
    lightbox.style.alignItems='center';
    lightbox.style.zIndex='1000';
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.style.maxWidth='90%';
    imgEl.style.maxHeight='90%';
    imgEl.style.borderRadius='10px';
    lightbox.appendChild(imgEl);
    lightbox.addEventListener('click', ()=> lightbox.remove());
    document.body.appendChild(lightbox);
  });
});

// Load berita
const news = [
  {title:"Workshop Kreativitas Pemuda", date:"3 Nov 2025", link:"news/berita1.html"},
  {title:"Bakti Sosial Desa XYZ", date:"1 Nov 2025", link:"news/berita2.html"}
];
const newsContainer = document.getElementById('news-container');
news.forEach(n=>{
  const div = document.createElement('div');
  div.innerHTML = `<a href="${n.link}"><h3>${n.title}</h3></a><p>${n.date}</p>`;
  newsContainer.appendChild(div);
});
