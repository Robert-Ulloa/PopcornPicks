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

function searchMovies() {
    const apiKey = '441e8e76a168da10c7a3bb9b4464a698';
    const query = document.getElementById('movieSearch').value;
    // research more into encodeURIcomponet and how it pertains to query for presentaion
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

function displayResults(movies) {
    const resultsSection = document.getElementById('results');
    const modal = document.querySelector('#modal');
    const modalClose = modal.querySelector('.modal-close');

    clearResults();

    const maxMovies = Math.min(movies.length, 9);
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
        getMovieRatings(movie.title, movie.release_date ? movie.release_date.split('-')[0] : null, movieBox);

        resultsSection.appendChild(movieBox);

        modalClose.addEventListener('click' , hideModal);
        modal.addEventListener('click', function(event){

            if(event.target === modal)
                hideModal();
        }
    
    )};
}
function showModal(){
const modal =document.querySelector('#modal');
    modal.classList.add('is-active');
}
function hideModal(){
    const modal = document.querySelector('#modal');
    modal.classList.remove('is-active');
}

function fetchPosterImage(posterPath, movieBox) {
    // be able to describe where i got this from and what it means(travis)
    const imageUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Movie Poster';
    imgElement.classList.add('poster');
    movieBox.appendChild(imgElement);
}

function displayDefaultImage(movieBox) {
    const defaultImageUrl = './assets/img/default poster image.jpg';
    const imgElement = document.createElement('img');
    imgElement.src = defaultImageUrl;
    imgElement.alt = 'Default Movie Poster';
    imgElement.classList.add('poster');
    movieBox.appendChild(imgElement);
}

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

function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    // removed alert for adding too watchlist
}

function clearResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = '';
}

function displayErrorMessage(message) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = `<p>${message}</p>`;
}

function displayWatchlist() {
    const genreSections = document.getElementById('genre-sections');
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
            movieBox.remove();
            addToTopFive(movie);
        });

        movieBox.appendChild(addToTopFiveButton);
        genreSections.appendChild(movieBox);
    });
}

function displayTopFive() {
    const topFiveSection = document.getElementById('top-5-section');
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];

    console.log('Loaded topFive:', topFive); // Debugging line

    topFiveSection.innerHTML = '<h2 class="subtitle">Top 5</h2>';

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
        removeFromTopFiveButton.textContent = 'Remove from Top 5';
        removeFromTopFiveButton.addEventListener('click', () => removeFromTopFive(movie));
        movieBox.appendChild(removeFromTopFiveButton);

        topFiveSection.appendChild(movieBox);
    });
}

function addToTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    if (topFive.length < 5) {
        topFive.push(movie);
        localStorage.setItem('topFive', JSON.stringify(topFive));
        displayTopFive();
    }
}

function removeFromTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    topFive = topFive.filter(m => m.title !== movie.title);
    localStorage.setItem('topFive', JSON.stringify(topFive));
    displayTopFive();
}
