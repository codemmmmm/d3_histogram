//https://www.d3-graph-gallery.com/graph/histogram_basic.html
let margin = {top: 10, right: 30, bottom: 40, left: 40},
    width = window.innerWidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//Create svg element with a group element
let svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#f5f5f5")
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/files.csv").then(function(data) {
    let x = d3.scaleLog()
        .domain([1, d3.max(data, function(d) { return +d.FileSize; })]) //min and max of input
        .range([0, width]); //output range
    svg.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text") //the text element of SVG, not html
        .text("File size")
        .attr("x", width / 2 + margin.left + 5)
        .attr("y", height + margin.top + 20)
        .style("font-family", "Nimbus Sans L, serif");

    let histogram = d3.histogram()
        .value(function(d) { return d.FileSize; })
        .domain(x.domain())
        .thresholds(x.ticks(600)); //number of bins

    let bins = histogram(data);

    let y = d3.scaleLog()
        .clamp(true)
        .range([height, 0]);
        //each bin is an array containing the associated elements from the input data
        y.domain([1, d3.max(bins, function(d) {return d.length; })])
        .nice(); // d3.hist has to be called before the Y axis
    svg.append("g")
        .call(d3.axisLeft(y));
    
    console.log(bins);
    console.log(x(2), x(3));
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            //x0 - the lower bound of the bin (inclusive)
            //x1 - the upper bound of the bin (exclusive, except for the last bin).
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#69b3a2")
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut);

    let count = 0;
    for (const element of data) {
        if (element.FileSize == 0) {
            count += 1;
        }        
    }
    d3.select("body")
        .append("span")
        .text("Additionally, " + count + " files are 0 bytes big.")
        .style("border-style", "solid")
        .style("border-width", "2px")
        .style("border-color", "#69b3a2");

    function onMouseOver(d, i) {
        d3.select(this)
            .transition()
            .duration(300)
            .style("fill", "#34e3cf");
        
        // svg.append("text")
        //     .attr("class", "info")
        //     .attr("x", 20 )
        //     .attr("y", 20)
        //     .text("test");

        console.log(this.x);
    }
    
    function onMouseOut(d, i) {
        d3.select(this)
            .transition()
            .duration(300)
            .style("fill", "#69b3a2");

        // d3.select(".info")
        //     .remove();
    }
    
});


//why 300,000 on y axis
//what does domain with return +d.FileSize do?