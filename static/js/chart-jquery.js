$(function () {
    let chosenTicker = 'AMC'
    $.getJSON(`./ticker=${chosenTicker}/period=1d/interval=5m`, (data, status) => {
        // console.log(status)
        // console.log(data)
        // $("#hash").dxDataGrid({
        //     dataSource: data
        // });
        data.forEach((e, i) => {
            data[i].Date = new Date(e.Datetime)
            data[i].Open = parseFloat(e.Open)
            data[i].Close = parseFloat(e.Close)
            data[i].High = parseFloat(e.High)
            data[i].Low = parseFloat(e.Low)

        })
        let temp = data.splice(0, 99)
        console.log(temp)
        $("#hash").dxChart({
            title: "Stock Price",
            dataSource: temp,
            argumentAxis: {
                argumentType: 'datetime',
                type: 'continuous',
                workdaysOnly: true,
                label: {
                    format: "shortDate"
                }
            },
            valueAxis: {
                argumentType: ''
            },
            commonSeriesSettings: {
                argumentField: "Date",
                type: "candlestick"
            },
            legend: {
                itemTextPosition: 'left'
            },
            series: [
                {
                    name: "DELL",
                    openValueField: "Open",
                    highValueField: "High",
                    lowValueField: "Low",
                    closeValueField: "Close",
                    reduction: {
                        color: "red"
                    }
                }
            ],
            valueAxis: {
                tickInterval: 1,
                title: {
                    text: "US dollars"
                },
                label: {
                    format: {
                        type: "currency",
                        precision: 2
                    }
                }
            },
            argumentAxis: {
                workdaysOnly: true,
                label: {
                    format: "shortDate"
                }
            },
            "export": {
                enabled: false
            },
            tooltip: {
                enabled: true,
                location: "edge",
                customizeTooltip: function (arg) {
                    return {
                        text: "Open: $" + arg.openValue.toPrecision(5) + "<br/>" +
                            "Close: $" + arg.closeValue.toPrecision(5) + "<br/>" +
                            "High: $" + arg.highValue.toPrecision(5) + "<br/>" +
                            "Low: $" + arg.lowValue.toPrecision(5) + "<br/>"
                    };
                }
            }
        });
        $('#resizable').dxResizable({
            // ...
            handles: "bottom right",
            onResizeEnd: function (e) {
                $("#hash").dxChart("render");
            }
            
        }).attr('style', 'border: solid;');;
    })
})