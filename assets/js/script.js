// Ensure the script runs only after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchButton').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        searchMovies();
    });

    displayWatchlist();
    displayTopFive();
});

// TMDb function to fetch data from their entire database
function searchMovies() {
    const apiKey = '441e8e76a168da10c7a3bb9b4464a698';
    const query = document.getElementById('movieSearch').value;
    const encodedQuery = encodeURIComponent(query); // encodeURIComponent was used here to encode the query string
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}&include_adult=false`;

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

// Function to create a container where movie data is displayed
function displayResults(movies) {
    const resultsSection = document.getElementById('results');

    // Only clear results if there are no movies found
    if (movies.length === 0) {
        clearResults();
        return;
    }

    // Maximum number of movies to display
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
        });

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);
        movieBox.appendChild(addToWatchlistButton);

        // Fetch and display main poster image for the movie
        if (movie.poster_path) {
            fetchPosterImage(movie.poster_path, movieBox);
        } else {
            displayDefaultImage(movieBox);
        }

        // Fetch and display ratings for the movie using the split method and grabbing the first item in the array
        getMovieRatings(movie.title, movie.release_date ? movie.release_date.split('-')[0] : null, movieBox);

        resultsSection.appendChild(movieBox);
    }
}

function fetchPosterImage(posterPath, movieBox) {
    const imageUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Movie Poster';
    imgElement.classList.add('poster');

    // Append the poster image to the movie box
    movieBox.appendChild(imgElement);
}

function displayDefaultImage(movieBox) {
    const defaultImageUrl = './assets/img/default poster image.jpg'; // Path to your default image
    const imgElement = document.createElement('img');
    imgElement.src = defaultImageUrl;
    imgElement.alt = 'Default Movie Poster';
    imgElement.classList.add('poster');

    // Append the default image to the movie box
    movieBox.appendChild(imgElement);
}

function getMovieRatings(title, year, movieBox) {
    // OMDb API key
    const apiKey = '311fbec3';
    const omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${title}&y=${year}`;

    // Fetching data from the OMDb
    fetch(omdbUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === "True") {
                // Display ratings only
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
                // Display error message for ratings but keep the movie displayed
                const ratingErrorElement = document.createElement('p');
                ratingErrorElement.textContent = 'Ratings not available';
                movieBox.appendChild(ratingErrorElement);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Display error message for ratings but keep the movie displayed
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
    alert(`${movie.title} has been added to your watchlist.`);
}

// Function that clears previous search results
function clearResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = ''; 
}

// Error message function
function displayErrorMessage(message) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = `<p>${message}</p>`;
}

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

    // Iterate through each movie in the top 5 list and create elements to display them
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
    } 
}

// Function to remove a movie from the top 5
function removeFromTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    topFive = topFive.filter(m => m.title !== movie.title);
    localStorage.setItem('topFive', JSON.stringify(topFive));
    displayTopFive();
}
