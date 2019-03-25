import * as d3 from 'd3'
(function ()
 {

    Promise.all([
        d3.csv(require('./data/undernourishment_2015.csv')),
        d3.csv(require('./data/stunting.csv')),
      ])
        .then(ready)
        .catch(err => console.log('Failed on', err))


function ready([undernourished, stunting]) {
    console.log(undernourished)
    // i know that like this is not the best and i would have moduled my code if more time
    
    // squarechart
    var sizeScale = d3.scaleLinear()
    .domain([0,60])
    .range([30,230])

    undernourished.sort(function(x, y){
        return d3.descending(+x.percentage, +y.percentage);
     })
    
    var squares_graphic = d3.select('#first-graphic')

    squares_graphic
    .selectAll('.cube')
    .data(undernourished)
    .enter()
    // appending percentage div
    .append('div')
    //.style('top', 10 + 'px')
    //.style('left', 20 + 'px')
    .style('width', d => sizeScale(+d.percentage) + 'px')
    .style('height', d => sizeScale(+d.percentage) + 'px')
    //.style('background-color', 'red')
    .style('margin-top', 50 + 'px')
    .style('position', 'relative')
    .classed('cube', true)
    //.append('div')
    //.style('width', d=> sizeScale(10.8) + 'px')
    //.style('width', d=> sizeScale(5) + 'px')
    //.text(d => d.percentage)
    // append world div
    .append('div')
    .style('width', d => sizeScale(10.8) + 'px')
    .style('height', d => sizeScale(10.8) + 'px')
    .style('margin-top', d => sizeScale(+d.percentage) - sizeScale(10.8) + 'px')
    .style('margin-right', 10 + 'px')
    .classed('world-div', true)
    // appending text div
    .append('div')
    .style('width', function(d) {
        if(sizeScale(+d.percentage) < sizeScale(10.8) ) {
            console.log('the percentage is smaller')
            return sizeScale(10.8) + 'px'
        } else {
            console.log('the percentage is taller')
            return sizeScale(+d.percentage) + 'px'

        }
    
    })
    .style('margin-top', d => sizeScale(10.6) + 'px')
    .text(d => d.Entity)
    .classed('text-cube', true)


  

    // line chart
    console.log(stunting)

    // Set margins
    document.querySelector('#line-chart-growth').innerHTML = ""
    var container = d3.select('#line-chart-growth')
    var containerbcr = container.node().getBoundingClientRect()
    var svg = d3.select(".line_svg")

    svg = container
    .append("svg").attr("class", "line_svg")

    var margin = {top: 60, right: 20, bottom: 20, left: 20},
        width = containerbcr.width - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom

    svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    // Month variable

    //var parseYear = d3.timeParse("%Y");

    stunting.forEach(function(d) {
        d.TimePeriod = +d.TimePeriod;
        d.Value = +d.Value;
        d.GeoAreaName = d.GeoAreaName
    });

    var nest = d3.nest()
    .key(function(d) {
        return d.GeoAreaName
    })
    .entries(stunting)
  
    console.log(nest)

    var xPositionScale = d3.scaleLinear()
    .domain([2000, 2018])
    .range([0, width])

    var yPositionScale = d3.scaleLinear()
    .domain([0, 55])
    .range([height, 0])

    // Define the line
    var line = d3.line()
    .curve(d3.curveStep)
    .x(function(d) { return xPositionScale(+d.TimePeriod); })
    .y(function(d) { return yPositionScale(+d.Value); })


    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", "0")
    .style("background", "#000")
    .text("a simple tooltip")
    .classed('tooltip', true)

    svg.selectAll(".line")
    .data(nest)
    .enter()
    .append("path")
        .classed("line", true)
        .attr("d", function(d){
            console.log('1', line(d.values))
            return line(d.values)})
        .attr( 'class', d => d.key.toLowerCase().replace(/\s/g, ''))
        .attr('fill', 'none')
        .attr('stroke', function(d) {
            if((d.key.toLowerCase().replace(/\s/g, '')) == 'world') {
                return '#FF8C00'
            } else{
            return 'grey'}})
        .attr('stroke-width', '1.5px')
        .on('mouseover', function(d){
            console.log(d)
            d3.selectAll('.line').attr('stroke', '#FF6347')
            d3.select(this).attr('stroke', '#FF6347').attr('stroke-width', '2px')
		
                tooltip.transition()		
                    .duration(300)		
                    .style("opacity", .9);		

                    tooltip.html(d.key)	
                    .style("left", (d3.event.pageX) + 10 + "px")		
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style('background-color', 'white')	
                    .style('border', '1px solid black')
                    .style('font-size', '0.8em')
                    .style('padding', '3px')
                    .style('hyphens', 'auto')
                    //.style('max-width', '20px')
                })					
        .on('mouseout', function(d) {
            if((d.key.toLowerCase().replace(/\s/g, '')) == 'world'){
                d3.select(this).attr('stroke', '#FF8C00').attr('stroke-width', '1.5px')
            } else {
            d3.select(this).attr('stroke', 'grey').attr('stroke-width', '1.5px')
            }
            tooltip.transition()		
            .duration(500)		
            .style("opacity", 0);	
        })

     		

            // append the circle at the intersection 




          

        var xaxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(xPositionScale)
           //.ticks(d3.timeMonth)
           //.tickSize(12)
           .tickFormat(d3.format("d"))
           .tickSizeInner(5)
           .tickPadding(7))
        
 
   // Add the Y Axis
    var yaxis = svg.append("g")
        .attr("class", "y axis")
        .classed('y-axis', true)
        .call(d3.axisRight(yPositionScale)
           .ticks(5)
           .tickSizeInner(5)
           .tickPadding(6)
           .tickSize(width)
           .tickFormat(function(d) { return parseInt(d, 10) + "%"; })

           )
        .lower()
 
    //console.log(undernourished)
}})()