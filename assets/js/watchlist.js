// does this need to be wrapped around everything in here?

document.addEventListener('DOMContentLoaded', function () {
    displayWatchlist();
    displayTopFive();
});

function displayWatchlist() {
    const genreSections = document.getElementById('genre-sections');
    const modal = document.querySelector('#modal');
    if (!genreSections) {
        console.error('Element with id "genre-sections" not found.');
        return;
    }

    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    console.log('Loaded watchlist:', watchlist); // Debugging line

    genreSections.innerHTML = '';

    if (watchlist.length === 0) {
        genreSections.innerHTML = '<p>No movies in your watchlist.</p>';
        return;
    }

    watchlist.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);

        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster');
            movieBox.appendChild(imgElement);
        }

        const addToTopFiveButton = document.createElement('button');
        addToTopFiveButton.classList.add('button', 'add-to-top-five');
        addToTopFiveButton.textContent = 'Add to Top 5';
        addToTopFiveButton.addEventListener('click', () => {
            addToTopFive(movie);
            showModal('Added to Top 5');
        });

        const watchedButton = document.createElement('button');
        watchedButton.classList.add('button', 'watched');
        watchedButton.textContent = 'Watched';
        watchedButton.addEventListener('click', () => {
            removeFromWatchlist(movie);
        });
        modal.addEventListener('click', function(event){

            if(event.target === modal)
                hideModal();
        });

        movieBox.appendChild(addToTopFiveButton);
        movieBox.appendChild(watchedButton);
        genreSections.appendChild(movieBox);


    });
}
function showModal(message) {
    const modal = document.querySelector('#modal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.textContent = message;
    modal.classList.add('is-active');

    setTimeout(() => {
        hideModal();
    }, 1000);
}

function hideModal() {
    const modal = document.querySelector('#modal');
    modal.classList.remove('is-active');
}

function displayTopFive() {
    const topFiveSection = document.getElementById('top-5-section');
    
    if (!topFiveSection) {
        console.error('Element with id "top-5-section" not found.');
        return;
    }

    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];

    console.log('Loaded topFive:', topFive); // Debugging line
    // we need to keep this and try to play with the css for it and git rid of the one on the html
    topFiveSection.innerHTML = '<h2 class="subtitle"></h2>';

    if (topFive.length === 0) {
        return;
    }

    topFive.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);

        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster');
            movieBox.appendChild(imgElement);
        }

        const removeFromTopFiveButton = document.createElement('button');
        removeFromTopFiveButton.classList.add('button', 'remove-from-top-five');
        removeFromTopFiveButton.textContent = 'Remove';
        removeFromTopFiveButton.addEventListener('click', () => {
            removeFromTopFive(movie);
            showModal('Removed from Top 5');
        });


        movieBox.appendChild(removeFromTopFiveButton);

        topFiveSection.appendChild(movieBox);
    });
}

function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert(`${movie.title} has been added to your watchlist.`);
    displayWatchlist();
}

function removeFromWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(m => m.title !== movie.title);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}

function addToTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    if (topFive.length < 5) {
        topFive.push(movie);
        localStorage.setItem('topFive', JSON.stringify(topFive));
        displayTopFive();
    } else {
        alert('Top 5 list is full. Please remove a movie before adding another.');
    }
}

function removeFromTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    topFive = topFive.filter(m => m.title !== movie.title);
    localStorage.setItem('topFive', JSON.stringify(topFive));
    displayTopFive();
}
