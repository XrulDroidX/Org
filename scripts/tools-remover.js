// File: scripts/tools-remover.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('image-form');
    const input = document.getElementById('image-upload');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultOutput = document.getElementById('result-output');
    const resultImage = document.getElementById('result-image');
    const submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Hentikan form submit biasa

        const file = input.files[0];
        if (!file) return;

        // Tampilkan loading
        resultsContainer.style.display = 'block';
        loadingSpinner.style.display = 'block';
        resultOutput.style.display = 'none';
        submitButton.disabled = true;
        submitButton.textContent = 'Memproses...';

        try {
            // 1. Ubah gambar menjadi Base64 string
            const imageBase64 = await toBase64(file);

            // 2. Kirim Base64 ke "kantor belakang" (Netlify Function) kita
            const response = await fetch('/.netlify/functions/remove-background', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageBase64 })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal memproses gambar.');
            }

            const data = await response.json();
            
            // 3. Tampilkan hasilnya
            // Picsart mengembalikan gambar dalam format Base64
            resultImage.src = `data:image/png;base64,${data.resultImageBase64}`;
            resultOutput.style.display = 'block';

        } catch (error) {
            console.error(error);
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            // Sembunyikan loading
            loadingSpinner.style.display = 'none';
            submitButton.disabled = false;
            submitButton.textContent = 'Hapus Latar Belakang';
        }
    });

    // Fungsi helper untuk mengubah File menjadi Base64
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Hapus awalan 'data:image/jpeg;base64,'
                const base64String = reader.result
                    .replace('data:', '')
                    .replace(/^.+,/, '');
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    }
});
          
