// Ensure the script runs only after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    displayWatchlist();
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

        genreSections.appendChild(movieBox);
    });
}