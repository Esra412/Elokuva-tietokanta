const popup = document.getElementById("popup");
const movieInput = document.getElementById("movieName");
const stars = document.querySelectorAll(".star-select span");
let selectedStars = 0;

// 1. kun sivu päivittyy tuo elokuvat (joita käyttäjä on arvostellut/lisännyt)
async function fetchReviews() {
    try {
        const response = await fetch('/api/reviews/all');
        
        if (response.status === 401) {
            alert("Sessio on päättynyt. Ole hyvä ja kirjaudu uudelleen.");
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error("Palvelinvirhe: " + response.status);
        }

        const reviews = await response.json();
        renderMovies(reviews);
    } catch (err) {
        console.error("Virhe haettaessa arvosteluja:", err);
    }
}

// 2. korttien luominen (Klaffikortit)
function renderMovies(movies) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = '';

    movies.forEach(movie => {
        // tähti arvostelu 
        const rating = movie.fire_rating || 0;
        const starHtml = '★'.repeat(rating) + '☆'.repeat(6 - rating);

        const card = document.createElement('div');
        card.className = 'clapper-card';
        
        // kun klikkaa elokuvaa, avaa arvostelu uuteen välilehteen
        card.onclick = () => {
            window.open(`/arvostelu?id=${movie.id}`, '_blank');
        };

        card.innerHTML = `
            <button class="delete-btn" onclick="event.stopPropagation(); deleteMovie(${movie.id})">−</button>
            <div class="clapper-top"></div>
            <div class="clapper-body">
                <div class="movie-title">${movie.title}</div>
                <div class="stars">${starHtml}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. Popup- uusi elokuva tallennus
async function saveMovie() {
    const name = movieInput.value.trim();
    if (!name || selectedStars === 0) {
        alert("Kirjoita elokuvan nimi ja valitse tähtiarvosana.");
        return;
    }

    const data = {
        title: name,
        fire: parseInt(selectedStars),
        drop: 0,
        score: parseInt(selectedStars),
        img_url: '',
        genre: '',
        category: 'Elokuva',
        watch_date: new Date().toISOString().split('T')[0],
        thoughts: '',
        best_scene: '',
        quote: ''
    };

    try {
        const response = await fetch('/api/reviews/save', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closePopup();
            fetchReviews(); 
        } else {
            const errorData = await response.json();
            alert("Virhe palvelimella: " + (errorData.error || "Tuntematon virhe"));
        }
    } catch (err) {
        alert("Yhteysvirhe: " + err.message);
    }
}

// 4. Poista elokuva arvostus
async function deleteMovie(id) {
    if (!confirm("Haluatko varmasti poistaa tämän arvostelun?")) return;

    try {
        const response = await fetch(`/api/reviews/${id}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            fetchReviews(); // päivitä kun poistetaan
        } else {
            alert("Poisto epäonnistui palvelimella.");
        }
    } catch (err) {
        console.error("Virhe:", err);
        alert("Poisto epäonnistui.");
    }
}

// --- POPUP JA TÄHTÄ VALIKKO ---

function addMovie() { 
    popup.style.display = "flex"; 
}

function closePopup() {
    popup.style.display = "none";
    movieInput.value = "";
    selectedStars = 0;
    stars.forEach(s => s.classList.remove("active"));
}

// tähti klikkaus juttu
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedStars = star.dataset.star;
        stars.forEach(s => {
            s.classList.toggle("active", s.dataset.star <= selectedStars);
        });
    });
});

// kun sivu latautuu 
window.onload = fetchReviews;