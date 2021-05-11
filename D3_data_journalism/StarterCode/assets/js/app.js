// 1. Setup the chart

let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
}

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// 2. Create a SVG wrapper

let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// 3. Import Data from data.csv

d3.csv("assets/data/data.csv").then(function(healthData){
    //4. Parse Data
    healthData.forEach(function(data){
        data.state_abbr = +data.abbr;
        data.healtcare = +data.healtcare;
        data.poverty = +data.poverty;
    });

    // 5. Scales

    let xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healtcare)])
    .range([height, 0]);

    // 6. Axes

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // 7. Append the axes to the ChartGroup

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // 8. Create Circles

    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healtcare))
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr("opacity", ".8");

    // 9. Tooltip

    let toolTip = d3.tip()
        .attr("class", "toolTip")
        .offset([80, -60])
        .html(function(d) {
            return (d.abbr);
        });

    // 10. Create tooltip in the chart

    chartGroup.call(toolTip);
});
