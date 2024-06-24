// Ensure the script runs only after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    displayWatchlist();
    displayTopFive();
});

// Function to display the watchlist
function displayWatchlist() {
    const genreSections = document.getElementById('genre-sections');
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (watchlist.length === 0) {
        genreSections.innerHTML = '<p>No movies in your watchlist.</p>';
        return;
    }

    // Iterate through each movie in the watchlist and create elements to display them
    watchlist.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);

        // If the movie has a poster, create an img element and append it to the movieBox
        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster');

            movieBox.appendChild(imgElement);
        }

        // Add to Top 5 button
        const addToTopFiveButton = document.createElement('button');
        addToTopFiveButton.classList.add('button', 'add-to-top-five');
        addToTopFiveButton.textContent = 'Add to Top 5';
        addToTopFiveButton.addEventListener('click', () => addToTopFive(movie));
        movieBox.appendChild(addToTopFiveButton);

        genreSections.appendChild(movieBox);
    });
}

// Function to display the top 5 movies
function displayTopFive() {
    const topFiveSection = document.getElementById('top-5-section');
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];

    topFiveSection.innerHTML = '<h2 class="subtitle">Top 5</h2>'; // Reset the top 5 section

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

        // If the movie has a poster, create an img element and append it to the movieBox
        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster');

            movieBox.appendChild(imgElement);
        }

        // Remove from Top 5 button
        const removeFromTopFiveButton = document.createElement('button');
        removeFromTopFiveButton.classList.add('button', 'remove-from-top-five');
        removeFromTopFiveButton.textContent = 'Remove from Top 5';
        removeFromTopFiveButton.addEventListener('click', () => removeFromTopFive(movie));
        movieBox.appendChild(removeFromTopFiveButton);

        topFiveSection.appendChild(movieBox);
    });
}

// Function to add a movie to the top 5
function addToTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    if (topFive.length < 5) {
        topFive.push(movie);
        localStorage.setItem('topFive', JSON.stringify(topFive));
        displayTopFive();
        alert(`${movie.title} has been added to the Top 5.`);
    } else {
        alert('Top 5 is already full.');
    }
}

// Function to remove a movie from the top 5
function removeFromTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    topFive = topFive.filter(m => m.title !== movie.title);
    localStorage.setItem('topFive', JSON.stringify(topFive));
    displayTopFive();
    alert(`${movie.title} has been removed from the Top 5.`);
}
