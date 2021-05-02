
// set the dimensions and margins of the graph
var margin = {top: 120, right: 200, bottom: 60, left: 60},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
// var symbol = d3.scaleOrdinal(d3.symbols);
var color = d3.scaleOrdinal()
    .domain(['block', 'beam', 'flat', 'butterfly', 'arch', 'other'])
    .range([d3.interpolateViridis(0.0), 
      d3.interpolateViridis(0.2) , 
      d3.interpolateViridis(0.4), 
      d3.interpolateViridis(0.6), 
      d3.interpolateViridis(0.8) , 
      d3.interpolateViridis(1.0)]);


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
  svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      // .append('path')
      // .attr("d", function(d, i) { return d3.symbol().type(symbol(d.category)); })
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.mass); })
      .attr("cy", function(d) { return y(d.max_ver_magdisp); })
      .style("fill", function(d) { return color(d.category);}); 

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("class", "axisTitle")
      .attr("x", width/2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .text('Mass (kg)');

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("class", "axisTitle")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", -height/2)
      .style("text-anchor", "middle")
      .text("Max Displacement (mm)");

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .style("fill", function(d) { return color(d);})
    .attr("transform", function(d, i) { 
        return "translate(" + (width -10) + "," + 350 + ")";
    });

    legend.append("text")
    .attr('class', 'legendLabel')
    .attr("x", width - 24)
    .attr("y", 350)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

});