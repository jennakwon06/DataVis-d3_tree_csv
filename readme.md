# Author
Jenna Kwon

# Contact
jkwon47@gatech.edu

# Description
* This is an extension of Robert Schmuecker's work on D3 collapsible tree at bl.ocks.org/robschmuecker/7880033
* Bill White's work on d3 Virtual Scrolling Plugin was also used
* Specifically, this is a webapp for searchable organizational chart.

# User-guide
* To use this webapp with your own data, make following changes
* * In index.html, replace logo.jpg with the name of your logo image file
* * In js/main.js, replace sampleData.csv with the name of your CSV data file to populate the list
* To control information populated in Employee Information Box, make following changes
* * The top row of csv file is what defines data's attributes. First column should be "name", and second should be "parent" for the graph to be constructed as intended. Additional columns should be used for data to be populated in Employee Information box.
* * In js/interactWithTree.js, replace 'age' and 'description' variables in updateTooltipBox() and updateTooltipBoxWithList() to the ones specified in the top row of the csv file. These two functions control the content that gets populated in Employee Information box.
* * In main.js, make similar replacements with 'age' and 'description' variables (find - replace)
* Unlike original version, this webapp parses csv file instead of a json file. To use with json file, you can comment out section in main.js from "CONVERT DATA FROM CSV TO HIERARCHIAL TREE" to "SET UP"
