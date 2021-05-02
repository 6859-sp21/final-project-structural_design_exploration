
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
var svg = d3.select('#scatterplot')
            .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// read metadata
d3.csv("data/all_bracket_metadata.csv").then(function(data) {

  // get x and y domains
  x.domain([0, d3.max(data, function(d) { return d.mass; })]);
  y.domain([0, d3.max(data, function(d) { return d.max_ver_magdisp; })]);
      
  // build scatter plot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.mass); })
      .attr("cy", function(d) { return y(d.max_ver_magdisp); });

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("class", "axisLabel")
      .attr("x", width/2)
      .attr("y", 35)
      .style("text-anchor", "middle")
      .text('Mass (kg)');

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("class", "axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", -height/2)
      .style("text-anchor", "middle")
      .text("Max Displacement (mm)");

});