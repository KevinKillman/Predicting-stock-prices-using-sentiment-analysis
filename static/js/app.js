//init global declarations; used sporadically throughout functions


// user defined in stockButtonOn(), init_chart(), and handleRadio()
var chosenTicker = 'AAPL'
var globalChart; //Chart object; globalChart.data.datasets etc..
var globalInterval='1m'; //Interval that data can be viewed at. 1min incremented to 1mo (month). Limited by chosen period.
var globalPeriod='1d'; //Data reporting period. Starting from today moving back, 1d (day) incremented to 10y (years)
                  //includes values: 'ytd' and 'max'
var allowedIntervalValues=['1d','5d','1wk','1mo','3mo']; //Accepted intervals for period
var globalPie; //global pie chart


//API request
d3.json(`./ticker=${chosenTicker}/period=${globalPeriod}/interval=${globalInterval}`, result => {
    cleanData(result) //Data formatting
    var ctx = document.getElementById('myChart').getContext('2d'); //div class="myChart"
    globalChart = init_chart(chosenTicker, result, ctx);
    d3.json('./buildsql', resultBUILD => {
        
    });
//Functions to build rest of page

    
});
buildIntervalRadio()
buildPeriodDropdown()
buildInfo()
buildMostActive()


//Chart init. Passed ticker string, result object from d3.json, and chart area (ctx from Charts.js)
function init_chart(ticker=chosenTicker, dataset, ctx) {
    //unpacking data
    var yOpen = dataset.map(element => element.Open)
    var yClose = dataset.map(element => element.Close)
    
    var xTime = dataset.map(element => {
        if(element.Date){
            // console.log(element)
            return (element.Date)
        }
        if (element.Datetime){
            // console.log(element)
            return (element.Datetime)
    }});
    //Charts.js Line Chart
    //Chart is window resize responsive. Uses parent div to resize. Canvas tag must always be inside a container.
    xData = yOpen.map((value, index) => {
        return {x: xTime[index], y:value}
    })
    
    var myLineChart
    if (globalPeriod === "1d"){
        myLineChart = new Chart(ctx, {
            type: 'line',
            data: { 
                labels: xTime, //X Axis
                //Each line is passed as an object in an array
                datasets: [{
                    label: `${ticker} Price`,
                    data: yOpen,
                    fill: false,
                    pointRadius: .9,
                    pointHoverRadius: 1,
                    borderColor: 'blue',
                    borderWidth: 1,
                    lineTension:0
                }]
            },
            options: chartOptions() //Options logic
        });
    }else{    
        myLineChart = new Chart(ctx, {
            type: 'line',
            data: { 
                labels: xTime, //X Axis
                //Each line is passed as an object in an array
                datasets: [{
                    label: `${ticker} Price`,
                    data: xData,
                    fill: false,
                    pointRadius: .9,
                    pointHoverRadius: 3,
                    borderColor: 'green',
                    borderWidth: 1,
                    lineTension:0
                }]
            },
            options: chartOptions(), //Options logic
            
        });
    }
    return myLineChart; //returns chart object to global variable 
};




