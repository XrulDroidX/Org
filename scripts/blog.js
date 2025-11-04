// File: scripts/blog.js

// --- 1. GANTI DENGAN KUNCI API CONTENTFUL ANDA ---
// Anda bisa dapatkan ini dari Dasbor Contentful:
// Settings -> API keys -> Content Delivery API
const CONTENTFUL_SPACE_ID = 'dddfffpze5ox';
const CONTENTFUL_ACCESS_TOKEN = '8DlARaMEWuTncoJ8IZcpHUnZQZTVnw9t6NLCF8YobRc';
const CONTENTFUL_CONTENT_TYPE = 'berita'; // ID dari Tipe Konten 'Berita' Anda

const blogGrid = document.getElementById('blog-grid');
const loadingMessage = document.getElementById('loading-message');

// --- 2. Fungsi untuk mengambil data dari Contentful ---
async function fetchBlogPosts() {
    const query = `
    query {
      beritaCollection {
        items {
          judul
          tanggalPublikasi
          ringkasan
          gambarUtama {
            url(transform: {width: 400, height: 300, format: WEBP, quality: 80})
          }
          slug
        }
      }
    }
    `;

    try {
        const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data dari CMS');
        }

        const json = await response.json();
        const posts = json.data.beritaCollection.items;
        renderPosts(posts);

    } catch (error) {
        console.error(error);
        if (loadingMessage) loadingMessage.textContent = 'Gagal memuat berita. Coba lagi nanti.';
    }
}

// --- 3. Fungsi untuk menampilkan data ke HTML ---
function renderPosts(posts) {
    if (loadingMessage) loadingMessage.style.display = 'none';

    if (!posts || posts.length === 0) {
        blogGrid.innerHTML = '<p>Belum ada berita yang dipublikasikan.</p>';
        return;
    }

    // Buat kartu HTML untuk setiap post
    posts.forEach(post => {
        const card = document.createElement('article');
        card.className = 'blog-card';

        const imageUrl = post.gambarUtama ? post.gambarUtama.url : 'assets/images/default-placeholder.jpg';
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${post.judul}" class="blog-card-img">
            <div class="blog-card-content">
                <h3>${post.judul}</h3>
                <p>${post.ringkasan}</p>
                <a href="post.html?slug=${post.slug}" class="button">Baca Selengkapnya</a>
            </div>
        `;
        blogGrid.appendChild(card);
    });
}

// --- 4. Jalankan fungsi utama ---
fetchBlogPosts();
  
