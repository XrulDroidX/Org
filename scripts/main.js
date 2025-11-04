// File: scripts/main.js (Versi FINAL dengan SEMUA Animasi)

// --- INTI: Jalankan semua modul saat halaman dimuat ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Muat Header & Footer DULU
    await loadPartials(); 
    
    // 2. Jalankan sisa skrip SETELAH header dimuat
    setupHamburgerMenu(); 
    setupDesktopDropdown(); // Dropdown "Lainnya"
    setupScrollAnimation(); // (Ini sudah di-upgrade ke versi baru)
    setupHeaderScrollEffect();
    setupThemeSwitcher();
    setupPageTransitions(); // <-- (BARU) Transisi Halaman

    // 3. Jalankan skrip spesifik halaman (jika elemennya ada)
    setupSlider();
    setupWelcomePopup(); // Pop-up selamat datang
    setupLightbox();
    setupTestimonials(); 
});


// --- Fungsi Pemuat Komponen Modular ---
async function loadPartials() {
    // ... (kode tidak berubah) ...
    const headerElement = document.querySelector('header.header');
    const footerElement = document.querySelector('footer.footer');

    try {
        if (headerElement) {
            const headerResponse = await fetch('_partials/_header.html');
            headerElement.innerHTML = await headerResponse.text();
        }
        if (footerElement) {
            const footerResponse = await fetch('_partials/_footer.html');
            footerElement.innerHTML = await footerResponse.text();
        }
        setActiveNavLink();
    } catch (error) {
        console.error('Gagal memuat komponen partial:', error);
    }
}

// --- Fungsi Menandai Navigasi Aktif ---
function setActiveNavLink() {
    // ... (kode tidak berubah) ...
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        if (link.classList.contains('dropdown-toggle')) return; 

        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// --- (DI-UPGRADE) Modul 1: Animasi Scroll (Versi Baru dengan Stagger/Delay) ---
function setupScrollAnimation() {
    const elementsToReveal = document.querySelectorAll('.reveal');
    if (elementsToReveal.length === 0) return;

    const observerOptions = { root: null, threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // (BARU) Ambil delay dari data-attribute, default 0ms
                const delay = entry.target.dataset.delay || '0';
                
                // (BARU) Terapkan delay ke style
                entry.target.style.transitionDelay = `${delay}ms`;
                
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });
}

// --- Modul 2: Efek Header Scroll ---
function setupHeaderScrollEffect() {
    // ... (kode tidak berubah) ...
    const header = document.querySelector('.header');
    if (!header) return; 
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(44, 62, 80, 0.5)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
        }
    });
}

// --- Modul 3: Logika Hamburger Menu ---
function setupHamburgerMenu() {
    // ... (kode tidak berubah) ...
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }
}

// --- Modul 4: Logika Slider ---
function setupSlider() {
    // ... (kode tidak berubah) ...
    const slider = document.querySelector('.slider');
    if (!slider) return;
    const slides = slider.querySelectorAll('.slide');
    const next = slider.querySelector('.nav-next');
    const prev = slider.querySelector('.nav-prev');
    let currentSlide = 0;
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });
    }
    next.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });
    prev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });
}

// --- Modul 6: Logika Background Switcher ---
function setupThemeSwitcher() {
    // ... (kode tidak berubah) ...
    const bgElement = document.getElementById('bg-shapes');
    if (!bgElement) return;
    const buttons = document.querySelectorAll('.theme-switcher button');
    const body = document.body;
    function applyTheme(theme) {
        body.classList.remove('theme-light', 'theme-dark');
        if (theme === 'dark') {
            bgElement.style.background = 'var(--text-dark)';
            body.classList.add('theme-dark');
        } else if (theme === 'light') {
            bgElement.style.background = 'var(--bg-light)';
            body.classList.add('theme-light');
        } else {
            bgElement.style.background = 'linear-gradient(45deg, #6d80fe, #00c4ff)';
        }
        localStorage.setItem('sitetheme', theme);
    }
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            applyTheme(button.dataset.theme);
        });
    });
    const savedTheme = localStorage.getItem('sitetheme');
    if (savedTheme) applyTheme(savedTheme);
}

// --- Modul 7: Logika Lightbox Galeri ---
function setupLightbox() {
    // ... (kode tidak berubah) ...
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightboxImg.src = item.src;
        });
    });
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}


// --- Modul 8: Logika Dropdown "Lainnya" di Desktop ---
function setupDesktopDropdown() {
    // ... (kode tidak berubah) ...
    const dropdown = document.querySelector('.nav-item.dropdown');
    if (!dropdown) return; 

    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (event) => {
        event.preventDefault(); 
        menu.classList.toggle('show');
        dropdown.classList.toggle('active'); 
    });

    window.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target)) {
            menu.classList.remove('show');
            dropdown.classList.remove('active');
        }
    });
}

// --- Modul 9: Pop-up Selamat Datang (Satu Kali Sesi) ---
function setupWelcomePopup() {
    // ... (kode tidak berubah) ...
    const popup = document.getElementById('welcome-popup');
    if (!popup) return; 

    const closeButton = document.getElementById('welcome-close');
    
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');

    if (!hasSeenPopup) {
        setTimeout(() => {
            popup.classList.add('show');
        }, 1000); 
        sessionStorage.setItem('hasSeenWelcomePopup', 'true');
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
        });
    }
}

// --- Modul 10: Logika Slider Testimoni ---
function setupTestimonials() {
    // ... (kode tidak berubah) ...
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return; 

    const slides = slider.querySelectorAll('.testimonial-slide');
    const navContainer = document.getElementById('testimonial-nav');
    
    if (slides.length === 0 || !navContainer) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            navContainer.children[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        navContainer.children[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }

    navContainer.innerHTML = ''; 
    slides.forEach((slide, i) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            showSlide(i);
            clearInterval(slideInterval);
            startInterval();
        });
        navContainer.appendChild(dot);
    });

    function startInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); 
    }

    startInterval();
}


// --- (BARU) Modul 11: Logika Preloader ---
// Ini harus menggunakan 'load', BUKAN 'DOMContentLoaded', 
// agar menunggu gambar selesai dimuat.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});


// --- (BARU) Modul 12: Logika Transisi Halaman ---
function setupPageTransitions() {
    // 1. Hapus class fade-out (untuk tombol 'Back' browser)
    document.body.classList.remove('fade-out');

    // 2. Cari semua link internal
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Cek apakah link valid, BUKAN link eksternal, BUKAN link #, 
        // BUKAN mailto, BUKAN target _blank, BUKAN link unduh, BUKAN Google Translate
        if (href && 
            !href.startsWith('#') && 
            !href.startsWith('mailto:') && 
            !href.includes('translate.google') && // Abaikan link google translate
            !href.startsWith('javascript:') && // Abaikan pemicu google translate
            link.target !== '_blank' &&
            !href.endsWith('.pdf') && !href.endsWith('.docx') && !href.endsWith('.pptx') &&
            (href.startsWith('/') || href.endsWith('.html') || href.includes(window.location.host)) &&
            !link.classList.contains('dropdown-toggle') // Abaikan pemicu dropdown
           ) 
        {
            link.addEventListener('click', (e) => {
                // 3. Hentikan navigasi normal
                e.preventDefault(); 
                
                // 4. Terapkan animasi fade-out
                document.body.classList.add('fade-out');
                
                // 5. Tunggu animasi selesai, baru pindah halaman
                setTimeout(() => {
                    window.location.href = href;
                }, 400); // 400ms (harus cocok dengan durasi transisi CSS)
            });
        }
    });
}
    
