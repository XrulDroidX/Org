// File: scripts/main.js (Versi FINAL dengan dropdown)

// --- INTI: Jalankan semua modul saat halaman dimuat ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Muat Header & Footer DULU
    await loadPartials(); 
    
    // 2. Jalankan sisa skrip SETELAH header dimuat
    setupHamburgerMenu(); 
    setupDesktopDropdown(); // <-- (BARU) INI TAMBAHANNYA
    setupScrollAnimation();
    setupHeaderScrollEffect();
    setupThemeSwitcher();

    // 3. Jalankan skrip spesifik halaman (jika elemennya ada)
    setupSlider();
    setupModal();
    setupLightbox();
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
    // (Kode Anda sebelumnya, tidak berubah)
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        // (Modifikasi kecil untuk mengabaikan link dropdown)
        if (link.classList.contains('dropdown-toggle')) return; 

        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// --- Modul 1: Animasi Scroll ---
function setupScrollAnimation() {
    // (Kode Anda sebelumnya, tidak berubah)
    const elementsToReveal = document.querySelectorAll('.reveal');
    if (elementsToReveal.length === 0) return;
    const observerOptions = { root: null, threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    elementsToReveal.forEach(element => observer.observe(element));
}

// --- Modul 2: Efek Header Scroll ---
function setupHeaderScrollEffect() {
    // (Kode Anda sebelumnya, tidak berubah)
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
    // (Kode Anda sebelumnya, tidak berubah)
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
    // (Kode Anda sebelumnya, tidak berubah)
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

// --- Modul 5: Logika Pop-up Modal ---
function setupModal() {
    // (Kode Anda sebelumnya, tidak berubah)
    const modal = document.getElementById('my-modal');
    if (!modal) return;
    const closeModal = modal.querySelector('.modal-close');
    setTimeout(() => {
        modal.classList.add('show-modal');
    }, 3000);
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show-modal');
    });
}

// --- Modul 6: Logika Background Switcher ---
function setupThemeSwitcher() {
    // (Kode Anda sebelumnya, tidak berubah)
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
    // (Kode Anda sebelumnya, tidak berubah)
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


// --- (BARU) Modul 8: Logika Dropdown "Lainnya" di Desktop ---
function setupDesktopDropdown() {
    const dropdown = document.querySelector('.nav-item.dropdown');
    if (!dropdown) return; // Hentikan jika tidak ada dropdown

    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Pastikan elemennya ada sebelum lanjut
    if (!toggle || !menu) return;

    // Tampilkan/sembunyikan menu saat tombol "Lainnya" diklik
    toggle.addEventListener('click', (event) => {
        event.preventDefault(); // Mencegah link # diikuti
        menu.classList.toggle('show');
        dropdown.classList.toggle('active'); // Untuk memutar panah
    });

    // Sembunyikan menu saat klik di luar area menu
    window.addEventListener('click', (event) => {
        // Cek apakah klik terjadi di luar .dropdown
        if (!dropdown.contains(event.target)) {
            menu.classList.remove('show');
            dropdown.classList.remove('active');
        }
    });
                                               }
        
