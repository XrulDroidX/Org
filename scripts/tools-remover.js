// File: scripts/tools-remover.js (Versi Cloudinary)

document.addEventListener('DOMContentLoaded', () => {
    
    // --- GANTI DUA BARIS INI DENGAN INFO AKUN ANDA ---
    const CLOUD_NAME = "dj1re1gkj"; 
    const UPLOAD_PRESET = "jejaka-bg-remover"; // (misal: 'jejaka-bg-remover')
    // --------------------------------------------------

    const uploadButton = document.getElementById('upload-widget');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultOutput = document.getElementById('result-output');
    const resultImage = document.getElementById('result-image');
    const downloadLink = document.getElementById('download-link');

    // 1. Buat widget Cloudinary
    const myWidget = cloudinary.createUploadWidget({
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        styles: {
            palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#007BFF",
                menuIcons: "#5A616A",
                link: "#007BFF",
                action: "#007BFF",
                inactiveTabIcon: "#90A0B3",
                error: "#F44235",
                inProgress: "#007BFF",
                complete: "#00C49F",
            }
        }
    }, (error, result) => { 
        if (!error && result && result.event === "success") { 
            // 3. Sukses! Sembunyikan loading
            console.log('Done! Here is the image info: ', result.info); 
            loadingSpinner.style.display = 'none';

            // 4. Tampilkan gambar hasil (sudah dihapus background-nya)
            resultImage.src = result.info.secure_url;
            downloadLink.href = result.info.secure_url; // Set link unduh
            resultOutput.style.display = 'block';
            
        } else if (error) {
            console.error('Cloudinary Error: ', error);
            alert('Gagal meng-upload gambar. Silakan coba lagi.');
            loadingSpinner.style.display = 'none';
        } else if (result && result.event === "uploading") {
            // 2. Tampilkan loading saat proses upload
            console.log('Uploading...');
            resultsContainer.style.display = 'block';
            resultOutput.style.display = 'none';
            loadingSpinner.style.display = 'block';
        }
    });

    // Buka widget saat tombol diklik
    uploadButton.addEventListener('click', () => {
        myWidget.open();
    }, false);

});
