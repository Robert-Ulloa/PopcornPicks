// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function (event) {
            event.preventDefault();
            searchMovies();
        });
    }

    displayWatchlist();
    displayTopFive();
});
// Function to search for movies using TMDB API
function searchMovies() {
    const apiKey = '441e8e76a168da10c7a3bb9b4464a698';
    const query = document.getElementById('movieSearch').value;
// encodeURIComponent ensures the query is properly formatted for a URL
    const encodedQuery = encodeURIComponent(query);
    // reasearch more into the paramters of this api call
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}`;

    clearResults();

    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.results.length > 0) {
                displayResults(data.results);
            } else {
                console.error('No movies found');
                displayErrorMessage('No movies found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Failed to fetch movies');
        });
}
// Function to display search results
function displayResults(movies) {
    const resultsSection = document.getElementById('results');
    const modal = document.querySelector('#modal');
    const modalClose = modal.querySelector('.modal-close');

    clearResults();

    const maxMovies = Math.min(movies.length, 10);
    for (let i = 0; i < maxMovies; i++) {
        const movie = movies[i];
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        const addToWatchlistButton = document.createElement('button');
        addToWatchlistButton.textContent = 'Add to Watchlist';
        addToWatchlistButton.addEventListener('click', function () {
            addToWatchlist(movie);
            showModal();
        });

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);
        movieBox.appendChild(addToWatchlistButton);

        if (movie.poster_path) {
            fetchPosterImage(movie.poster_path, movieBox);
        } else {
            displayDefaultImage(movieBox);
        }
        // be able to describe where i got this from and what it means(travis)
        // Fetch movie ratings from OMDB API
        getMovieRatings(movie.title, movie.release_date ? movie.release_date.split('-')[0] : null, movieBox);

        resultsSection.appendChild(movieBox);

        modalClose.addEventListener('click' , hideModal);
        modal.addEventListener('click', function(event){

            if(event.target === modal)
                hideModal();
        }
    
    )};
}
// Modal
function showModal(){
const modal =document.querySelector('#modal');
    modal.classList.add('is-active');

    setTimeout(() =>{

        hideModal();
    },1000);

}
// Function to hide modal after 1000ms
function hideModal(){
    const modal = document.querySelector('#modal');
    modal.classList.remove('is-active');
}
// Function to fetch and display movie poster
function fetchPosterImage(posterPath, movieBox) {
    // be able to describe where i got this from and what it means(travis)
    const imageUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Movie Poster';
    imgElement.classList.add('poster');
    movieBox.appendChild(imgElement);
}
// Function to display a default image if no poster is available
function displayDefaultImage(movieBox) {
    const defaultImageUrl = './assets/img/default poster image.jpg';
    const imgElement = document.createElement('img');
    imgElement.src = defaultImageUrl;
    imgElement.alt = 'Default Movie Poster';
    imgElement.classList.add('poster');
    movieBox.appendChild(imgElement);
}
// Function to get movie ratings from OMDB API
function getMovieRatings(title, year, movieBox) {
    const apiKey = '311fbec3';
    const omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${title}&y=${year}`;

    fetch(omdbUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === "True") {
                const ratings = data.Ratings;
                const ratingsDiv = document.createElement('div');
                ratingsDiv.classList.add('ratings');

                ratings.forEach(rating => {
                    const ratingElement = document.createElement('p');
                    ratingElement.textContent = `${rating.Source}: ${rating.Value}`;
                    ratingsDiv.appendChild(ratingElement);
                });

                movieBox.appendChild(ratingsDiv);
            } else {
                console.error('Error:', data.Error);
                const ratingErrorElement = document.createElement('p');
                ratingErrorElement.textContent = 'Ratings not available';
                movieBox.appendChild(ratingErrorElement);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const ratingErrorElement = document.createElement('p');
            ratingErrorElement.textContent = 'Failed to fetch ratings';
            movieBox.appendChild(ratingErrorElement);
        });
}
// Function to add a movie to the watchlist
function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    // removed alert for adding too watchlist
}
// Function to clear search results
function clearResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = '';
}
// Function to display error message
function displayErrorMessage(message) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = `<p>${message}</p>`;
}