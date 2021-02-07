window.onload = function() {
    var options ={}
    var dataPoints1 = [], dataPoints2 = []
    var sliderRange = []
    var candleChart = new CanvasJS.StockChart("chartContainer", {
        theme: "light2",
        exportEnabled: true,
        title:{
            text:"Ethereum Price"
        },
        charts: [{
            axisY: {
                prefix: "$"
            },
            axisX: {
                interval: 15,
                intervalType: 'minute'
            },
            data: [{
                type: "candlestick",
                yValueFormatString: "$#,###.00",
                dataPoints : dataPoints1
            }]
        }],
        navigator: {
            data: [{
              color: "#6D78AD",
              dataPoints: dataPoints2
            }],
            slider: {
              minimum: new Date(2021, 02, 04),
              maximum: new Date(2021, 02, 05)
            }
          }
    })
    d3.json('./VWAP/ticker=AMC/interval=60min', result => {
        result.forEach(row => {
            x = row['Date'].split('T')
            y = x[1].split('.')
            time = y[0]
            console.log(time)
            dataPoints1.push({x: time, y: [parseFloat(row['Open']),parseFloat(row['High']),parseFloat(row['Low']),parseFloat(row['Close'])]})
            dataPoints2.push({x:row['Date'], y: row['Close']})
        })
        candleChart.render()
        // console.log(candleChart)
    })
}




    //     var options ={
    //         animationEnabled: true,
    //         theme:  'light1',//["light1", "light2", "dark1", "dark2"],
    //         exportEnabled: true,
    //         title:{
    //             text: "Stock Price: AT&T Vs Verizon for 2016"
    //         },
    //         axisX: {
    //             valueFormatString: "h",
    //             intervalType: "minute"
    //         },
    //         axisY: { 
    //             prefix: "$",
    //             title: "Price (in USD)"
    //         },
    //         data: [{
    //             type: "candlestick",
    //             xValueType: "dateTime",
    //             yValueFormatString: "$###0.00",
    //             xValueFormatString: "M-D",
    //             dataPoints: result.map(row => {
    //                 return {x: row['Date'], y: [parseFloat(row['Open']),parseFloat(row['High']),parseFloat(row['Low']),parseFloat(row['Close'])]}
    //             })
    //         }],
    //     }
    //     console.log(options)
    //     $("#chartContainer").CanvasJSChart(options)
    //     setTimeout(() => { 
    //         console.log('rendering')
    //         $("#chartContainer").CanvasJSChart(options).render(); 
    //     }, 2000);
        
        
    // })

