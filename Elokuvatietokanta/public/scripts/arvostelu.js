const urlParams = new URLSearchParams(window.location.search);
const reviewId = urlParams.get('id');

// 1. Sayfa yüklendiğinde mevcut verileri getir
async function loadReviewData() {
    if (!reviewId) return;

    try {
        const response = await fetch(`/api/reviews/${reviewId}`);
        const data = await response.json();

        if (data) {
            // BAŞLIĞI GÜNCELLE
            document.querySelector('h1').innerText = data.title; 

            // Form alanlarını doldur
            document.getElementById('title').value = data.title || '';
            document.getElementById('imgUrl').value = data.img_url || '';
            document.getElementById('genre').value = data.genre || '';
            document.getElementById('date').value = data.watch_date ? data.watch_date.split('T')[0] : '';
            document.getElementById('thoughts').value = data.thoughts || '';
            document.getElementById('bestScene').value = data.best_scene || '';
            document.getElementById('quote').value = data.quote || '';
            
            // Emoji puanlarını görsel olarak güncelle
            setRate('dropRating', data.drop_rating || 0);
            setRate('fireRating', data.fire_rating || 0);
            
            // Resmi önizle
            previewImage(data.img_url);
        }
    } catch (err) {
        console.error("Veri yükleme hatası:", err);
    }
}

// 2. Form gönderildiğinde (Kaydet Butonu)
document.getElementById('reviewForm').onsubmit = async (e) => {
    e.preventDefault();

    const data = {
        id: reviewId, // Varsa UPDATE, yoksa INSERT yapar
        title: document.getElementById('title').value,
        img_url: document.getElementById('imgUrl').value,
        genre: document.getElementById('genre').value,
        watch_date: document.getElementById('date').value,
        thoughts: document.getElementById('thoughts').value,
        best_scene: document.getElementById('bestScene').value,
        quote: document.getElementById('quote').value,
        drop: document.getElementById('dropRating').getAttribute('data-val') || 0,
        fire: document.getElementById('fireRating').getAttribute('data-val') || 0
    };
    
    // Toplam skor hesapla
    data.score = parseInt(data.drop) + parseInt(data.fire);

    try {
        const response = await fetch('/api/reviews/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Başarıyla kaydedildi!");
            window.location.href = '/arvostelut'; // Listeye geri dön
        } else {
            alert("Kaydedilemedi. Lütfen tekrar deneyin.");
        }
    } catch (err) {
        console.error("Kaydetme hatası:", err);
    }
};

// --- YARDIMCI FONKSİYONLAR (MUTLAKA OLMALI) ---

// Puanlama (Emoji) seçimi ve görselleştirme
function setRate(id, val) {
    const box = document.getElementById(id);
    if (!box) return;

    box.setAttribute('data-val', val); // Değeri sakla
    const spans = box.querySelectorAll('span');
    
    spans.forEach((s, i) => {
        if (i < val) {
            s.classList.add('active'); // CSS'de .active tanımlı olmalı (genelde grayscale(0))
        } else {
            s.classList.remove('active');
        }
    });
}

// Resim URL'si değiştiğinde önizlemeyi güncelle
function previewImage(url) {
    const img = document.getElementById('posterPreview');
    if (img) {
        img.src = url || 'https://via.placeholder.com/300x450?text=Ei+kuvaa';
    }
}

// Sayfa açıldığında verileri yükle
window.onload = loadReviewData;