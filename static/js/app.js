//init global declarations; used sporadically throughout functions
// user defined in stockButtonOn(), init_chart(), and handleRadio()
var chosenTicker = 'AAPL'
var globalChart; //Chart object; globalChart.data.datasets etc..
var globalInterval='1d'; //Interval that data can be viewed at. 1min incremented to 1mo (month). Limited by chosen period.
var globalPeriod='ytd'; //Data reporting period. Starting from today moving back, 1d (day) incremented to 10y (years)
                  //includes values: 'ytd' and 'max'


//API request
d3.json(`./ticker=${chosenTicker}`, result => {
    cleanData(result) //Data formatting
    var ctx = document.getElementById('myChart').getContext('2d'); //div class="myChart"
    globalChart = init_chart(chosenTicker, result, ctx); 
});
//Functions to build rest of page
buildIntervalRadio()
buildPeriodDropdown()

//Chart init. Passed ticker string, result object from d3.json, and chart area (ctx from Charts.js)
function init_chart(ticker=chosenTicker, dataset, ctx) {
    //unpacking data
    var yOpen = dataset.map(element => element.Open)
    var yClose = dataset.map(element => element.Close)
    var xTime = dataset.map(element => element.Date)
    //Charts.js Line Chart
    //Chart is window resize responsive. Uses parent div to resize. Canvas tag must always be inside a container.
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: { 
            labels: xTime, //X Axis
            //Each line is passed as an object in an array
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
        options: chartOptions(), //Options logic
        plugins:{
            zoom:{
                zoom:{
                    enabled:true,
                    drag:true,
                    mode:'xy'
                }
            }
        }
    });
    return myLineChart; //returns chart object to global variable 
};




function buildPeriodDropdown(){
    //Only options API allows
    var periodOptions = ['ytd','1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','max']

    //Selecting div by ID(its in the navbar) and appending a dropdown with all options in above array
    var form = d3.select("#stockInputForm")
    var select = form.append('select').classed("period", true).attr("name", "period").attr("value", "ytd")
    periodOptions.forEach(period => {
        select.append('option')
            .attr('value', `${period}`)
            .classed("drop-text", true)
            .text(`${period}`)
    });

};
//Similar function as above, but builds radio buttons below chart
function buildIntervalRadio(chosenPeriod=globalPeriod) {
    var intervalValues;
    if (chosenPeriod === "1d" | chosenPeriod === "5d"){
        intervalValues = ['1m','2m','5m','15m','30m','60m','90m','1h','1d']
    } else {
        intervalValues=['1d','5d','1wk','1mo','3mo']
    }
    var radioContainer = d3.select(".radioIntervalChar")
    //Removes buttons if they already exist
    var radioForm = radioContainer.select('form')
    if (!radioForm.empty()){
        radioForm.remove()
    }
    radioForm = radioContainer.append('form')
    intervalValues.forEach((interval, index) =>{
        let label;
        if (interval===globalInterval){
            label = radioForm.append('label')
                .classed("radio-inline", true)
                // .classed('justify-content-center', true)
                .attr('for', `${interval}`)
                .html(`<input value="${interval}" class="intervalRadio" type="radio" name="optradio" checked> ${interval} `)
        }else{
            label = radioForm.append('label')
                .classed("radio-inline", true)
                // .classed('justify-content-center', true)
                .attr('for', `${interval}`)
                .html(`<input value="${interval}" class="intervalRadio" type="radio" name="optradio"> ${interval} `)
        }

    })

    //EVENT HANDLER 
    let eventHandler=d3.selectAll('.intervalRadio').on('click', handleRadio)

}



function stockButtonOn(){
    chosenTicker = (this.stockInputForm.ticker.value.toUpperCase())
    globalPeriod = (this.stockInputForm.period.value)
    buildIntervalRadio(globalPeriod)
    d3.json(`./ticker=${chosenTicker}/period=${globalPeriod}/interval=${globalInterval}`, result => {
        cleanData(result)


        let options = chartOptions(globalInterval)
        newTickerChartUpdate(globalChart, result, chosenTicker, options)
    })
}




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

function newTickerChartUpdate(chart,  newData, ticker, options) {
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



function chartOptions(interval=globalInterval){
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
            },
            plugins:{
                zoom:{
                    zoom:{
                        enabled:true,
                        drag:true,
                        mode:'xy'
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
            },
            plugins:{
                zoom:{
                    zoom:{
                        enabled:true,
                        drag:true,
                        mode:'xy',
                        speed: 1,
                        threshold: 5
                    }
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
};

function handleRadio(){
    if (!(globalInterval===this.value)) {
        globalInterval = this.value
        changeInterval()
    }
}

function changeInterval(chart=globalChart, interval=globalInterval, period=globalPeriod){
    d3.json(`./ticker=${chosenTicker}/period=${period}/interval=${interval}`, result=>{
        newTickerChartUpdate(chart, result, chosenTicker, chartOptions(interval))
    })
    
    chart.data.datasets.forEach(dataset=>{
        let small = ['1m','2m','5m', '1d']
        if (small.includes(globalInterval)){
            dataset.pointRadius = .1
            dataset.pointHoverRadius = 0.1
        }else{
            dataset.pointRadius= .3
        }
        console.log(dataset)
    })
    chart.update()
}