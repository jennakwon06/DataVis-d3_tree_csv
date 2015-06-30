/*
 * Build tree
 */

/** Global variables interacting with tree **/
var baseSvg;
var diagonal;
var draggingNode;
var duration;
var i;
var maxLabelLength;
var panBoundary;
var panSpeed;
var root;
var selectedNode;
var svgGroup;
var totalNodes;
var tree;
var viewerHeight;
var viewerWidth;
var zoomListener;

/** Global variables interacting with list **/
var allNodes;
var chartGroup;
var matches;
var query;
var rowEnter;
var rowExit;
var rowUpdate;
var scrollSVG;
var virtualScroller;

treeJSON = d3.csv("../data/sampleData.csv", function(error, data) {

/** CONVERT DATA FROM CSV TO HIERARCHIAL TREE **/
    var dataMap = data.reduce(function(map, node) {
     map[node.name] = node;
     return map;
    }, {});

    var nestedData = [];
    data.forEach(function(node) {
     // add to parent
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
    diagonal = d3.svg.diagonal() // define a d3 diagonal projection for use by the node paths later on.
        .projection(function(d) { return [d.y, d.x]; });

    draggingNode = null;
    duration = 750;
    i = 0;
    maxLabelLength = 0;
    panBoundary = 20; // Within 20px from edges will pan when dragging.
    panSpeed = 200;
    selectedNode = null;
    totalNodes = 0;

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

    // Sort the tree initially in case CSV is not sorted
    sortTree();

    // Set zoom listener to enable zooming functionality
    zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // Define the baseSvg, attaching a class for styling and the zoomListener
    baseSvg = d3.select("#tree-container").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    svgGroup = baseSvg.append("g");

    // Define the root
    root = nestedData[0];
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Layout the tree initially and center on the root node.
    update(root);

    // Start tree with at root, collapsed
    centerNode(root);
    click(root);

    // Show list in viewport
    makeList();

    makeTooltipBox();

/** WORKFLOW **/

    // Populate an array with all the names of node
    allNodes = [];
    d3.selectAll(".node").datum(function(d) {
        //var nodePos = d3.transform(d3.select(this.parentNode).attr("transform")).translate;
        if (d !== "undefined") {
            allNodes.push(d3.select(this)[0]);
        }
        return d;
    });

    //console.log(allNodes);


    // Upon query submission, populate the list with matching nodes
    $('#submit').on("click", function(ev) {
        matches = []; // Clear the matches before every click
        clearList(); // Clear the list before every click
        query = $('#user-input').val(); // Obtain query

        for (i = 0; i < allNodes.length; i++) { // Populate matched array

          console.log(allNodes[i].datum(function(d) {
              console.log(d);
              return d;
          }));

          //if (~allNodes[i].name.indexOf(query)) {
          //  matches.push(allNodes[i]);
          //}
        }
        populateList(matches); // Populate the list
    });

});
