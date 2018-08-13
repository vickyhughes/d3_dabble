const margin = 50,
	width = 600,
	height = 300,
	rect_height = 10;
let circles;
let xScale, cScale;

// create d3 SVG element that will be appended to the chart div
const svg = d3
	.select("#chart")
	.append("svg")
	.attr("width", width + "px")
	.attr("height", height + "px");

d3.csv("recipes2018.csv", function(error, ingredients) {
	// console.log(ingredients);

	// sort by row num for the animation appearance
	ingredients = ingredients.sort(function(x, y) {
		return d3.ascending(x.Number, y.Number);
	});

	xMinMax = d3.extent(ingredients, function(d) {
		// extent returns min and max
		return parseFloat(d.co2); // change from strings to numbers
	});

	xMax = parseInt(Math.ceil(xMinMax[1]));

	yMinMax = d3.extent(ingredients, function(d) {
		// extent returns min and max
		return parseFloat(d.Number); // change from strings to numbers
	});

	yMax = parseInt(Math.ceil(yMinMax[1]));

	xScale = d3
		.scaleLinear()
		.domain([0, xMax]) // input values.
		.range([margin, width - margin]); // output values

	yScale = d3
		.scaleLinear()
		.domain([0, yMax]) // input values.
		.range([margin, height - margin - 2 * rect_height]); // output values

	cScale = d3
		.scaleOrdinal()
		.domain([4, 6])
		.range(["#333", "#ff6600"]);

	circles = svg
		.selectAll(".co2") // class doesn't exist yet but go with it
		.data(ingredients)
		.enter() // for every object entering the stage, do stuff with it
		.append("rect")
		.attr("class", "co2") // attach class to circles
		.attr("width", function(d) {
			return xScale(d.co2);
		})
		.attr("y", function(d) {
			return yScale(d.Number);
		})
		.attr("x", margin)
		.attr("height", rect_height)
		.attr("fill", function(d) {
			return cScale(d.Serves);
		})
		.style("opacity", function(d) {
			return d.Serves == 6 ? 1 : 0.5; // 1 = 100%
		})
		.on("mouseover", function(d) {
			html = d.co2;
			d3
				.select("#tooltip")
				.style("left", d3.event.pageX)
				.style("top", d3.event.pageY)
				.html(html) // give this div some html
				.style("opacity", 0.85);
		});

	// define an axis
	xAxis = d3
		.axisBottom(xScale)
		.tickValues([0, xMax])
		.tickFormat(d3.format("d")); // integers displayed not decimals

	xAxisG = svg
		.append("g") // g is a group
		.attr("id", "xAxis") // name it
		.attr("class", "axis"); // can use same for x and y

	// now we have to make it occur
	xAxisG
		.call(xAxis)
		.attr("transform", "translate(0," + (height - margin) + ")"); // put it at the bottom

	yAxis = d3
		.axisLeft(yScale)
		.tickValues([0, yMax])
		.tickFormat(d3.format("d")); // integers displayed not decimals

	yAxisG = svg
		.append("g") // g is a group
		.attr("id", "yAxis") // name it
		.attr("class", "axis"); // can use same for x and y

	// now we have to make it occur
	yAxisG.call(yAxis).attr("transform", "translate(" + margin + ",0)");

	update();
});

// animation, appear one by one
function update() {
	circles
		.transition()
		.delay(function(d, i) {
			// data and index num
			return i * 50;
		})
		.attr("height", function(d) {
			return rect_height;
		});
}
