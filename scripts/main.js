// File: scripts/main.js (Versi FINAL dengan SEMUA Fitur & Perbaikan Tema)

// --- INTI: Jalankan semua modul saat halaman dimuat ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Muat Header & Footer DULU
    await loadPartials(); 
    
    // 2. Jalankan sisa skrip SETELAH header dimuat
    setupHamburgerMenu(); 
    setupDesktopDropdown(); // Dropdown "Lainnya"
    setupScrollAnimation(); // Animasi beruntun
    setupHeaderScrollEffect();
    setupThemeSwitcher(); // (SUDAH DIPERBAIKI)
    setupPageTransitions(); // Transisi Halaman

    // 3. Jalankan skrip spesifik halaman (jika elemennya ada)
    setupSlider();
    setupWelcomePopup(); // Pop-up selamat datang
    setupLightbox();
    setupTestimonials(); 
});


// --- Fungsi Pemuat Komponen Modular ---
async function loadPartials() {
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
                const delay = entry.target.dataset.delay || '0';
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
    if (next && prev) { // Pastikan tombol ada
        next.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
        prev.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }
}

// --- (DIPERBAIKI) Modul 6: Logika Background Switcher ---
function setupThemeSwitcher() {
    const buttons = document.querySelectorAll('.theme-switcher button');
    if (buttons.length === 0) return; // Hentikan jika tidak ada tombol

    const body = document.body;
    const bgElement = document.getElementById('bg-shapes');

    function applyTheme(theme) {
        // 1. Hapus hanya class tema, biarkan class lain (seperti 'fade-out')
        body.classList.remove('theme-gradient', 'theme-light', 'theme-dark', 'theme-soft-blue', 'theme-sage-green', 'theme-earth', 'theme-lavender');

        // 2. Tambahkan class tema yang baru
        if (theme) {
            body.classList.add(theme);
        }

        // 3. Perbarui background-shapes agar cocok
        if (bgElement) {
            // Kita perlu mengambil warna dari CSS variabel yang baru saja kita set di body
            // Diberi jeda singkat agar style-nya sempat di-apply
            setTimeout(() => {
                const newBg = getComputedStyle(body).getPropertyValue('--bg-color');
                bgElement.style.background = newBg;
            }, 0);
        }
        
        // 4. Simpan pilihan tema
        localStorage.setItem('sitetheme', theme);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            applyTheme(theme);
        });
    });

    // 5. Terapkan tema yang tersimpan saat memuat halaman
    const savedTheme = localStorage.getItem('sitetheme') || 'gradient'; // Default ke gradasi
    applyTheme(savedTheme);
}

// --- Modul 7: Logika Lightbox Galeri ---
function setupLightbox() {
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
    if(lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}


// --- Modul 8: Logika Dropdown "Lainnya" di Desktop ---
function setupDesktopDropdown() {
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
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return; 

    const slides = slider.querySelectorAll('.testimonial-slide');
    const navContainer = document.getElementById('testimonial-nav');
    
    if (slides.length === 0 || !navContainer) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (!navContainer.children[index]) return; // Jaga-jaga jika error
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (navContainer.children[i]) {
                navContainer.children[i].classList.remove('active');
            }
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


// --- (PENTING) Modul 11: Logika Preloader ---
// Ini harus menggunakan 'load', BUKAN 'DOMContentLoaded', 
// agar menunggu gambar selesai dimuat.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});


// --- (PENTING) Modul 12: Logika Transisi Halaman ---
function setupPageTransitions() {
    document.body.classList.remove('fade-out'); // Hapus class fade-out
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href && 
            !href.startsWith('#') && 
            !href.startsWith('mailto:') && 
            !href.includes('translate.google') && 
            !href.startsWith('javascript:') && 
            link.target !== '_blank' &&
            !href.endsWith('.pdf') && !href.endsWith('.docx') && !href.endsWith('.pptx') &&
            (href.startsWith('/') || href.endsWith('.html') || href.includes(window.location.host)) &&
            !link.classList.contains('dropdown-toggle') 
           ) 
        {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 400); 
            });
        }
    });
}
