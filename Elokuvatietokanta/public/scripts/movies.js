const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const myListDiv = document.getElementById('myList');

// ELOKUVAHAKU
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

        if (!data.Search) return;

        data.Search.forEach(item => {
            const poster = item.Poster && item.Poster !== 'N/A' ? item.Poster : '/images/placeholder.png';
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${poster}">
                <button class="action-btn add-btn"><i class="fa fa-plus"></i></button>
                <div class="movie-info"><span>${item.Title}</span></div>
            `;
            card.querySelector('.add-btn').addEventListener('click', () => {
                addToList(item.imdbID, item.Type, item.Title, poster);
            });
            resultsDiv.appendChild(card);
        });
    } catch (err) { console.error(err); }
});

// LISÄÄ LISTALLE
async function addToList(imdbId, type, title, poster) {
    const res = await fetch('/api/movies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imdbId, type, title, poster })
    });
    if (res.ok) {
        loadMyList(); // Päivitetään "Lisätty"-osio heti
    }
}

// LATAA OMA LISTA
async function loadMyList() {
    try {
        const res = await fetch('/api/movies/list');
        const data = await res.json();
        myListDiv.innerHTML = '';

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${item.poster || '/images/placeholder.png'}">
                <button class="action-btn remove-btn" style="color:#ff4d4d;"><i class="fa fa-minus"></i></button>
                <div class="movie-info"><span>${item.title}</span></div>
            `;
            card.querySelector('.remove-btn').addEventListener('click', () => removeFromList(item.id));
            myListDiv.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

// POISTA
async function removeFromList(id) {
    if(!confirm("Poistetaanko?")) return;
    const res = await fetch(`/api/movies/remove/${id}`, { method: 'DELETE' });
    if (res.ok) loadMyList();
}

loadMyList();