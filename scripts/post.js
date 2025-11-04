// File: scripts/post.js

// --- 1. GANTI DENGAN KUNCI API CONTENTFUL ANDA ---
const CONTENTFUL_SPACE_ID = 'dddfffpze5ox';
const CONTENTFUL_ACCESS_TOKEN = '8DlARaMEWuTncoJ8IZcpHUnZQZTVnw9t6NLCF8YobRc';
const CONTENTFUL_CONTENT_TYPE = 'berita'; 

const postContainer = document.getElementById('post-container');
const loadingMessage = document.getElementById('post-loading');

// --- 2. Ambil "slug" dari URL (misal: post.html?slug=kegiatan-baksos) ---
const slug = new URLSearchParams(window.location.search).get('slug');

// --- 3. Fungsi untuk mengambil data satu artikel ---
async function fetchSinglePost() {
    if (!slug) {
        loadingMessage.textContent = 'Artikel tidak ditemukan (slug tidak ada).';
        return;
    }

    // Ini adalah Query GraphQL untuk mengambil 1 item berdasarkan slug
    const query = `
    query {
      beritaCollection(where: { slug: "${slug}" }, limit: 1) {
        items {
          judul
          tanggalPublikasi
          gambarUtama {
            url(transform: {width: 800, format: WEBP, quality: 85})
          }
          isiBerita {
            json
          }
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

        if (!response.ok) throw new Error('Gagal mengambil data dari CMS');

        const json = await response.json();
        const post = json.data.beritaCollection.items[0];

        if (!post) throw new Error('Artikel tidak ditemukan di CMS');
        
        renderPost(post);

    } catch (error) {
        console.error(error);
        loadingMessage.textContent = 'Gagal memuat artikel. ' + error.message;
    }
}

// --- 4. Fungsi untuk menampilkan data ke HTML ---
function renderPost(post) {
    // Hapus pesan loading
    loadingMessage.style.display = 'none';

    // Set Judul Halaman & Deskripsi (SEO)
    document.title = `${post.judul} - JEJAKA`;
    // (Anda bisa tambahkan meta description di sini jika mau)

    // Konversi tanggal
    const tgl = new Date(post.tanggalPublikasi).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // Render "Rich Text" JSON menjadi HTML
    // Kita gunakan library 'richTextHtmlRenderer' yang kita impor di .html
    const richTextHtml = window.richTextHtmlRenderer.documentToHtmlString(post.isiBerita.json);

    // Masukkan semua HTML ke kontainer
    postContainer.innerHTML = `
        <h1>${post.judul}</h1>
        <p class="post-meta">Dipublikasikan pada ${tgl}</p>
        <img src="${post.gambarUtama.url}" alt="${post.judul}" class="post-image">
        <div class="post-content-body">
            ${richTextHtml}
        </div>
    `;
}

// --- 5. Jalankan fungsi utama ---
fetchSinglePost();
