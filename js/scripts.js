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
		catagories: movie.Categories,
		year: movie.movie_year,
		rating: movie.imdb_rating,
		ytLink: `https://www.youtube.com/watch?v=${movie.ytid}`
	};
});

// create array for movies
var movieArray = [];

// append all movies to the page
var moviesFragment = document.createDocumentFragment();

// function: return part of movies in the fragment
var appendMoviesToFragment = function(movie) {
	var newElMovieTemplate = elMovieTemplate.cloneNode(true);

	newElMovieTemplate.querySelector('.movie').title = movie.title;
	newElMovieTemplate.querySelector('.movie__title').textContent = movie.title;
	newElMovieTemplate.querySelector('.movie__year').textContent = movie.year;
	newElMovieTemplate.querySelector('.movie__rating').textContent = movie.rating;
	newElMovieTemplate.querySelector('.movie__catagory').textContent = movie.catagories.split('|');
	newElMovieTemplate.querySelector('.movie__catagory').title = movie.catagories;
	newElMovieTemplate.querySelector('.movie__youtube-link').href = movie.ytLink;

	return newElMovieTemplate;
}

//***************************CATAGORIES**************************//
// sorted catagories
var selectCatagories = editedMovies.map(function(movie) {
	return movie.catagories.split('|');
});

var allCatagories = [];
selectCatagories.forEach(function(catagory) {
	for(var cat of catagory) {
		allCatagories.push(cat);
	}
});
allCatagories.sort();

// get all catagories from movies and delete duplicate ones, return only pure catagories
deleteDuplicatCatagory(allCatagories).forEach(function(catagory) {
	var elNewOption = document.createElement('option');
	elNewOption.value = catagory;
	elNewOption.textContent = catagory;

	elCatagories.append(elNewOption);
});


//**************************SEARCH**************************//
elForm.addEventListener('submit', function(evt) {
	evt.preventDefault();

	movieArray = editedMovies.slice();

	// create RegEx word
	var regExpWord = new RegExp(elSearch.value.trim(), 'gi');

	// Array: matched movies by search key
	movieArray = movieArray.filter(function(movie) {
		return movie.title.match(regExpWord);
	});

	// select catagory
	if(Boolean(elCatagories.value)) {
		var selectedCatagoryRegExp =  new RegExp(elCatagories.value, 'gi');

		movieArray = movieArray.filter(function(movie) {
			return movie.catagories.match(selectedCatagoryRegExp);
		});
	}

	// select sort [year, rating]
	if(Boolean(elSort.value)) {
		movieArray = movieArray.sort(function(a, b) {
			if(a[elSort.value] < b[elSort.value]) {
				return -1;
			}

			if(a[elSort.value] > b[elSort.value]) {
				return 1;
			}

			return 0;
		});
	}	

	// append movies to the fragment box
	movieArray.forEach(function(movie) {
		moviesFragment.append(appendMoviesToFragment(movie));
	});

	// add fragment box to the body
	elMovies.innerHTML = '';
	elMovies.append(moviesFragment);

	// count movies
	var newElAlertTemplate = elAlertTemplate.cloneNode(true);
	newElAlertTemplate.querySelector('.js-result-num').textContent = movieArray.length;
	resultNumberWrapper.innerHTML = newElAlertTemplate.firstElementChild.outerHTML;
});

// append movies to the fragment box
movieArray = editedMovies.slice();

movieArray.forEach(function(movie) {
	moviesFragment.append(appendMoviesToFragment(movie));
});

// add fragment box to the body
elMovies.append(moviesFragment);
