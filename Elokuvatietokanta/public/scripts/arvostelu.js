const urlParams = new URLSearchParams(window.location.search);
const reviewId = urlParams.get('id');

// 1. kun sivu latautuu, lataa arvostelu data
async function loadReviewData() {
    if (!reviewId) return;

    try {
        const response = await fetch(`/api/reviews/${reviewId}`);
        const data = await response.json();

        if (data) {
            // päivitä otsikko
            document.querySelector('h1').innerText = data.title; 

            // täydennä fonm kohdat
            document.getElementById('title').value = data.title || '';
            document.getElementById('imgUrl').value = data.img_url || '';
            document.getElementById('genre').value = data.genre || '';
            document.getElementById('date').value = data.watch_date ? data.watch_date.split('T')[0] : '';
            document.getElementById('thoughts').value = data.thoughts || '';
            document.getElementById('bestScene').value = data.best_scene || '';
            document.getElementById('quote').value = data.quote || '';
            
            // Emoji pisteet aseta 
            setRate('dropRating', data.drop_rating || 0);
            setRate('fireRating', data.fire_rating || 0);
            
            // kuvan esikatselu
            previewImage(data.img_url);
        }
    } catch (err) {
        console.error("Veri yükleme hatası:", err);
    }
}

// 2. Form lähetys (Tallennus / päivitys buttoni)
document.getElementById('reviewForm').onsubmit = async (e) => {
    e.preventDefault();

    const data = {
        id: reviewId, 
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
    
    // Laske kokonaispisteet
    data.score = parseInt(data.drop) + parseInt(data.fire);

    try {
        const response = await fetch('/api/reviews/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

    if (response.ok) {
            alert("Tallennettu onnistuneesti!");
            window.location.href = '/arvostelut'; // Palaa listaan
        } else {
            alert("Tallennus epäonnistui. Ole hyvä ja yritä uudelleen.");
        }
    } catch (err) {
        console.error("Tallennusvirhe:", err);
    }
};

// --- YARDIMCI FONKSİYONLAR (MUTLAKA OLMALI) ---

// Arvostelu (Emoji) valitseminen ja korostaminen
function setRate(id, val) {
    const box = document.getElementById(id);
    if (!box) return;

    box.setAttribute('data-val', val); 
    const spans = box.querySelectorAll('span');
    
    spans.forEach((s, i) => {
        if (i < val) {
            s.classList.add('active'); 
        } else {
            s.classList.remove('active');
        }
    });
}

// jos kuva vaihtuu poista se historiasta
function previewImage(url) {
    const img = document.getElementById('posterPreview');
    if (img) {
        img.src = url || 'https://via.placeholder.com/300x450?text=Ei+kuvaa';
    }
}

window.onload = loadReviewData;