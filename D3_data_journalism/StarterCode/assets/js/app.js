// Setup the chart

let svgWidth = 825;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
}

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create a SVG wrapper

let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params

let chosenXAxis = "poverty";

// Function for updating x-scale var upon click on axis label

function xScale(healthData, chosenXAxis) {
    //create sales
    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    return xLinearScale
}

//Function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

//Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
    
    let label;

    if (chosenXAxis === "poverty") {
        label = "Poverty (%)";
    }
    else {
        label = "Age (Median)";
    }

    // Tool tip

    let toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(d => `${d.state}<br> ${label}<br> ${d[chosenXAxis]}`);

    // Create tool tip in the chart

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip

    circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    })

    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    return circlesGroup;
}


// Import Data from data.csv

d3.csv("assets/data/data.csv").then(function(healthData) {

    // Parse Data
    healthData.forEach(data => {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
    });

    // Scales

    let xLinearScale = xScale(healthData, chosenXAxis);

    let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

    //  Axes

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append the axes to the ChartGroup

    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Append initial circles

    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .attr("class", "stateCircle");
    
    // Create group for two-axis labels

    let labelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let povertyLabel = labelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");

    let ageLabel = labelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)");

    //Append y axis

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Lacks Healthcare (%)");


    // 9. Add States Text
    let circlesText = chartGroup.selectAll("text.stateText")
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => d.abbr)
        .attr("class", "stateText");

    

