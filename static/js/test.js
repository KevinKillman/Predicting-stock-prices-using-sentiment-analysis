//init function call
var ticker = 'AAPL'
var chart;

var x = moment([])


d3.csv(`./ticker=${ticker}`, result => {
    cleanData(result)
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = init_chart(ticker, result, 'Open', ctx);
});



buildPeriodDropdown().on("change", function(){
    buildIntervalDropdown(this.value)
})
function buildPeriodDropdown(){
    var periodOptions = ['ytd','1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','max']
    var form = d3.select("#stockInputForm")
    var select = form.append('select').classed("period", true).attr("name", "period").attr("value", "ytd")
    periodOptions.forEach(period => {
        select.append('option')
            .attr('value', `${period}`)
            .classed("drop-text", true)
            .text(`${period}`)
    });
    return select;

};

function buildIntervalDropdown(chosenPeriod) {
    var validIntervals;
    var intervalValues;
    var selectArea = d3.select(".interval");
    var intervalLabel = d3.select(".intervalLabel")
    if (!(selectArea.empty())){
        selectArea.remove()
        intervalLabel.remove()
    }
    if (chosenPeriod === "1d" | chosenPeriod === "5d"){
        validIntervals = ['1 min','2 min','5 min','15 min','30 min','60 min','90 min','1 hour','1 day'];
        intervalValues = ['1m','2m','5m','15m','30m','60m','90m','1h','1d']
    } else {
        validIntervals=['1d','5d','1wk','1mo','3mo']
        intervalValues=['1d','5d','1wk','1mo','3mo']
    }
    let form = d3.select("#stockInputForm")
    form.append('label').attr("for", "interval").text("Interval: ").classed("intervalLabel", true)
    let select = form.append('select').classed("interval", true).attr("name", "interval")
    
    validIntervals.forEach((interval, index) =>{
        select.append('option')
            .attr('value', `${intervalValues[index]}`)
            .classed("drop-text", true)
            .text(`${interval}`)
    })
}



function stockButtonOn(){
    var chosenTicker = (this.stockInputForm.ticker.value.toUpperCase())
    var period = (this.stockInputForm.period.value)
    var interval = (this.stockInputForm.interval.value)
    d3.csv(`./ticker=${chosenTicker}/period=${period}/interval=${interval}`, result => {
        cleanData(result)
        console.log(result)
        let labels;
        if (result[0].Date){
            labels = result.map(element => element.Date)
        }
        if (result[0].Datetime){
            labels = result.map(element => element.Datetime)
        }

        let data = result.map(element=> element.Open)
        updateChart(chart, labels, data, chosenTicker)
    })
}



function init_chart(ticker, dataset, yVariable, ctx) {
    var yAxisData = dataset.map(element => element[yVariable])
    var xTime = dataset.map(element => element.Date)
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xTime,
            datasets: [{
                label: `${ticker} Open Price`,
                data: yAxisData,
                color: 'rgb(0, 200,0)',
                fill: false,
                pointRadius: .5,
                pointHoverRadius: 3,
                borderColor: 'rgb(50, 200,50)',
                borderWidth: 2,
                lineTension:0

            }]
        },
        options: {
            scales:{
                xAxes:[{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        displayFormats:{
                            millisecond: 'h:mm a'
                        }
                    }
                }]
            },
            
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
    result.forEach(element => {
        element.Open = +element.Open;
        element.Close = +element.Close ;
        element.High = +element.High ;
        element.Low = +element.Low ;
        if(element.Date){
            element.Date = moment(element.Date);
        }

        element.Volume = +element.Volume;
        if (element.Datetime){
            element.Datetime = moment(element.Datetime)
        }
    });
};

function updateChart(chart, newLabel, newData, ticker) {
    let count =chart.data.labels.length;
    for(let i=0; i<count; i++){
        chart.data.labels.pop()
    }
    // chart.data.labels.forEach(label => chart.data.labels.pop());

    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
    chart.data.labels = newLabel;
    chart.data.datasets.forEach((dataset) => {
        dataset.label = `${ticker} Open Price`
        dataset.data=(newData);
    });

    chart.update();

    return chart;
};


function getData(ticker){
    var data;
    d3.csv(`./ticker=${ticker}`, result => {
        cleanData(result)
        data = result;
        return data
    });
    return data;
}