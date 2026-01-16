// Haetaan ID URL-osoitteesta (esim. arvostelu?id=123)
const urlParams = new URLSearchParams(window.location.search);
const reviewId = urlParams.get('id');

// 1. Jos ID on olemassa, haetaan tiedot tietokannasta ja täytetään lomake
async function loadReviewData() {
    if (!reviewId) return;

    try {
        const response = await fetch(`/api/reviews/${reviewId}`);
        const data = await response.json();

        if (data) {
            document.getElementById('title').value = data.title || '';
            document.getElementById('imgUrl').value = data.img_url || '';
            document.getElementById('genre').value = data.genre || '';
            document.getElementById('date').value = data.watch_date ? data.watch_date.split('T')[0] : '';
            document.getElementById('thoughts').value = data.thoughts || '';
            document.getElementById('bestScene').value = data.best_scene || '';
            document.getElementById('quote').value = data.quote || '';
            
            // Päivitä tähdet ja esikatselukuva
            setRate('dropRating', data.drop_rating);
            setRate('fireRating', data.fire_rating);
            previewImage(data.img_url);
            
            // Päivitä otsikko näyttämään elokuvan nimi
            document.querySelector('h1').innerText = data.title;
        }
    } catch (err) {
        console.error("Virhe ladattaessa tietoja:", err);
    }
}

// 2. Lomakkeen lähettäminen (Tallennus/Päivitys)
document.getElementById('reviewForm').onsubmit = async (e) => {
    e.preventDefault();

    const data = {
        id: reviewId, // Lähetetään ID mukana, jos kyseessä päivitys
        title: document.getElementById('title').value,
        img_url: document.getElementById('imgUrl').value,
        genre: document.getElementById('genre').value,
        watch_date: document.getElementById('date').value,
        thoughts: document.getElementById('thoughts').value,
        best_scene: document.getElementById('bestScene').value,
        quote: document.getElementById('quote').value,
        drop: document.getElementById('dropRating').getAttribute('data-val') || 0,
        fire: document.getElementById('fireRating').getAttribute('data-val') || 0,
    };
    
    // Lasketaan kokonaispisteet
    data.score = parseInt(data.drop) + parseInt(data.fire);

    try {
        const response = await fetch('/api/reviews/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Tiedot tallennettu onnistuneesti!");
            window.location.href = '/arvostelut'; // Palaa listaan
        }
    } catch (err) {
        alert("Tallennus epäonnistui.");
    }
};

// --- APUFUNKTIOT ---
function previewImage(url) {
    const img = document.getElementById('posterPreview');
    img.src = url || 'https://via.placeholder.com/300x450?text=Ei+kuvaa';
}

function setRate(id, val) {
    const box = document.getElementById(id);
    if (!box) return;
    box.setAttribute('data-val', val);
    const spans = box.querySelectorAll('span');
    spans.forEach((s, i) => s.classList.toggle('active', i < val));
}

// Lataa tiedot kun sivu avataan
window.onload = loadReviewData;