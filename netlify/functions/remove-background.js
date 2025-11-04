// File: netlify/functions/remove-background.js

// Kita perlu 'node-fetch' karena Netlify Functions pakai Node.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    // 1. Ambil Kunci API RAHASIA dari pengaturan Netlify
    const PICSART_API_KEY = process.env.PICSART_API_KEY;

    if (!PICSART_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Kunci API Picsart belum diatur di server.' })
        };
    }

    // 2. Ambil data gambar (Base64) yang dikirim dari browser
    const { image } = JSON.parse(event.body);

    if (!image) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Tidak ada gambar yang di-upload.' })
        };
    }

    try {
        // 3. Panggil API Picsart
        const response = await fetch('https://api.picsart.io/v1/removebg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': PICSART_API_KEY // Ini Kunci RAHASIA Anda
            },
            body: JSON.stringify({
                image: {
                    data: image, // Kirim Base64
                    type: 'base64'
                },
                output_type: 'base64' // Minta hasilnya Base64 juga
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.title || 'API Picsart gagal merespon.');
        }

        const result = await response.json();

        // 4. Kirim hasilnya (gambar Base64) kembali ke browser
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                resultImageBase64: result.data.image.data 
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};
