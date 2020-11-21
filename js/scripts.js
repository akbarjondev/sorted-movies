// functions
var $_ = function(selector, node = document) {
	return document.querySelector(selector);
}
var $$_ = function(selector, node = document) {
	return document.querySelectorAll(selector);
}

// variables
var elForm = $_('.js-form');
var elSearch = $_('.js-search', elForm);
var elCatagories = $_('.js-catagories', elForm);
var elSort = $_('.js-sort', elForm);

// movies box
var elMovies = $_('.movies');
var elMovieTemplate = $_('#movie-template').content;
var elAlertTemplate = $_('#alert-template').content;
var resultNumberWrapper = $_('.result-number-wrapper');

// clean movies object
var editedMovies = movies.map(function(movie) {
	return {
		title: movie.Title.toString(),
		year: movie.movie_year,
		rating: movie.imdb_rating,
		ytLink: `https://www.youtube.com/watch?v=${movie.ytid}`
	};
});

// append all movies to the page
var moviesFragment = document.createDocumentFragment();

// function: return part of movies in the fragment
var appendMoviesToFragment = function(movie) {
	var newElMovieTemplate = elMovieTemplate.cloneNode(true);

	newElMovieTemplate.querySelector('.movie').title = movie.title;
	newElMovieTemplate.querySelector('.movie__title').textContent = movie.title;
	newElMovieTemplate.querySelector('.movie__year').textContent = movie.year;
	newElMovieTemplate.querySelector('.movie__rating').textContent = movie.rating;
	newElMovieTemplate.querySelector('.movie__youtube-link').href = movie.ytLink;

	return newElMovieTemplate;
}

// append movies to the fragment box
editedMovies.forEach(function(movie) {
	moviesFragment.append(appendMoviesToFragment(movie));
});

// add fragment box to the body
elMovies.append(moviesFragment);


//*******************SEARCH**************************//
elForm.addEventListener('submit', function(evt) {
	evt.preventDefault();

	elMovies.innerHTML = '';
	
	// create RegEx word
	var regExpWord = new RegExp(elSearch.value.trim(), 'gi');

	// Array: matched movies by search key
	var matchedMoviesWithSearch = editedMovies.filter(function(movie) {
		return movie.title.match(regExpWord);
	});

	// append movies to the fragment box
	matchedMoviesWithSearch.forEach(function(movie) {
		moviesFragment.append(appendMoviesToFragment(movie));
	});

	// add fragment box to the body
	elMovies.append(moviesFragment);

	var newElAlertTemplate = elAlertTemplate.cloneNode(true);
	newElAlertTemplate.querySelector('.js-result-num').textContent = matchedMoviesWithSearch.length;
	resultNumberWrapper.innerHTML = newElAlertTemplate.firstElementChild.outerHTML;
});
