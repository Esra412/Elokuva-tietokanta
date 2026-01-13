const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const myListDiv = document.getElementById('myList');

// 🔍 ELOKUVAHAKU
searchInput?.addEventListener('input', async () => {
    const query = searchInput.value.trim();

    if (query.length < 3) {
        resultsDiv.innerHTML = '';
        return;
    }

    try {
        const res = await fetch(`/api/omdb/search?q=${query}`);
        const data = await res.json();

        resultsDiv.innerHTML = '';

        if (!data.Search) {
            resultsDiv.innerHTML = '<p>Elokuvia ei löytynyt.</p>';
            return;
        }

        data.Search.forEach(item => {
            const poster = item.Poster && item.Poster !== 'N/A' ? item.Poster : '/images/placeholder.png';
            
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${poster}" alt="${item.Title}">
                <button class="action-btn" title="Lisää listalle">
                    <i class="fa fa-plus"></i>
                </button>
                <div class="movie-info">
                    <span>${item.Title} (${item.Year})</span>
                </div>
            `;

            card.querySelector('.action-btn').addEventListener('click', () => {
                addToList(item.imdbID, item.Type, item.Title);
            });

            resultsDiv.appendChild(card);
        });
    } catch (err) {
        console.error("Haku epäonnistui:", err);
    }
});

// ⭐ LISÄÄ LISTALLE
async function addToList(imdbId, type, title) {
    try {
        const res = await fetch('/api/movies/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imdbId, type, title })
        });

        if (res.ok) {
            loadMyList(); // Päivitä lista heti
        } else {
            alert('Tämä elokuva on jo listallasi!');
        }
    } catch (err) {
        console.error("Virhe lisättäessä:", err);
    }
}

// 📥 LATAA OMA LISTA
async function loadMyList() {
    try {
        const res = await fetch('/api/movies/list');
        const data = await res.json();

        myListDiv.innerHTML = '';

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            // Huom: Jos API:si ei palauta julisteen URL-osoitetta listassa, 
            // tässä voi käyttää geneeristä kuvaa tai hakea tiedot uudelleen
            card.innerHTML = `
                <div style="padding:20px; text-align:center; color:var(--accent-gold)">
                    <i class="fa fa-film" style="font-size:3rem"></i>
                </div>
                <button class="action-btn" style="color: #ff4d4d;" title="Poista listalta">
                    <i class="fa fa-minus"></i>
                </button>
                <div class="movie-info">
                    <span>${item.title}</span>
                </div>
            `;
            
            // Tähän voisi lisätä poistotoiminnon jos API tukee sitä
            myListDiv.appendChild(card);
        });
    } catch (err) {
        console.error("Listan lataus epäonnistui:", err);
    }
}

// Lataa lista kun sivu avataan
loadMyList();