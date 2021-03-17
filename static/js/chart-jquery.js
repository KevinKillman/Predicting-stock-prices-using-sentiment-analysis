$(function () {
    let chosenTicker = 'AMC'
    const chartDrawer = $("#hash").append('<div id="mainChartWrapper">').dxDrawer({
        // ...
        template: function(e) {
            const $list = $("<div/>").dxList({
                items: [
                    { id: 1, text: "Chart", icon: "chart", path: "/render_chart" },
                ],
                height: 100,
                selectionMode: "single",
                onSelectionChanged: function(e) {
                    
                    drawer.hide();
                },
                position: 'bottom'
            });
            return $list;
        },
        // openedStateMode: "overlap"
    }).dxDrawer("instance");
    $("#chartToolbar").dxToolbar({
        items: [{
            widget: "dxButton",
            location: "before",
            options: {
                icon: "menu",
                onClick: function() {
                    chartDrawer.toggle();
                }
            }
        }]
    });
    $('#mainChartWrapper').addClass("mx-auto bg-white rounded-xl shadow-md flex items-center ").append("<div id='mainChart'>");
    

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
        let p = temp[0]
        $("#mainChart").dxChart({
            title: `${moment(p.Date).format('MMM-DD')}`,
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
                    name: `${chosenTicker}`,
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
                    format: {hour:'numeric'}
                },
                grid: {
                    visible: true
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
    })
})