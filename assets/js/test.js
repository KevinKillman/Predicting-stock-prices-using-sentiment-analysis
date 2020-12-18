//init function call
var ticker = 'AAPL'
var chart;

d3.csv(`http://localhost:5000/ticker=${ticker}`, result => {
    cleanData(result)
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = init_chart(ticker, result, 'Open', ctx);
});

function getData(ticker){
    var data;
    d3.csv(`http://localhost:5000/ticker=${ticker}`, result => {
        cleanData(result)
        data = result;
        return data
    });
    return data;
}

buildDropdown()
function buildDropdown(){
    var periodOptions = ['1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','ytd','max']
    var form = d3.select("#stockInputForm")
    var select = form.append('select').classed("period", true).attr("name", "period")
    periodOptions.forEach(period => {
        select.append('option')
            .attr('value', `${period}`)
            .classed("drop-text", true)
            .text(`${period}`)
    })

}


function stockButtonOn(){
    var chosenTicker = (this.stockInputForm.ticker.value.toUpperCase())
    var period = (this.stockInputForm.period.value)
    // console.log(period)
    d3.csv(`http://localhost:5000/ticker=${chosenTicker}/period=${period}`, result => {
        cleanData(result)
        let labels = result.map(element => element.Date)
        // console.log(labels)
        let data = result.map(element=> element.Open)
        updateChart(chart, labels, data, chosenTicker)
    })
}



function init_chart(ticker, dataset, yVariable, ctx) {
    var yAxisData = dataset.map(element => element[yVariable])
    var xTime = dataset.map(element => element.Date)
    // console.log(xTime)
    // console.log(yAxisData)
    
    // console.log(dataset)
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xTime,
            datasets: [{
                label: `${ticker} Open Price`,
                data: yAxisData,
                color: 'rgb(0, 200,0)',
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 3,
                borderColor: 'rgb(50, 200,50)',
                lineTension:0

            }]
        },
        options: {
            tooltips: {
                mode: 'nearest'
            }
        }
    });
    return myLineChart;
};

function cleanData(result) {
    let formatTime = d3.timeFormat("%B %d, %Y");
    let parseTime = d3.timeParse("%Y-%m-%d")
    // console.log(result)
    result.forEach(element => {
        element.Open = +element.Open;
        element.Close = +element.Close ;
        element.High = +element.High ;
        element.Low = +element.Low ;
        element.Date = formatTime(parseTime(element.Date));
        element.Volume = +element.Volume;
    });
    // console.log(result)
};

function updateChart(chart, newLabel, newData, ticker) {
    // console.log(chart.data.labels)
    let count =chart.data.labels.length;
    for(let i=0; i<count; i++){
        chart.data.labels.pop()
    }
    // chart.data.labels.forEach(label => chart.data.labels.pop());
    // console.log("after pop", chart.data.labels)

    chart.data.datasets.forEach((dataset) => {
        console.log(dataset)
        dataset.data.pop();
    });
    chart.update();
    chart.data.labels = newLabel;
    chart.data.datasets.forEach((dataset) => {
        dataset.label = `${ticker} Open Price`
        dataset.data=(newData);
    });

    chart.update();

    newLabel.forEach(label => console.log(typeof(label)))
    // console.log('succes')
    // console.log(newLabel)
    // console.log(newData)
    return chart;
};