// console.log('hello world');

// d3.csv("http://localhost:5000/ticker=AAPL", result => {
//     result.forEach(element => {
//         element.Open = +element.Open;
//         element.Close = +element.Close ;
//         element.High = +element.High ;
//         element.Low = +element.Low ;
//         element.Date = new Date(element.Date);
//         element.Volume = +element.volume;
//     });
//     console.log(result)
    
// })




// Functions used to keep chart responsive to event listeners
function xScale(data, chosenX){
    var xLinearScale = d3.scaleTime()
        .domain([d3.min(data, d => d[chosenX]), d3.max(data,d=>d[chosenX])])
        .range([0,width]);
        return xLinearScale;
};

function yScale(data, chosenY){
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenY])*.8, d3.max(data, d=>d[chosenY])*1.1])
        .range([height, 0]);
        return yLinearScale;
};

function renderCircles( circlesGroup,text, newXScale, newYScale, xAxis, yAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx",d => {return newXScale(d[xAxis])})
        .attr("cy",d => {return newYScale(d[yAxis])});

        text.transition()
        .duration(1000)
        .attr("x",d => {return newXScale(d[xAxis])})
        .attr("y",d => {return newYScale(d[yAxis])});
    
    return circlesGroup,text;
}


function renderAxis( newXScale, newYScale, xAxis, yAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    var leftAxis = d3.axisLeft(newYScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return xAxis, yAxis;
}

function updateToolTip(xAxis, yAxis, circles) {
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`${d.state} <br>${yAxis} : ${d[yAxis]}<br>${xAxis} : ${d[xAxis]}`);
    });
    circles.call(toolTip);
    circles.on("mouseover", function(d) {
        toolTip.show(d, this)
    }).on("mouseout", function(d,i)  {
        toolTip.hide(d)
    });
    return circles;
}

// Initial Variable declaration

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
    top: 100,
    bottom: 100,
    right: 150,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


var chosenX = "Date";
var chosenY = "Open";

