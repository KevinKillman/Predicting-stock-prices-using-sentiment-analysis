window.onload = function() {
    var options ={}
    d3.json('./VWAP/ticker=AMC/interval=30min', result => {
        var options ={
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: true,
            title:{
                text: "Stock Price: AT&T Vs Verizon for 2016"
            },
            axisX: {
                valueFormatString: "h",
                intervalType: "minute"
            },
            axisY: { 
                prefix: "$",
                title: "Price (in USD)"
            },
            data: [{
                type: "candlestick",
                xValueType: "dateTime",
                yValueFormatString: "$###0.00",
                xValueFormatString: "M-D",
                dataPoints: result.map(row => {
                    return {x: row['Date'], y: [parseFloat(row['Open']),parseFloat(row['High']),parseFloat(row['Low']),parseFloat(row['Close'])]}
                })
            }],
        }
        $("#chartContainer").CanvasJSChart(options)
        
        
    })
    $("#chartContainer").CanvasJSChart().render()    
}

