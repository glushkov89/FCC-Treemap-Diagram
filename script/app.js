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
	//"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
	//"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

	const d3 = require("d3");

	/*------------Size---------------*/
	//Margins
	const mg = { t: 70, b: 90, r: 30, l: 30 };
	//Diag
	const dia = [1650, 650];
	//SVG
	const s = {
		h: mg.t + dia[1] + mg.b,
		w: mg.l + dia[0] + mg.r
	};
	//Legend
	const lgnd = { rec: 20, mgt: 5, mgl: 5, w: 150 };
	//Color
	const color = d3.schemePaired.concat(d3.schemeDark2);

	/*-------------SVG--------------*/
	let svg = d3
		.select("main")
		.append("svg")
		.attr("height", s.h)
		.attr("width", s.w);

	let sel = svg
		.append("g")
		.attr("transform", (d) => `translate(${mg.l},${mg.t})`)
		.attr("height", dia[0])
		.attr("width", dia[1]);

	let legend = svg
		.append("g")
		.attr("id", "legend")
		.attr("height", lgnd.mgt * 2 + lgnd.rec)
		.attr("transform", (d) => `translate(${mg.l},${mg.t + dia[1]})`);

	/*----------Tooltip------------*/
	let tooltipDiv = d3
		.select("body")
		.append("div")
		.style("opacity", 0)
		.attr("id", "tooltip")
		.attr("data-value", 0)
		.attr("class", "mytooltip");

	/*--------Functions to process data and draw diagrams---------*/
	const generateCategoryList = (arr) => {
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

	//From http://bl.ocks.org/mundhradevang/1387786 (adjusted)
	function fontSize(d) {
		if (d.height === 0) {
			var size = (d.x1 - d.x0) / 5;
			var words = d.data.name.split(" ");
			var word = words[0];
			var width = d.x1 - d.x0;
			var height = d.y1 - d.y0;
			d3.select(this)
				.style("font-size", size + "px")
				.text(word);
			while (
				(this.getBBox().width >= width || this.getBBox().height >= height) &&
				size > 12
			) {
				size--;
				d3.select(this).style("font-size", size + "px");
				this.firstChild.data = word;
			}
		}
	}

	//From http://bl.ocks.org/mundhradevang/1387786 (adjusted)
	function wordWrap(d) {
		if (d.height === 0) {
			var words = d.data.name.split(" ");
			//	console.log(words);
			var line = new Array();
			var length = 0;
			var text = "";
			var width = d.x1 - d.x0;
			var height = d.y1 - d.y0;
			var word;
			do {
				word = words.shift();
				line.push(word);
				if (words.length)
					this.firstChild.data = line.join(" ") + " " + words[0];
				else this.firstChild.data = line.join(" ");
				length = this.getBBox().width;
				if (length < width && words.length) {
				} else {
					text = line.join(" ");
					this.firstChild.data = text;
					if (this.getBBox().width > width) {
						text = d3
							.select(this)
							.select(function() {
								return this.lastChild;
							})
							.text();
						text = text + "...";
						d3.select(this)
							.select(function() {
								return this.lastChild;
							})
							.text(text);
						d3.select(this).classed("wordwrapped", true);
						break;
					} else;

					if (text != "") {
						d3.select(this)
							.append("svg:tspan")
							.attr("x", 0)
							.attr("dx", "0.15em")
							.attr("dy", "0.9em")
							.text(text);
					} else;

					if (this.getBBox().height > height && words.length) {
						text = d3
							.select(this)
							.select(function() {
								return this.lastChild;
							})
							.text();
						text = text + "...";
						d3.select(this)
							.select(function() {
								return this.lastChild;
							})
							.text(text);
						d3.select(this).classed("wordwrapped", true);

						break;
					} else;

					line = new Array();
				}
			} while (words.length);
			this.firstChild.data = "";
		}
	}

	const drawDiagram = (arr, categ, sl, tlt, clr) => {
		let groups = sl
			.selectAll("rect")
			.data(arr)
			.enter()
			.append("g")
			.attr("transform", (d) => `translate(${d.x0},${d.y0})`);

		groups
			.append("rect")
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.attr("class", "tile")
			.style("stroke", "white")
			.attr(
				"fill",
				(d) =>
					clr[categ.indexOf(d.height === 0 ? d.data.category : d.data.name)]
			)
			.attr("data-name", (d) => d.data.name)
			.attr(
				"data-category",
				(d) => (d.height === 0 ? d.data.category : d.data.name)
			)
			.attr("data-value", (d) => d.value)
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

		groups
			.append("text")
			.attr("dx", 4)
			.attr("dy", 15)
			.each(fontSize)
			.each(wordWrap);
	};

	const generateTitleDescription = (sv, d) => {
		let ttl = "",
			dscr = "";
		switch (d) {
			case "Movies":
				ttl = "Movie Sales";
				dscr = "Top 100 Highest Grossing Movies Grouped By Genre";
				break;
			case "Kickstarter":
				ttl = "Kickstarter Pledges";
				dscr = "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category";
				break;
			case "Video Game Sales Data Top 100":
				ttl = "Video Game Sales";
				dscr = "Top 100 Most Sold Video Games Grouped by Platform";
				break;
			default:
				break;
		}
		const title = sv
			.append("text")
			.attr("id", "title")
			.text(ttl);
		const description = sv
			.append("text")
			.attr("id", "description")
			.html(dscr);
		//Centering title and description in top margin
		title
			.attr(
				"x",
				mg.l + dia[0] / 2 - title.node().getBoundingClientRect().width / 2
			)
			.attr("y", -(title.node().getBoundingClientRect().height / 2 + 20));
		description
			.attr(
				"x",
				mg.l + dia[0] / 2 - description.node().getBoundingClientRect().width / 2
			)
			.attr(
				"y",
				-(
					-title.node().getBoundingClientRect().height +
					description.node().getBoundingClientRect().height +
					20
				)
			);
	};

	const generateLegend = (lgn, clr, lst) => {
		let group = lgn
			.selectAll("g")
			.data(lst)
			.enter()
			.append("rect")
			.attr("height", lgnd.rec)
			.attr("width", lgnd.rec)
			.attr("class", "legend-item")
			.attr("fill", (d, i) => clr[i])
			.attr("stroke", "black")
			.attr("transform", (d, i) => {
				if (i < 10) {
					return `translate(${lgnd.mgl + (lgnd.mgl + lgnd.w) * i},${lgnd.mgt})`;
				} else {
					return `translate(${lgnd.mgl +
						(lgnd.mgl + lgnd.w) * (i - 10)},${lgnd.mgt * 2 + lgnd.rec})`;
				}
			});

		lgn
			.selectAll("g")
			.data(lst)
			.enter()
			.append("text")
			.text((d) => d)
			//			.style("fill", (d, i) => clr[i])
			.attr("transform", (d, i) => {
				if (i < 10) {
					return `translate(${lgnd.mgl +
						lgnd.rec +
						(lgnd.mgl + lgnd.w) * i +
						3},${lgnd.mgt + lgnd.rec - 3})`;
				} else {
					return `translate(${lgnd.mgl +
						lgnd.rec +
						(lgnd.mgl + lgnd.w) * (i - 10) +
						3},${lgnd.mgt * 2 + lgnd.rec * 2 - 3})`;
				}
			});
	};

	d3.json(URL).then((data) => {
		const layout = processData(data);
		let dataArray = layout.descendants();
		let colorDomain = generateCategoryList(dataArray);
		drawDiagram(dataArray, colorDomain, sel, tooltipDiv, color);
		generateTitleDescription(sel, data.name);
		generateLegend(legend, color, colorDomain);
	});
});
