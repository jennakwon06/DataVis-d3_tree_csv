/*
 * Make list initially
 */ 
function makeList() {
    var colorScale = d3.scale.category20();

    scrollSVG = d3.select(".viewport").append("svg")
        .attr("class", "scroll-svg")

    var defs = scrollSVG.insert("defs", ":first-child");

    createFilters(defs);

    chartGroup = scrollSVG.append("g")
        .attr("class", "chartGroup")
        //.attr("filter", "url(#dropShadow1)"); // sometimes causes issues in chrome

    chartGroup.append("rect")
        .attr("fill", "#FFFFFF");

    rowEnter = function(rowSelection) {
        rowSelection.append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("width", "250")
            .attr("height", "24")
            .attr("fill-opacity", 0.25)
            .attr("stroke", "#999999")
            .attr("stroke-width", "2px");
        rowSelection.append("text")
            .attr("transform", "translate(10,15)");
    };
    rowUpdate = function(rowSelection) {
        rowSelection.select("rect")
            .attr("fill", function(d) {
                return colorScale(d.id);
            });
        rowSelection.select("text")
            .text(function (d) {
                return d;
            });
    };

    rowExit = function(rowSelection) {
    };

    virtualScroller = d3.VirtualScroller()
        .rowHeight(30)
        .enter(rowEnter)
        .update(rowUpdate)
        .exit(rowExit)
        .svg(scrollSVG)
        .totalRows(totalNodes)
        .minHeight(240)
        .viewport(d3.select(".viewport"));
}

/*
 * Clear all the rectangles inside virtual scroller 
 */ 
function clearList() {
    d3.selectAll("chartGroup > *").remove();
}

/*
 * Populate the list with match data 
 */ 
function populateList(input) {
    var j = 0;
    virtualScroller.data(input, function(d) {
        return ++j;
    });

    chartGroup.call(virtualScroller);
}

function createFilters(svgDefs) {
    var filter = svgDefs.append("svg:filter")
        .attr("id", "dropShadow1")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "200%")
        .attr("height", "200%");

    filter.append("svg:feOffset")
        .attr("result", "offOut")
        .attr("in", "SourceAlpha")
        .attr("dx", "1")
        .attr("dy", "1");

    filter.append("svg:feColorMatrix")
        .attr("result", "matrixOut")
        .attr("in", "offOut")
        .attr("type", "matrix")
        .attr("values", "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.2 0");

    filter.append("svg:feGaussianBlur")
        .attr("result", "blurOut")
        .attr("in", "matrixOut")
        .attr("stdDeviation", "1");

    filter.append("svg:feBlend")
        .attr("in", "SourceGraphic")
        .attr("in2", "blurOut")
        .attr("mode", "normal");
}