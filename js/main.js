/* main.js - ZAMARIS final morph */
document.addEventListener('DOMContentLoaded', ()=>{

  /* basic refs */
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  const darkToggle = document.getElementById('dark-toggle');
  const contrastToggle = document.getElementById('contrast-toggle');
  const yearSpan = document.getElementById('year');
  if(yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* menu toggle */
  if(menuToggle){
    menuToggle.addEventListener('click', (e)=> {
      e.stopPropagation();
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', (!expanded).toString());
      navbar.classList.toggle('active');
    });
  }

  /* close menu on outside click */
  document.addEventListener('click', (e)=>{
    if(navbar && !navbar.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))){
      navbar.classList.remove('active');
      if(menuToggle) menuToggle.setAttribute('aria-expanded','false');
    }
  });

  /* shrink header */
  const onScroll = ()=> {
    if(window.scrollY > 60) header.classList.add('shrink'); else header.classList.remove('shrink');
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    revealOnScroll();
    animateCounters();
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* smooth scroll with offset */
  document.querySelectorAll('nav a, a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(!href || !href.startsWith('#')) return;
      e.preventDefault();
      navbar.classList.remove('active');
      menuToggle && menuToggle.setAttribute('aria-expanded','false');
      const offset = header.offsetHeight + 12;
      const target = document.querySelector(href);
      if(target){
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top, behavior:'smooth'});
      }
    });
  });

  /* back to top */
  backToTop && backToTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

  /* DARK MODE */
  const darkModePref = localStorage.getItem('darkMode');
  if(darkModePref === 'enabled' || (!darkModePref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
    if(darkToggle) darkToggle.textContent = '☀️';
  }
  darkToggle && darkToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-mode');
    const enabled = document.body.classList.contains('dark-mode');
    darkToggle.textContent = enabled ? '☀️' : '🌙';
    localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
  });

  /* contrast toggle */
  contrastToggle && contrastToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('high-contrast');
  });

  /* fetch JSON helper */
  const fetchJSON = async (url)=> {
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error('Fetch error');
      return await res.json();
    }catch(e){ console.warn('JSON load',url,e); return [];}
  };

  /* PARTNERS */
  const partnersContainer = document.getElementById('partners-container');
  if(partnersContainer && typeof partners !== 'undefined' && Array.isArray(partners)){
    partners.forEach(p => {
      const div = document.createElement('div');
      div.className = 'partner-card';
      div.innerHTML = `<a href="${p.link}" target="_blank"><img src="${p.logo}" alt="${p.name}" loading="lazy"></a>`;
      partnersContainer.appendChild(div);
    });
  }

  /* GALLERY */
  fetchJSON('js/gallery.json').then(data=>{
    const container = document.getElementById('gallery-container');
    if(!container) return;
    data.forEach(item=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.category = item.category || 'all';
      card.innerHTML = `<img src="${item.image}" alt="${item.title}" loading="lazy"><h3>${item.title}</h3>`;
      container.appendChild(card);
    });
    document.querySelectorAll('.filter-buttons button').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        document.querySelectorAll('.filter-buttons button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('#gallery-container .card').forEach(c=>{
          c.style.display = (f === 'all' || c.dataset.category === f) ? 'block' : 'none';
        });
      });
    });
  });

  /* NEWS */
  fetchJSON('js/news.json').then(data=>{
    const newsC = document.getElementById('news-container');
    if(!newsC) return;
    data.forEach(n=>{
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `<img src="${n.image}" alt="${n.title}" loading="lazy"><h3>${n.title}</h3><p>${n.summary}</p>`;
      newsC.appendChild(div);
    });
  });

  /* BLOG */
  fetchJSON('js/blog.json').then(data=>{
    const blogC = document.getElementById('blog-container');
    if(!blogC) return;
    data.forEach(b=>{
      const d = document.createElement('div'); d.className='card';
      d.innerHTML = `<h3>${b.title}</h3><p>${b.summary}</p><a href="${b.link}">Baca Selengkapnya</a>`;
      blogC.appendChild(d);
    });
  });

  /* EVENTS */
  const events = [
    {id:1,title:'Bakti Sosial Labuhanhaji',date:'2025-11-20',place:'Labuhanhaji',desc:'Distribusi bantuan & pengobatan gratis'},
    {id:2,title:'Workshop Kreatif',date:'2025-12-08',place:'Aula Kecamatan',desc:'Pelatihan desain & konten kreatif'}
  ];
  const eventList = document.getElementById('event-list');
  const nextTitle = document.getElementById('next-event-title');
  const nextDesc = document.getElementById('next-event-desc');
  const countdownEl = document.getElementById('countdown');
  if(eventList){
    events.forEach(ev=>{
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `<h4>${ev.title}</h4><small>${ev.date} • ${ev.place}</small><p>${ev.desc}</p>`;
      eventList.appendChild(el);
    });
    const now = new Date();
    const next = events.find(e=> new Date(e.date) > now) || events[0];
    if(next){
      nextTitle.textContent = next.title;
      nextDesc.textContent = `${next.date} • ${next.place}`;
      startCountdown(next.date, countdownEl);
    }
  }
  function startCountdown(dateStr, container){
    const target = new Date(dateStr + 'T00:00:00');
    const upd = ()=> {
      const diff = target - new Date();
      if(diff<=0){ container.textContent = 'Event sedang berlangsung atau telah selesai'; clearInterval(timer); return; }
      const d = Math.floor(diff/(1000*60*60*24));
      const h = Math.floor((diff/(1000*60*60))%24);
      const m = Math.floor((diff/(1000*60))%60);
      const s = Math.floor((diff/1000)%60);
      container.textContent = `${d}d ${h}h ${m}m ${s}s`;
    };
    upd();
    const timer = setInterval(upd,1000);
  }

  /* STAT COUNTER */
  let countersStarted = false;
  function animateCounters(){
    if(countersStarted) return;
    const stats = document.querySelectorAll('.stat');
    if(!stats.length) return;
    const rect = stats[0].getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){
      countersStarted = true;
      stats.forEach(s=>{
        const target = +s.dataset.target;
        const span = s.querySelector('.num');
        let cur = 0;
        const step = Math.ceil(target/120);
        const t = setInterval(()=> {
          cur += step;
          if(cur >= target){ span.textContent = target; clearInterval(t); } else span.textContent = cur;
        },10);
      });
    }
  }

  /* TESTIMONI slider */
  const testiData = [
    {name:'Ali',text:'Bergabung di ZAMARIS mengubah cara saya melihat masyarakat.'},
    {name:'Nina',text:'Banyak ilmu praktis dan jaringan yang saya dapatkan.'},
    {name:'Rizal',text:'Pelatihan kepemimpinan sangat aplikatif.'}
  ];
  const testiSlider = document.getElementById('testi-slider');
  if(testiSlider){
    testiData.forEach(t=>{
      const s = document.createElement('div'); s.className='card';
      s.innerHTML = `<p>"${t.text}"</p><strong>${t.name}</strong>`;
      testiSlider.appendChild(s);
    });

    let curTesti = 0;
    const slides = testiSlider.children;
    const showTesti = i => {
      Array.from(slides).forEach((el, idx) => el.style.display = idx === i ? 'block' : 'none');
    };
    showTesti(0);
    setInterval(() => {
      curTesti = (curTesti + 1) % slides.length;
      showTesti(curTesti);
    }, 5000);
  }

  /* REVEAL ON SCROLL */
  function revealOnScroll() {
    document.querySelectorAll('.fade-in, .card').forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight - 100) el.classList.add('visible');
    });
  }
  revealOnScroll();

  /* Video lazy embed */
  document.querySelectorAll('.video-card').forEach(vc => {
    const thumb = vc.querySelector('.yt-thumb');
    const url = vc.dataset.youtube;
    thumb && thumb.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = url + '?rel=0&autoplay=1';
      iframe.width = '100%';
      iframe.height = 315;
      iframe.setAttribute('allow','accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen','');
      vc.innerHTML = '';
      vc.appendChild(iframe);
      if(typeof gtag === 'function') gtag('event','play_video',{event_category:'video', event_label:url});
    });
    thumb && thumb.addEventListener('keypress', (e)=> { if(e.key==='Enter') thumb.click(); });
  });

  /* forms & newsletter & copy rek tetap sama */
  // … kode volunteer, vol-form-page, copy-rek, newsletter sama persis

  /* highlight nav section */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`nav a[href="#${id}"]`);
      if(entry.isIntersecting){
        navLinks.forEach(a => a.classList.remove('active'));
        link && link.classList.add('active');
      }
    });
  }, {threshold: 0.45});
  sections.forEach(s => io.observe(s));

  /* MORPH LOOP */
  function startMorphLoop() {
    const morphElems = document.querySelectorAll('.card, .highlight-card, .resource-card, .stat');
    morphElems.forEach(el => {
      let direction = 1, progress = 0, speed = 0.003;
      function loop() {
        progress += direction * speed;
        if(progress >= 1){ progress = 1; direction = -1; }
        else if(progress <= 0){ progress = 0; direction = 1; }
        const scale = 1 + 0.02 * progress;
        const radius = 8 + 12 * progress;
        el.style.transform = `scale(${scale})`;
        el.style.borderRadius = `${radius}px`;
        requestAnimationFrame(loop);
      }
      loop();
    });
  }
  startMorphLoop();

}); // DOMContentLoaded