function MakeResponsive() {
    //Reset svg area create chart group
    var svgArea = d3.select("body").select("svg")

    if (!svgArea.empty()) {
        svgArea.remove();
    };

    svgWidth = (window.innerWidth)*.75;
    svgHeight = (window.innerHeight)*.75;

    height = svgHeight - margin.top - margin.bottom;
    width = svgWidth - margin.left - margin.right;

    var svg = d3.select(".svg-container")
        .append("svg")
        .classed("svg-content", true)
        .attr("preserveAspectRatio", "xMinYMin meet")
        // .attr("height", svgHeight)
        // .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    var parseTime = d3.timeParse("%Y-%m-%d")
    // Read data and use .then on promise object
    d3.csv("http://localhost:5000/ticker=AAPL", result => {

        result.forEach(element => {
            element.Open = +element.Open;
            element.Close = +element.Close ;
            element.High = +element.High ;
            element.Low = +element.Low ;
            element.Date = parseTime(element.Date);
            element.Volume = +element.Volume;
        });
        
        // Defining axis scales and appending to chart
        var xTimeScale = xScale(result, chosenX);
        var yLinearScale = yScale(result, chosenY);
        
        var bottomAxis = d3.axisBottom(xTimeScale)
        var leftAxis = d3.axisLeft(yLinearScale)

        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        var yAxis = chartGroup.append("g").call(leftAxis)

        var drawLine = d3.line()
            .x(result => xTimeScale(result.Date))
            .y(result => yLinearScale(result.Open));
        chartGroup.append("path")
            .attr("d", drawLine(result))
            .classed("line", true);





        // X Axis Labels and Group
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
        var monthLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("Month")
        // var ageLabel = xLabelsGroup.append("text")
        //     .attr("x", 0)
        //     .attr("y", 40)
        //     .attr("value", "age")
        //     .classed("inactive", true)
        //     .text("Age (Median)");
        // var incomeLabel = xLabelsGroup.append("text")
        //     .attr("x", 0)
        //     .attr("y", 60)
        //     .attr("value", "income")
        //     .classed("inactive", true)
        //     .text("Income (Median)");
        // // X Axis event listener
        // xLabelsGroup.selectAll("text").on("click", function(){
        //     // Comparing clicked value with current X Axis
        //     var value = d3.select(this).attr("value");
        //     if (value !== chosenX){
        //         chosenX = value;
        //         // updating chart using functions defined above
        //         // Functions are designed to return multiple variables where applicable
        //         xLinearScale = xScale(data, chosenX);
        //         circles, text = renderCircles(circles,text, xLinearScale, yLinearScale, chosenX, chosenY);
        //         xAxis, yAxis = renderAxis(xLinearScale, yLinearScale, xAxis, yAxis);
        //         circles = updateToolTip(chosenX, chosenY, circles)
        //         text = updateToolTip(chosenX, chosenY, text)
        //     }
        //     // Setting CSS classes. Highlights Active choice
        //     if (chosenX === "age") {
        //         povertyLabel.classed("inactive", true).classed("active", false)
        //         ageLabel.classed("active", true).classed("inactive", false)
        //         incomeLabel.classed("inactive", true).classed("active", false)

        //     } else if (chosenX ==="poverty") {
        //         povertyLabel.classed("active", true).classed("inactive", false)
        //         ageLabel.classed("inactive", true).classed("active", false)
        //         incomeLabel.classed("inactive", true).classed("active", false)

        //     } else if (chosenX ==="income") {
        //         incomeLabel.classed("active", true).classed("inactive", false)
        //         povertyLabel.classed("inactive", true).classed("active", false)
        //         ageLabel.classed("inactive", true).classed("active", false)


        //     }
        // });

        // // Y Axis Labels
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(0, ${height / 2})`)
        var healthcareLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(270)")
            .attr("x", 0)
            .attr("y", -23)
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Open Price");
        var obesityLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(270)")
            .attr("x", 0)
            .attr("y", -40)
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Close Price");
        // var smokesLabel = yLabelsGroup.append("text")
        //     .attr("transform", "rotate(270)")
        //     .attr("x", 0)
        //     .attr("y", -60)
        //     .attr("value", "smokes")
        //     .classed("inactive", true)
        //     .text("Smokes (%)");
        // // Y Axis Event Listener
        // // Same as X Axis, values just changed
        // yLabelsGroup.selectAll("text").on("click", function(){
        //     var value = d3.select(this).attr("value");
        //     if (value !== chosenY){
        //         chosenY = value;
        //         yLinearScale = yScale(data, chosenY);
        //         circles, text = renderCircles(circles,text, xLinearScale, yLinearScale, chosenX, chosenY);
        //         xAxis, yAxis = renderAxis(xLinearScale, yLinearScale, xAxis, yAxis);
        //         circles = updateToolTip(chosenX, chosenY, circles)
        //         text = updateToolTip(chosenX, chosenY, text)
        //     }

        //     if (chosenY === "healthcare") {
        //         healthcareLabel.classed("active", true).classed("inactive", false)
        //         obesityLabel.classed("inactive", true).classed("active", false)
        //         smokesLabel.classed("inactive", true).classed("active", false)

        //     } else if (chosenY ==="obesity") {
        //         obesityLabel.classed("active", true).classed("inactive", false)
        //         healthcareLabel.classed("inactive", true).classed("active", false)
        //         smokesLabel.classed("inactive", true).classed("active", false)

        //     } else if (chosenY ==="smokes") {
        //         smokesLabel.classed("active", true).classed("inactive", false)
        //         healthcareLabel.classed("inactive", true).classed("active", false)
        //         obesityLabel.classed("inactive", true).classed("active", false)


        //     }
        // })

 
    });
};


MakeResponsive()

d3.select(window).on("resize", MakeResponsive)













function buildChartJS(dataset) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var yOpenPrice = dataset.map(element => element.Open)
    var xTime = dataset.map(element => element.Date)
    var data = {
        label: 'Open Price',
        x: xTime,
        y: yOpenPrice
    }
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
};