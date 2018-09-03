// Objective: Build a CodePen.io app that is functionally similar to this: https://codepen.io/freeCodeCamp/full/KaNGNR.
// Fulfill the below user stories and get all of the tests to pass. Give it your own personal style.
// You can use HTML, JavaScript, CSS, and the D3 svg-based visualization library. The tests require axes to be generated
// using the D3 axis property, which automatically generates ticks along the axis. These ticks are required for passing
// the D3 tests because their positions are used to determine alignment of graphed elements. You will find information
// about generating axes at https://github.com/d3/d3/blob/master/API.md#axes-d3-axis. Required (non-virtual) DOM elements
// are queried on the moment of each test. If you use a frontend framework (like Vue for example), the test rootults may
// be inaccurate for dynamic content. We hope to accommodate them eventually, but these frameworks are not currently supported
// for D3 projects.
// User Story #1: My tree map should have a title with a corrootponding id="title".
// User Story #2: My tree map should have a description with a corrootponding id="description".
// User Story #3: My tree map should have rect elements with a corrootponding class="tile" that reprootent the data.
// User Story #4: There should be at least 2 different fill colors used for the tiles.
// User Story #5: Each tile should have the properties data-name, data-category, and data-value containing their
// corresponding name, category, and value.
// User Story #6: The area of each tile should corrootpond to the data-value amount: tiles with a larger data-value
// should have a bigger area.
// User Story #7: My tree map should have a legend with corrootponding id="legend".
// User Story #8: My legend should have rect elements with a corrootponding class="legend-item".
// User Story #9: The rect elements in the legend should use at least 2 different fill colors.
// User Story #10: I can mouse over an area and see a tooltip with a corrootponding id="tooltip" which displays more
// information about the area.
// User Story #11: My tooltip should have a data-value property that corrootponds to the data-value of the active area.
// For this project you can use any of the following datasets:
// 	Kickstarter Pledges: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json
// 	Movie Sales: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json
// 	Video Game Sales: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json
// You can build your project by forking this CodePen pen. Or you can use this CDN link to run the tests in any environment you like:
// https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js
// Once you're done, submit the URL to your working project with all its tests passing.
// Remember to use the Read-Search-Ask method if you get stuck.

