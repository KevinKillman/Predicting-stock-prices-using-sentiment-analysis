//init function call
var ticker = 'AAPL'
var chart;
var defaultInterval;



d3.json(`./ticker=${ticker}`, result => {
    cleanData(result)
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = init_chart(ticker, result, ctx);
});

buildIntervalRadio()

buildPeriodDropdown()
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

function buildIntervalRadio(chosenPeriod='1mo') {
    var validIntervals;
    var intervalValues;
    if (chosenPeriod === "1d" | chosenPeriod === "5d"){
        validIntervals = ['1 min','2 min','5 min','15 min','30 min','60 min','90 min','1 hour','1 day'];
        intervalValues = ['1m','2m','5m','15m','30m','60m','90m','1h','1d']
        defaultInterval='1m'
    } else {
        validIntervals=['1d','5d','1wk','1mo','3mo']
        intervalValues=['1d','5d','1wk','1mo','3mo']
        defaultInterval='1d'
    }



    var radioContainer = d3.select(".radioIntervalChar")
    var radioForm = radioContainer.select('form')
    if (!radioForm.empty()){
        radioForm.remove()
    }
    radioForm = radioContainer.append('form')
    validIntervals.forEach((interval, index) =>{
        let label;
        if (intervalValues[index]===defaultInterval){
            label = radioForm.append('label')
                .classed("radio-inline", true)
                // .classed('justify-content-center', true)
                .attr('for', `${intervalValues[index]}`)
                .html(`<input value="${intervalValues[index]}" type="radio" name="optradio" checked> ${intervalValues[index]} `)
        }else{
            let label = radioForm.append('label')
                .classed("radio-inline", true)
                // .classed('justify-content-center', true)
                .attr('for', `${intervalValues[index]}`)
                .html(`<input value="${intervalValues[index]}" type="radio" name="optradio"> ${intervalValues[index]} `)
            }        
    })
}



function stockButtonOn(){
    var chosenTicker = (this.stockInputForm.ticker.value.toUpperCase())
    var period = (this.stockInputForm.period.value)
    buildIntervalRadio(period)
    d3.json(`./ticker=${chosenTicker}/period=${period}/interval=${defaultInterval}`, result => {
        cleanData(result)


        let options = chartOptions(defaultInterval)
        updateChart(chart, result, chosenTicker, options)
    })
}



function init_chart(ticker, dataset, ctx) {
    var yOpen = dataset.map(element => element.Open)
    var yClose = dataset.map(element => element.Close)
    var xTime = dataset.map(element => element.Date)
    let options = chartOptions('1d')
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xTime,
            datasets: [{
                label: `${ticker} Open Price`,
                data: yOpen,
                fill: false,
                pointRadius: .9,
                pointHoverRadius: 3,
                borderColor: 'green',
                borderWidth: 1,
                lineTension:0
            },
        {
            label: `${ticker} Close Price`,
            data: yClose,
            fill: false,
            pointRadius: .5,
            pointHoverRadius: 3,
            borderColor: 'red',
            borderWidth: 1,
            lineTension:0
        }]
        },
        options: options
    });
    return myLineChart;
};

function cleanData(result) {
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

function updateChart(chart,  newData, ticker, options) {
    let newLabel;
    if (newData[0].Date){
        newLabel = newData.map(element => element.Date)
    }
    if (newData[0].Datetime){
        newLabel = newData.map(element => element.Datetime)
    }

    let count =chart.data.labels.length;
    for(let i=0; i<count; i++){
        chart.data.labels.pop()
    }
    chart.data.labels = newLabel;   //X Axis
    chart.data.datasets.forEach((dataset) => {
        if (dataset.label.split(' ')[1] ==='Open'){
            // console.log('Open', dataset.label)
            dataset.data.pop();
            dataset.data = newData.map(element => element.Open)
            dataset.label = `${ticker} Open Price`        //Line Label
        }else if (dataset.label.split(' ')[1] ==='Close'){
            // console.log('Close', dataset.label)
            dataset.data.pop();
            dataset.label = `${ticker} Close Price`
            dataset.data = newData.map(element => element.Close)


        }
    });
    chart.options=options
    chart.update();




    return chart;
};


function getData(ticker){
    var data;
    d3.json(`./ticker=${ticker}`, result => {
        cleanData(result)
        data = result;
        return data
    });
    return data;
};



function colorLogic(context) {
    var index = context.dataIndex;
    var value = context.dataset.data[index];
    var prev_value;
    if (index === 0 | index === 1 ){
        prev_value =0
    }else{
        prev_value = context.dataset.data[index-1]
    }
    return prev_value>value ? 'red':
        prev_value<=value?'green':
        'green';
};



function chartOptions(interval){
    var checkIntervalIntraday = ['1m','2m','5m','15m','30m','60m','90m','1h']
    var checkIntervalMonth = ['1d','5d','1wk','1mo','3mo']
    let options;
    if (checkIntervalIntraday.includes(interval)){
        options = {
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
                mode: 'index',
                callbacks: {
                    label: function(tooltipItem, data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label;
    
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        return label;
                    },
                    title: function([tooltipItem], data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label;
                        let title = label.split(' ')[0]
                        let splitter = tooltipItem.label.split(',')
                        let day = splitter[0]
                        let time = splitter[2]
                        title += ` ${day} ${time}`
                        return title;
                    }
                }
            }
        }
    } else if (checkIntervalMonth.includes(interval)){
        options ={
            scales:{
                xAxes:[{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        displayFormats:{
                            millisecond: 'MMM D h a'
                            }
                        }
                    }]
                },
            tooltips: {
                mode: 'index',
                callbacks: {
                    title: function([tooltipItem], data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label;
                        let title = label.split(' ')[0]
                        title += ` ${moment(new Date(tooltipItem.label)).format('MMM D')}`
                        return title;
                    },
                    label: function(tooltipItem, data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label;
    
                        if (label) {
                            label = (label.split(' ')[1])
                            label += ': ';
                        }
                        label += `$${Math.round(tooltipItem.yLabel * 100) / 100}`;
                        return label;
                    },
                    
                }
            }
        
        }
    }
    // console.log(options)
    return options;
}


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