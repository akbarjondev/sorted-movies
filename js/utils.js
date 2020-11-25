// functions
var $_ = function(selector, node = document) {
	return document.querySelector(selector);
}
var $$_ = function(selector, node = document) {
	return document.querySelectorAll(selector);
}

// create new element
var createElement = function(newElName, elClass, elValue) {
	var elNewEl = document.createElement(newElName);
	elNewEl.setAttribute('class', elClass);
	elNewEl.textContent = elValue;

	return elNewEl;
}

// sort by rating_asc, rating_desc 
var sortObjectRating = function(array, sortType) {
	var sortedByRating = array.sort(function(a, b) {
		if(a.rating > b.rating) {
			return 1;
		}
		if(a.rating < b.rating) {
			return -1;
		}
		return 0;
	});

	if(sortType === 'rating_desc') {
		return sortedByRating.reverse();
	}

	return sortedByRating;
}

// sort by az, za
var sortObjectName = function(array, sortType) {
	var sortByName = array.sort(function(a, b) {
		if(a.title > b.title) {
			return 1;
		}
		if(a.title < b.title) {
			return -1;
		}
		return 0;
	});

	if(sortType == 'za') {
		return sortByName.reverse();
	}

	return sortByName;
}

// sort by year_asc, year_desc
var sortObjectYear = function(array, sortType) {
	var sortByYear = array.sort(function(a, b) {
		if(a.year > b.year) {
			return 1;
		}
		if(a.year < b.year) {
			return -1;
		}
		return 0;
	});

	if(sortType == 'year_desc') {
		return sortByYear.reverse();
	}

	return sortByYear;
}