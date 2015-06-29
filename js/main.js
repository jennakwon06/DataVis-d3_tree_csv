/**
 * Main javascript for initializing variables / handling workflow
 * Calls functions in InteractWithList.js and InteractWithTree.js
 */


/** Global variables interacting with tree - initialized here if independent of data **/
var baseSvg;
var diagonal;
var draggingNode = null;
var duration = 750;
var i = 0;
var maxLabelLength = 0;
var panBoundary = 20;
var panSpeed = 200;
var root;
var selectedNode = null;
var svgGroup;
var totalNodes;
var tooltip;
var viewerHeight;
var viewerWidth;
var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

/** Global variables interacting with list **/
var chartGroup;
var maxNodes;
var query = null;
var rowEnter;
var rowExit;
var rowUpdate;
var scrollSVG;
var virtualScroller;

treeJSON = d3.csv("../data/sampleData.csv", function (error, data) {

    /** CONVERT CSV DATA TO HIERARCHICAL DATA **/
    var dataMap = data.reduce(function (map, node) {
        map[node.name] = node;
        return map;
    }, {});

    var nestedData = [];
    data.forEach(function (node) {
        var parent = dataMap[node.parent];
        if (parent) {
            // create child array if it doesn't exist
            (parent.children || (parent.children = []))
                // add node to child array
                .push(node);
        } else {
            // parent is null or missing
            nestedData.push(node);
        }
    });

    /** SET UP **/
    diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    viewerHeight = $(document).height();
    viewerWidth = $(document).width();

    tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // establish maxLabelLength to decide on depth length
    for (var j = 0; j < nestedData.length; j++) visit(nestedData[j], function (d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);
    }, function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
    })

    // sort the tree in case CSV is not sorted
    sortTree();

    // define the baseSvg, attaching a class for styling and the zoomListener
    baseSvg = d3.select("#tree-container").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);

    // define tooltip to show
    //tooltip = d3.tip()
    //    .attr("class", "tip")
    //    .offset([-10, 0])
    //    .html(function (d) {
    //        return "<strong> Name:</strong> <span style='color:red'>" + d.name + "/span>";
    //    });

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    svgGroup = baseSvg.append("g");

    // define the root
    root = nestedData[0];
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // layout the tree initially
    update(root);

    // start tree centered at root, collapsed
    centerNode(root);
    click(root);

    // show list in viewport
    makeList();

    // Pop tooltips upon right click of menu items
    makeTooltipBox();

    /** WORKFLOW **/

    // populate an array with all the names of node
    var allNodes = [];
    d3.selectAll(".node").datum(function (d) {
        allNodes.push(d.name);
        return d;
    });

    // upon query submission, populate the list with matching nodes
    $('#submit').on("click", function (d) {
        // clear the matches and list before every click
        var matches = [];
        clearList();
        //obtain user input
        query = $('#user-input').val();
        //iterate through array and populate list with items matched with query
        for (i = 0; i < allNodes.length; i++) {
            if (~allNodes[i].indexOf(query)) {
                matches.push(allNodes[i]);
            }
        }
        // populate the list
        populateList(matches);
    });

});