document.addEventListener("DOMContentLoaded", function() {
	const URL =
		"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";

	const d3 = require("d3");

	/*------------Size---------------*/
	//Margins
	const mg = { t: 70, b: 90, r: 30, l: 70 };
	//Diag
	const dia = [1000, 600];
	//SVG
	const s = {
		h: mg.t + dia[1] + mg.b,
		w: mg.l + dia[0] + mg.r
	};
	//COLORBREWER
	const clr = [
		"#ffffd9",
		"#edf8b1",
		"#c7e9b4",
		"#7fcdbb",
		"#41b6c4",
		"#1d91c0",
		"#225ea8",
		"#253494",
		"#081d58"
	];

	/*-------------SVG--------------*/
	let svg = d3
		.select("main")
		.append("svg")
		.attr("height", s.h)
		.attr("width", s.w);

	let sel = svg
		.append("g")
		.attr("x", mg.l)
		.attr("y", mg.t)
		.attr("height", dia[0])
		.attr("width", dia[1]);
	//.attr("class", "diagram");

	/*----------Tooltip------------*/
	let tooltipDiv = d3
		.select("body")
		.append("div")
		.style("opacity", 0)
		.attr("id", "tooltip")
		.attr("data-value", 0)
		.attr("class", "mytooltip");

	/*--------Functions to process data and draw diagrams---------*/
	const generateColorScale = (arr) => {
		let dmn = arr.reduce((acc, obj) => {
			if (obj.depth !== 0 && obj.height > 0 && !acc.includes(obj.data.name)) {
				acc.push(obj.data.name);
			}
			return acc;
		}, []);
		return dmn;
	};

	const processData = (data) => {
		const root = d3.hierarchy(data);
		root.sum((d) => d.value).sort((a, b) => b.value - a.value);
		const treeLayout = d3.treemap();
		treeLayout.size(dia);
		return treeLayout(root);
	};

	const drawDiagram = (arr, sl, tlt, color) => {
		console.log(arr);
		sl.selectAll("rect")
			.data(arr)
			.enter()
			.append("rect")
			.attr("x", (d) => d.x0)
			.attr("y", (d) => d.y0)
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.attr("class", "tile")
			.attr("data-name", (d) => d.data.name)
			.attr(
				"data-category",
				(d) => (d.height === 0 ? d.data.category : d.data.name)
			)
			.attr("data-value", (d) => d.value)
			.attr("fill", (d) =>
				d3.interpolateSinebow(
					color(d.height === 0 ? d.data.category : d.data.name)
				)
			)
			.on("mouseover", (d) => {
				tlt
					.html(
						`Name: ${d.data.name}</br>Category: ${d.data.category}</br>Value:${
							d.data.value
						}`
					)
					.attr("data-value", d.value)
					.style("left", d3.event.pageX + 10 + "px")
					.style("top", d3.event.pageY - 20 + "px");
				tlt
					.transition()
					.duration(100)
					.style("opacity", 0.9);
			})
			.on("mouseout", () => {
				tlt
					.transition()
					.duration(300)
					.style("opacity", 0);
			});
	};

	d3.json(URL).then((data) => {
		const layout = processData(data);
		let dataArray = layout.descendants();
		let color = d3
			.scaleLinear()
			.domain(generateColorScale(dataArray))
			.range([0, 1]);
		console.log();
		drawDiagram(dataArray, sel, tooltipDiv, color);
	});

	// 	d3.json(
	// 		"https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
	// 	).then((geo) => {
	// 		console.log(data);
	// 		console.log(geo);
	// 		//Margins
	// 		const mg = { t: 70, b: 90, r: 30, l: 70 };
	// 		//Diag
	// 		const d = {
	// 			h: 600,
	// 			w: 1000
	// 		};
	// 		//SVG
	// 		const s = {
	// 			h: mg.t + d.h + mg.b,
	// 			w: mg.l + d.w + mg.r,
	// 			i: "svg-canvas"
	// 		};
	// 		//COLORBREWER
	// 		const clr = [
	// 			"#ffffd9",
	// 			"#edf8b1",
	// 			"#c7e9b4",
	// 			"#7fcdbb",
	// 			"#41b6c4",
	// 			"#1d91c0",
	// 			"#225ea8",
	// 			"#253494",
	// 			"#081d58"
	// 		];
	// 		//Legend rect
	// 		const lg = { h: 15, w: 50 };
	// 		/*----------Color scale------------*/
	// 		const color = d3
	// 			.scaleQuantize()
	// 			.domain([
	// 				d3.min(data, (d) => d.bachelorsOrHigher),
	// 				d3.max(data, (d) => d.bachelorsOrHigher)
	// 			])
	// 			.range(clr);
	// 		/*----------Tooltip------------*/
	// 		const tooltipParse = (id) => {
	// 			let data = findData(id);
	// 			return `${data.area_name}, ${data.state}: ${data.bachelorsOrHigher}%`;
	// 		};
	// 		let tooltipDiv = d3
	// 			.select("body")
	// 			.append("div")
	// 			.style("opacity", 0)
	// 			.attr("id", "tooltip")
	// 			.attr("class", "mytooltip")
	// 			.attr("data-education", 0);
	// 		/*----------Map------------*/
	// 		const findData = (id) => {
	// 			let tmp = {};
	// 			data.forEach((obj) => {
	// 				if (obj.fips === id) tmp = { ...obj };
	// 			});
	// 			return tmp;
	// 		};
	// 		let path = d3.geoPath();
	// 		const svg = d3
	// 			.select("main")
	// 			.append("svg")
	// 			.attr("height", s.h)
	// 			.attr("width", s.w);
	// 		const map = svg
	// 			.append("g")
	// 			.attr("transform", `translate(${mg.l},${mg.t})`);
	// 		map
	// 			.selectAll("path")
	// 			.data(topojson.feature(geo, geo.objects.counties).featuroot)
	// 			.enter()
	// 			.append("path")
	// 			.attr("d", path)
	// 			.attr("class", "county")
	// 			.attr("fill", (d) => color(findData(d.id).bachelorsOrHigher))
	// 			.style("stroke", "black")
	// 			.style("stroke-width", "0.2")
	// 			.attr("data-fips", (d) => findData(d.id).fips)
	// 			.attr("data-education", (d) => findData(d.id).bachelorsOrHigher)
	// 			.on("mouseover", (d) => {
	// 				let id = d.id;
	// 				tooltipDiv
	// 					.html(tooltipParse(id))
	// 					.attr("data-education", findData(id).bachelorsOrHigher)
	// 					.style("left", d3.event.pageX + 10 + "px")
	// 					.style("top", d3.event.pageY - 20 + "px");
	// 				tooltipDiv
	// 					.transition()
	// 					.duration(100)
	// 					.style("opacity", 0.9);
	// 			})
	// 			.on("mouseout", () => {
	// 				tooltipDiv
	// 					.transition()
	// 					.duration(300)
	// 					.style("opacity", 0);
	// 			});
	// 		map
	// 			.append("path")
	// 			.datum(topojson.mesh(geo, geo.objects.states, (a, b) => a !== b))
	// 			.attr("class", "states")
	// 			.attr("d", path);
	// 		/*----------Legend------------*/
	// 		const legend = svg.append("g").attr("id", "legend");
	// 		legend
	// 			.selectAll("rect")
	// 			.data(clr)
	// 			.enter()
	// 			.append("rect")
	// 			.attr("x", (d, i) => i * lg.w)
	// 			.attr("height", lg.h)
	// 			.attr("width", lg.w)
	// 			.attr("fill", (d) => d)
	// 			.attr("stroke", "black")
	// 			.style("stroke-width", "0.2");
	// 		//Legend scale
	// 		const lgSc = d3
	// 			.scaleLinear()
	// 			.domain(color.domain())
	// 			.range([0, lg.w * clr.length]);
	// 		const tickVals = color.range().reduce((acc, d, i) => {
	// 			let tmp = color.invertExtent(d);
	// 			acc.push(tmp[0]);
	// 			if (i === color.range().length - 1) acc.push(tmp[1]);
	// 			return acc;
	// 		}, []);
	// 		//Legend axis
	// 		const lgAxis = d3
	// 			.axisBottom(lgSc)
	// 			.tickFormat(d3.format(".1f"))
	// 			.tickValues(tickVals)
	// 			.tickFormat((n) => n.toFixed(1) + "%");
	// 		//.tickFormat((n) => Math.round((n + 0.00001) * 100) / 100 + "%");
	// 		legend
	// 			.append("g")
	// 			.call(lgAxis)
	// 			.attr("id", "lg-axis")
	// 			.attr("transform", `translate(0,${lg.h})`);
	// 		//Positioning legend
	// 		legend.attr(
	// 			"transform",
	// 			`translate(${mg.l +
	// 				(d.w - legend.node().getBoundingClientRect().width) / 2},${mg.t})`
	// 		);
	// 		/*----------Title + Description------------*/
	// 		const title = svg
	// 			.append("text")
	// 			.attr("id", "title")
	// 			.text("United States Educational Attainment");
	// 		const description = svg
	// 			.append("text")
	// 			.attr("id", "description")
	// 			.html(
	// 				"Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
	// 			);
	// 		//Centering title and description in top margin
	// 		title
	// 			.attr(
	// 				"x",
	// 				mg.l + d.w / 2 - title.node().getBoundingClientRect().width / 2
	// 			)
	// 			.attr("y", title.node().getBoundingClientRect().height / 2 + 20);
	// 		description
	// 			.attr(
	// 				"x",
	// 				mg.l + d.w / 2 - description.node().getBoundingClientRect().width / 2
	// 			)
	// 			.attr(
	// 				"y",
	// 				title.node().getBoundingClientRect().height +
	// 					description.node().getBoundingClientRect().height +
	// 					10
	// 			);
	// 	});
	// });
});
