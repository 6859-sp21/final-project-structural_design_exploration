
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
  var dataPoints = svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      // .append('path')
      // .attr("d", function(d, i) { return d3.symbol().type(symbol(d.category)); })
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.mass); })
      .attr("cy", function(d) { return y(d.max_ver_magdisp); })
      .style("fill", function(d) { return color(d.category);})

    // marker tool tips
   .on("mouseover", function(d) {
      svg.append('image')
      .attr('href', 'data/renderings/iso/'+d.id+'.png')
      .attr('class', 'imgTooltip')
      .attr("x", x(d.mass)-75)
      .attr("y", y(d.max_ver_magdisp)-125)
    })
   .on("mouseout", function(event, d) {
    svg.selectAll('.imgTooltip')
    .remove()
   });

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axisColor")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("class", "axisTitle")
      .attr("x", width/2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .text('Mass (kg)');

  // add the Y Axis
  svg.append("g")
      .attr("class", "axisColor")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("class", "axisTitle")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", -height/2)
      .style("text-anchor", "middle")
      .text("Max Displacement (mm)");

  
  const selmodel = SelectionModel();

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
        .on('click', (d, i) => selmodel.toggle(d))
        .on('dblclick', () => selmodel.clear())
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
    // .on('click', (e, d) => selmodel.toggle(d.category)) // change d. index
    // .on('dblclick', () => selmodel.clear());

  const symbols = legend.append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("fill", function(d) { return color(d);}) //cannot set a style here and an attribute on legend. ()
    .attr("transform", function(d, i) { 
        return "translate(" + (width -10) + "," + 350 + ")";
    })
    
    ;

    // legend title
    svg.append('text')
    .attr('class', 'legendTitle')
    .attr("x", width)
    .attr("y", 325)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text('Design Category')

    // legend labels
    const labels = legend.append("text")
    .attr('class', 'legendLabel')
    .attr("x", width - 24)
    .attr("y", 350)
    .attr("dy", ".35em")
    .style('fill', 'white')
    .style("text-anchor", "end")
    .text(function(d) { return d; });

    legend.style('cursor', 'pointer');

    selmodel.on('change.legend', () => {
      symbols.attr('fill', d => selmodel.has(d) ? color(d) : 'rgba(205,205,205,.3)');
      labels.style('fill', d => selmodel.has(d) ? 'white' : '#fff') 
 
       
    });

    selmodel.on("change.chart", () => {
         dataPoints.style("fill", d => selmodel.has(d.category) ? color(d.category) : 'rgba(205,205,205,.3)')
                   

    });

    function SelectionModel(values) {
      const dispatch = d3.dispatch('change');
      const state = new Set(values);
      
      const api = {
        on:     (type, fn) => (dispatch.on(type, fn), api),
        clear:  () => (clear(), api),
        has:    value => !state.size || state.has(value),
        set:    value => (update(value, true), api),
        toggle: value => (update(value, !state.has(value)), api)
      };
      
      function clear() {
        if (state.size) {
          state.clear();
          dispatch.call('change', api, api);
        }
      }
      
      function update(value, add) {
        if (add && !state.has(value)) {
          state.add(value);
          dispatch.call('change', api, api);
        } else if (!add && state.has(value)) {
          state.delete(value);
          dispatch.call('change', api, api);
        }
      }
    
      return api;
    }

});