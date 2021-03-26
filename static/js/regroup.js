$(function() {
    const drawer = $("#drawer").dxDrawer({
        openedStateMode: 'overlap',
        revealMode: 'expand',
        position: 'top',
        // height:100,
        closeOnOutsideClick: true,
        template: function(e) {
            const $list = $("<div/>").dxList({
                items: [
                    { id: 1, text: "Home", path:"/"},
                    { id: 2, text: "Chart", path:"/testing"},

                ],
                height: 'auto',
                
                selectionMode: "single",
                onSelectionChanged: function(e) {
                    drawer.hide();
                    console.log(e)
                    let i = e.addedItems
                    window.location.href = i[0].path
                },
                hoverStateEnabled: true,
                focusStateEnabled: true,
                activeStateEnabled: false,
                elementAttr: { class: "dx-theme-accent-as-background-color" }
            });
            // console.log($list)
            return $list;
        },
        // openedStateMode: "overlap"
    }).dxDrawer("instance");
    $("#toolbar").dxToolbar({
        items: [{
            widget: "dxButton",
            location: "before",
            options: {
                icon: "menu",
                onClick: function() {
                    drawer.toggle();
                }
            }
        }]
    });

    $("#drawerDrop").addClass('w-full bg-black p-2 m-auto').append("<button>test</button>");


    let chosenTicker = "AMC"

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
                    format: {hour:'numeric'}
                },
                grid: {
                    visible: true
                }
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
                argumentType: '',
                label: {
                    format: {
                        type: "currency",
                        precision: 2
                    }
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

        // $("#viewWrapper").addClass('overflow-auto overflow-x-auto rounded-lg p-2 m-2 shadow-inner')

        
    })
    $("#opened-state-mode").dxRadioGroup({
        items: ["push", "shrink", "overlap"],
        layout: "horizontal",
        value: "shrink",
        onValueChanged: function(e) {
            drawer.option("openedStateMode", e.value);
            $("#reveal-mode-option").css("visibility", e.value !== "push" ? "visible" : "hidden");
        }
    });




});

function articleRedirect() {
    FreshworksWidget('open', 'article', {
        id:69000298679
    })
}