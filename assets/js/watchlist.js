// does this need to be wrapped around everything in here?
// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function () {
    displayWatchlist();
    displayTopFive();
});
// Function to display the watchlist
function displayWatchlist() {
    const genreSections = document.getElementById('genre-sections');
    const modal = document.querySelector('#modal');
    if (!genreSections) {
        console.error('Element with id "genre-sections" not found.');
        return;
    }
    // Retrieve the watchlist from local storage or initialize an empty array if not found
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    console.log('Loaded watchlist:', watchlist); // Debugging line

    genreSections.innerHTML = '';

    if (watchlist.length === 0) {
        genreSections.innerHTML = '<p>No movies in your watchlist.</p>';
        return;
    }
        // Iterate over the watchlist and create elements for each movie
    watchlist.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);
        // If the movie has a poster path, create an image element for it
        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster');
            movieBox.appendChild(imgElement);
        }
        // Add a button to add the movie to the Top 5 list
        const addToTopFiveButton = document.createElement('button');
        addToTopFiveButton.classList.add('button', 'add-to-top-five');
        addToTopFiveButton.textContent = 'Add to Top 5';
        addToTopFiveButton.addEventListener('click', () => {
            addToTopFive(movie);
            showModal('Added to Top 5');
        });
        // Add a button to mark the movie as watched and remove it from the watchlist
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
// Function to show a modal with a message
function showModal(message) {
    const modal = document.querySelector('#modal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.textContent = message;
    modal.classList.add('is-active');

    setTimeout(() => {
        hideModal();
    }, 1000);
}
// Function to hide the modal
function hideModal() {
    const modal = document.querySelector('#modal');
    modal.classList.remove('is-active');
}
// Function to display the Top 5 movies
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
    // Iterate over the top 5 list and create elements for each movie
    topFive.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);
        // If the movie has a poster path, create an image element for it
        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster');
            movieBox.appendChild(imgElement);
        }
        // Add a button to remove the movie from the Top 5 list
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
// function to add a movie to the watchlist
function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert(`${movie.title} has been added to your watchlist.`);
    displayWatchlist();
}
// Function to remove a movie from the watchlist
function removeFromWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(m => m.title !== movie.title);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}
// Function to add a movie to the Top 5 list
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
// Function to remove a movie from the Top 5 list
function removeFromTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    topFive = topFive.filter(m => m.title !== movie.title);
    localStorage.setItem('topFive', JSON.stringify(topFive));
    displayTopFive();
}