function buildPeriodDropdown(){
    //Only options API allows
    var periodOptions = ['1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','max','ytd']

    //Selecting div by ID(its in the navbar) and appending a dropdown with all options in above array
    var form = d3.select("#stockInputForm")
    var select = form.append('select').classed("period", true).attr("name", "period")
    periodOptions.forEach(period => {
        select.append('option')
            .attr('value', `${period}`)
            .classed("drop-text", true)
            .text(`${period}`)
    });

};
//Similar function as above, but builds radio buttons below chart
function buildIntervalRadio(chosenPeriod=globalPeriod) {
    checkIntervalLogic()
    var radioContainer = d3.select(".radioIntervalChar")
    //Removes buttons if they already exist
    var radioForm = radioContainer.select('form')
    if (!radioForm.empty()){
        radioForm.remove()
    }
    radioForm = radioContainer.append('form')
    allowedIntervalValues.forEach((interval, index) =>{
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
    let button = radioContainer.select('button')
    if (!(button.empty())){
        button.remove()
    }

    

    //EVENT HANDLER 
    let eventHandler=d3.selectAll('.intervalRadio').on('click', handleRadio)

}



function stockButtonOn(){
    if ((chosenTicker === (d3.select('#tickerInput').node().value.toUpperCase()) & (globalPeriod === (d3.select('.period').node().value)))){
        return;
    }
    if (!(chosenTicker ===d3.select('#tickerInput').node().value.toUpperCase())){
        chosenTicker =d3.select('#tickerInput').node().value.toUpperCase()
        buildInfo()
    }
    globalPeriod = (d3.select('.period').node().value)
    

    buildIntervalRadio(globalPeriod)
    
    d3.json(`./ticker=${chosenTicker}/period=${globalPeriod}/interval=${globalInterval}`, result => {
        cleanData(result)
        let options = chartOptions(globalInterval)
        globalChart = newTickerChartUpdate(globalChart, result, chosenTicker, options)
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
    let newXAxis;
    if (chart.data.datasets.length>1){
        
        chart.destroy()
        
        let ctx = document.getElementById('myChart').getContext('2d'); //div class="myChart"
        chart = init_chart(chosenTicker, newData, ctx);
        console.log('destroying')
    }
    if (newData[0].Date){
        newXAxis = newData.map(element => moment(element.Date))
        test = 'Date'
    }
    if (newData[0].Datetime){
        newXAxis = newData.map(element => moment(element.Datetime))
        test = 'Datetime'
    }
    chart.data.labels = newXAxis
    chart.data.datasets[0].data = newData.map((data) => data.Open)
    
    chart.data.datasets[0].label = `${ticker} Price`
    chart.update()
    // if (chart.data.datasets.length>1){
    //     while (chart.data.datasets.length>1){
    //         chart.data.datasets.pop()
    //     }
    // }
    return chart;
};








function chartOptions(interval=globalInterval){
    var checkIntervalIntraday = ['1m','2m','5m','15m','30m','60m','90m','1h']
    var checkIntervalMonth = ['1d','5d','1wk','1mo','3mo']
    let options;
    if (checkIntervalIntraday.includes(interval) & globalPeriod==='1d'){
        options = {
            responsive: true,
            scales:{
                xAxes:[{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        displayFormats:{
                            millisecond: 'D h a',
                            second: 'D h a',
                            minute: 'h:mm a',
                            hour: 'hA'
                            }
                        },
                    scaleLabel: {
                        display: true,
                        labelString: `${moment().format('MMMM Do, YYYY')}`
                    }
                    }],
                yAxes:[{
                    ticks:{
                        callback: function(value,index,values){
                            return '$' +value;
                        }
                    }
                }]
                },
            tooltips: {
                mode: 'index',
                callbacks: {
                    // label: function(tooltipItem, data) {
                    //     let label = data.datasets[tooltipItem.datasetIndex].label;
    
                    //     if (label) {
                    //         label += ': ';
                    //     }
                    //     label += Math.round(tooltipItem.yLabel * 100) / 100;
                    //     return label;
                    // },
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
                // zoom:{
                //     pan:{
                //         enabled: true,
                //         mode:'y'
                //     },
                //     zoom:{
                //         enabled:true,
                //         drag:true,
                //         mode:'xy',
                //         rangeMin: {
                //             // Format of min zoom range depends on scale type
                //             x: null,
                //             y: null
                //         },
                //         rangeMax: {
                //             // Format of max zoom range depends on scale type
                //             x: null,
                //             y: null
                //         },
                //         speed: 1,
                //         threshold: 5
                //     }
                // }
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
                            millisecond: 'D h a',
                            second: 'D h a',
                            minte: 'h:mm a',
                            hour: 'hA'
                            }
                        },
                    scaleLabel: {
                        display: true,
                        labelString: `${moment().format('YYYY')}`
                    }
                    }],
                yAxes:[{
                    ticks:{
                        callback: function(value,index,values){
                            return '$' +value;
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
                        label += `$${Math.round(tooltipItem.yLabel*100)/100}`;  //Multiply and Divide by 100 to get 2 decimal places
                        // console.log(label)
                        return label;
                    },
                    
                }
            },
            plugins:{
                // zoom:{
                //     pan:{
                //         enabled: true,
                //         mode:'y'
                //     },
                //     zoom:{
                //         enabled:true,
                //         drag:true,
                //         mode:'xy',
                //         speed: 1,
                //         threshold: 5
                //     }
                // }
            }
        
        }
    } else if (globalPeriod==='5d'){
        options ={
            scales:{
                xAxes:[{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        displayFormats:{
                            minute: 'h:mm',
                            hour: 'MMM D'
                        }
                    },
                scaleLabel: {
                    display: true,
                    labelString: `${moment().subtract(5,'days').format('MMM Do')} - ${moment().format('MMM Do, YYYY')}`
                }
                }],
            yAxes:[{
                ticks:{
                    callback: function(value,index,values){
                        return '$' +value;
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
                        title += ` ${moment(new Date(tooltipItem.label)).format('MMM D h a')}`
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
                // zoom:{
                //     pan:{
                //         enabled: true,
                //         mode:'y'
                //     },
                //     zoom:{
                //         enabled:true,
                //         drag:true,
                //         mode:'xy',
                //         speed: 1,
                //         threshold: 5
                //     }
                // }
            }
        
        }
    }
    return options;
}



function handleRadio(){
    if (!(globalInterval===this.value)) {
        globalInterval = this.value
        globalChart = changeInterval()
    }
}

function changeInterval(chart=globalChart, interval=globalInterval, period=globalPeriod){
    d3.json(`./ticker=${chosenTicker}/period=${period}/interval=${interval}`, result=>{
        chart = newTickerChartUpdate(chart, result, chosenTicker, chartOptions(interval))
    })
    
    chart.data.datasets.forEach(dataset=>{
        let small = ['1m','2m','5m', '1d']
        if (small.includes(globalInterval)){
            dataset.pointRadius = .5
            dataset.pointHoverRadius = 0.1
        }else{
            dataset.pointRadius= .75
        }
    })
    chart.update()
    return chart;
}

function checkIntervalLogic(){
    if (globalPeriod === "1d" | globalPeriod === "5d"){
        allowedIntervalValues = ['1m','2m','5m','15m','30m','60m','90m','1h']
        
    } else {
        allowedIntervalValues=['1d','5d','1wk','1mo','3mo']
    }
    if (!(allowedIntervalValues.includes(globalInterval))){
        globalInterval=allowedIntervalValues[0]
    }
}

function buildInfo(){
    var infoBody = d3.select(".info-body")
    var infoHead = d3.select(".info-head")
    let infoListing = d3.select(".info-listing")
    let check = d3.select(".imgKEVIN")
    let titleLogo = d3.select(".titleLogo")
    if(!(titleLogo.empty())){
        titleLogo.remove()
    }
    if (!(infoListing.empty())){
        infoListing.remove()
    }
    if (!(check.empty())){
        check.remove()
    }
    d3.json(`./info/ticker=${chosenTicker}`, function(response){
        infoHead.html(`<img src="${response.logo_url}" alt="oops" class="img-thumbnail imgKEVIN" >`)
        infoHead.append('h4').text(`${response.shortName}`).classed("titleLogo", true)
        var infoArray = ['sector', 'dayHigh','dayLow','fiftyDayAverage', 'fiftyTwoWeekHigh', 'fiftyTwoWeekLow']
        var infoList = infoBody.append("ul").classed('info-listing', true)
        infoArray.forEach(info =>{
            infoList.append("li").text(`${info}: ${response[info]}`)
        })
    })
};

function resetChart(){
    globalChart.destroy()
    d3.json(`./ticker=${chosenTicker}/period=${globalPeriod}/interval=${globalInterval}`, result => {
        cleanData(result) //Data formatting
        var ctx = document.getElementById('myChart').getContext('2d'); //div class="myChart"
        globalChart = init_chart(chosenTicker, result, ctx);
    })
}