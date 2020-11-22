// functions
var $_ = function(selector, node = document) {
	return document.querySelector(selector);
}
var $$_ = function(selector, node = document) {
	return document.querySelectorAll(selector);
}

// get all catagories from movies and delete duplicate ones, return only pure catagories
var deleteDuplicatCatagory = function(catagoryArray) {
	var cleanCatagories = [];
	var firstCatagory = null;
	
	for(var nextCatagory of catagoryArray) {
		if(firstCatagory === nextCatagory) {
			continue;
		} else {
			firstCatagory = nextCatagory;
			cleanCatagories.push(nextCatagory);
		}
	}

	return cleanCatagories;
}
