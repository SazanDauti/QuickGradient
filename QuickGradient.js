(function() {
	// Get Gradient Elements
	var elements = document.querySelectorAll("[SDGradientColors]");

	for (var i = 0; i < elements.length; i++) {
		processGradient(elements[i]);
	}

})();

function processGradient(el) {
	var gradientColors = el.getAttribute("SDGradientColors");
	var gradientColorsArray = gradientColors.split(",");
	var gradientLocationsArray = processGradientLocations(el, gradientColorsArray);

	var gradientDirection = el.hasAttribute("SDGradientDirection") ? el.getAttribute("SDGradientDirection") : "vertical";


	var css = gradientCSS(gradientColorsArray, gradientLocationsArray, gradientDirection);

	console.log(css);
	el.setAttribute("style", el.getAttribute("style") + css);
}

function processGradientLocations(el, gradientColorsArray) {
	var gradientLocations;
	var gradientLocationsArray;

	if (el.hasAttribute("SDGradientLocations")) {
		gradientLocations = el.getAttribute("SDGradientLocations");
		gradientLocationsArray = gradientLocations.split(",");

		if (gradientLocationsArray.length != gradientColorsArray.length) {
			return defaultGradientLocations(el, gradientColorsArray);
		}

		return gradientLocationsArray;
	}
	
	return defaultGradientLocations(el, gradientColorsArray);
}

function defaultGradientLocations(el, gradientColorsArray) {
	var num = 100/gradientColorsArray.length;
	var gradientLocationsArray = [];

	for (var i = 0; i < gradientColorsArray.length; i++) {
		gradientLocationsArray.push(num * i);
	}

	return gradientLocationsArray;
}

function gradientCSS(gradientColorsArray, gradientLocationsArray, direction) {
	var filler1 = "top";
	var filler2 = "to bottom";
	var filler3 = "1";

	if (direction === "vertical") {
		filler1 = "top";
		filler2 = "to bottom";
		filler3 = "0";
	} else if (direction === "horizontal") {
		filler1 = "left";
		filler2 = "to right";
	} else if (direction === "diagonal1") {
		filler1 = "-45deg";
		filler2 = "135deg";
	} else if (direction === "diagonal2") {
		filler1 = "45deg";
		filler2 = "45deg";
	} else if (direction === "radial") {
		filler1 = "center, ellipse cover";
		filler2 = "ellipse at center";
	}

	return generateCSS(gradientColorsArray, gradientLocationsArray, filler1, filler2, filler3);
}

function generateCSS(gradientColorsArray, gradientLocationsArray, filler1, filler2, filler3) {
	var allCSS = "background: " + gradientColorsArray[0] + ";";

	var mozCSS = "background: -moz-linear-gradient(" + filler1 + ", ";
	var webkitCSS = "background: -webkit-linear-gradient(" + filler1 + ", ";
	var otherCSS = "background: linear-gradient(" + filler2 + ", ";

	for (var i = 0; i < gradientColorsArray.length; i++) {
		var internals = gradientColorsArray[i].trim() + " " + gradientLocationsArray[i] + "%,";

		mozCSS += internals;
		webkitCSS += internals;
		otherCSS += internals;
	}

	mozCSS = mozCSS.slice(0, -1) + ");";
	webkitCSS = webkitCSS.slice(0, -1) + ");";
	otherCSS = otherCSS.slice(0, -1) + ");";

	var fallback = "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='" + gradientColorsArray[0].trim() + "', endColorstr='" + gradientColorsArray[gradientColorsArray.length - 1].trim() + "',GradientType=" + filler3 + " );";
 
	allCSS += mozCSS + webkitCSS + otherCSS + fallback;

	return allCSS;
}


