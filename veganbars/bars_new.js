const margin = 50,
	width = 600,
	height = 300,
	rect_height = 10;
let bars;
let xScale, cScale;

// create d3 SVG element that will be appended to the chart div
const svg = d3
	.select("#chart")
	.append("svg")
	.attr("width", width + "px")
	.attr("height", height + "px");

d3.csv("recipes2018.csv", function(error, ingredients) {
	console.log(ingredients);

	xMinMax = d3.extent(ingredients, function(d) {
		// extent returns min and max
		return parseFloat(d.co2); // change from strings to numbers
	});

	xMax = parseInt(Math.ceil(xMinMax[1]));

	yMinMax = d3.extent(ingredients, function(d) {
		// extent returns min and max
		return parseFloat(d.Number); // change from strings to numbers
	});
	console.log(yMinMax);
	yMax = parseInt(Math.ceil(yMinMax[1]));

	xScale = d3
		.scaleLinear()
		.domain([0, xMax]) // input values.
		.range([margin, width - margin]); // output values

	console.log(xMax);
	console.log(width);
	console.log(xScale);
	yScale = d3
		.scaleLinear()
		.domain([0, yMax]) // input values.
		.range([-100, 150]); // output values

	cScale = d3
		.scaleOrdinal()
		.domain([4, 6])
		.range(["#333", "#ff6600"]);

	bars = svg
		.selectAll(".co2") // class doesn't exist yet but go with it
		.data(ingredients)
		.enter() // for every object entering the stage, do stuff with it
		.append("rect")
		.attr("class", "co2") // attach class to
		.attr("width", function(d) {
			return xScale(d.co2);
		})
		.attr("y", function(d) {
			return yScale(d.Number);
		})
		.attr("x", margin + 2)
		.attr("height", function(d) {
			return (height - yMax * margin) / yMax;
		})
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
});
