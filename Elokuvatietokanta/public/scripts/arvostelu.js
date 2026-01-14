let reviews = JSON.parse(localStorage.getItem('cineArchive')) || [];
    let currentFilter = 'Hepsi';

    function previewImage(url) {
        const img = document.getElementById('posterPreview');
        img.src = url || 'https://via.placeholder.com/300x450?text=Afiş+URL+Yapıştır';
    }

    function setRate(id, val) {
        const box = document.getElementById(id);
        box.setAttribute('data-val', val);
        const spans = box.querySelectorAll('span');
        spans.forEach((s, i) => s.classList.toggle('active', i < val));
    }

    document.getElementById('reviewForm').onsubmit = (e) => {
        e.preventDefault();
        const newReview = {
            id: Date.now(),
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            img: document.getElementById('imgUrl').value || 'https://via.placeholder.com/300x450?text=No+Image',
            genre: document.getElementById('genre').value,
            date: document.getElementById('date').value,
            thoughts: document.getElementById('thoughts').value,
            scene: document.getElementById('bestScene').value,
            quote: document.getElementById('quote').value,
            drop: document.getElementById('dropRating').getAttribute('data-val'),
            fire: document.getElementById('fireRating').getAttribute('data-val'),
            score: (parseInt(document.getElementById('dropRating').getAttribute('data-val')) + 
                    parseInt(document.getElementById('fireRating').getAttribute('data-val'))) // Basit bir skor hesaplama
        };

        reviews.push(newReview);
        localStorage.setItem('cineArchive', JSON.stringify(reviews));
        e.target.reset();
        previewImage('');
        document.querySelectorAll('.rating-box span').forEach(s => s.classList.remove('active'));
        renderCards();
    };

    function renderCards() {
        const grid = document.getElementById('archiveGrid');
        const searchTerm = document.getElementById('search').value.toLowerCase();
        grid.innerHTML = '';

        const filtered = reviews.filter(r => {
            const matchesFilter = currentFilter === 'Hepsi' || r.category === currentFilter;
            const matchesSearch = r.title.toLowerCase().includes(searchTerm);
            return matchesFilter && matchesSearch;
        });

        filtered.reverse().forEach(r => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${r.img}" class="card-img" alt="poster">
                <div class="card-score">⭐ ${r.score}/10</div>
                <div class="card-body">
                    <small style="color:var(--gold)">${r.category} • ${r.genre}</small>
                    <h2 style="margin:5px 0; font-size:1.4rem">${r.title}</h2>
                    <p style="font-size:0.85rem; height: 60px; overflow: hidden;">${r.thoughts}</p>
                    <div class="quote-text">"${r.quote}"</div>
                    <div style="margin-top:15px; display:flex; justify-content:space-between; align-items:center">
                        <small>📅 ${r.date}</small>
                        <button class="delete-btn" onclick="deleteEntry(${r.id})">KAYDI SİL</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        updateStats();
    }

    function filterBy(cat) {
        currentFilter = cat;
        document.querySelectorAll('.filter-btns button').forEach(b => {
            b.classList.toggle('active', b.innerText.includes(cat) || (cat === 'Hepsi' && b.innerText === 'Hepsi'));
        });
        renderCards();
    }

    function deleteEntry(id) {
        if(confirm('Arşivden silinsin mi?')) {
            reviews = reviews.filter(r => r.id !== id);
            localStorage.setItem('cineArchive', JSON.stringify(reviews));
            renderCards();
        }
    }

    function updateStats() {
        document.getElementById('statCount').innerText = reviews.length;
        const avg = reviews.length ? (reviews.reduce((a, b) => a + b.score, 0) / reviews.length).toFixed(1) : 0;
        document.getElementById('statAvg').innerText = avg;
        // Basit mod hesaplamaları buraya eklenebilir
    }

    function exportData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reviews));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "cine_archive_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    window.onload = renderCards;