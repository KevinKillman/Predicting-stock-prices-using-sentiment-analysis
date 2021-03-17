$(function() {
    const drawer = $("#drawer").dxDrawer({
        // ...
        template: function(e) {
            const $list = $("<div/>").dxList({
                items: [
                    { id: 1, text: "Chart", icon: "message", path: "/render_chart" },
                ],
                width: 200,
                selectionMode: "single",
                onSelectionChanged: function(e) {
                    $("#view").load(e.addedItems[0].path);
                    drawer.hide();
                }
            });
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
                    // console.log(e)
                }
            }
        }]
    });
    

});
























// $(document).ready(()=>{
//     $('body').append("<div id='drawer'>").append("<div id='button'>")
//     $('body').append("<div id='hash'>")
//     $("#hash" ).load("{{ url_for('static', filename='html/test_view.html'}}");
//     $("#button").dxButton({
//         text: "Click me!"
//     });
//     const drawer = $("#drawer").dxDrawer({
//         template: function(e) {
//             const $list = $("<div/>").dxList({
//                 items: [
//                     { id: 1, text: "Inbox", icon: "message", path: "inbox" },
//                     { id: 2, text: "Sent Mail", icon: "check", path: "sent-mail" },
//                     { id: 3, text: "Trash", icon: "trash", path: "trash" },
//                     { id: 4, text: "Spam", icon: "mention", path: "spam" }
//                 ],
//                 width: 200,
//                 selectionMode: "single",
//                 onSelectionChanged: function(e) {
//                     $("#view").load( "./pages/" + e.addedItems[0].path + ".html" );
//                     drawer.hide();
//                 },
//                 revealMode: "expand",
//                 openedStateMode: "overlap"
//             });
//             return $list;
//         }
//     }).dxDrawer("instance");
            













        //     return $("<div style='width: 500px'>Drawer content</div>");
        // },
        // height: 250,
        // minSize: 37
    // }).dxDrawer("instance");


//     $(function() {
//         let chosenTicker = 'AMC'
//         $.getJSON(`./ticker=${chosenTicker}/period=1d/interval=5m`, (data, status)=>{
//             // console.log(status)
//             // console.log(data)
//             // $("#hash").dxDataGrid({
//             //     dataSource: data
//             // });
//             data.forEach((e,i) => {
//                 data[i].Date = new Date(e.Datetime)
//                 data[i].Open = parseFloat(e.Open)
//                 data[i].Close = parseFloat(e.Close)
//                 data[i].High = parseFloat(e.High)
//                 data[i].Low = parseFloat(e.Low)

//             })
//             let temp = data.splice(0,99)
//             console.log(temp)
//             $("#hash").dxChart({
//                 title: "Stock Price",
//                 dataSource: temp,
//                 argumentAxis: {
//                     argumentType: 'datetime',
//                     type: 'continuous',
//                     workdaysOnly: true,
//                 label: {
//                     format: "shortDate"
//                 }
//                 },
//                 valueAxis: {
//                     argumentType: ''
//                 },
//                 commonSeriesSettings: {
//                     argumentField: "Date",
//                     type: "candlestick"
//                 },
//                 legend: {
//                     itemTextPosition: 'left'
//                 },
//                 series: [
//                     { 
//                         name: "DELL",
//                         openValueField: "Open", 
//                         highValueField: "High", 
//                         lowValueField: "Low", 
//                         closeValueField: "Close", 
//                         reduction: {
//                             color: "red"
//                         }
//                     }
//                 ],    
//                 valueAxis: {
//                     tickInterval: 1,
//                     title: { 
//                         text: "US dollars"
//                     },
//                     label: {
//                         format: {
//                             type: "currency",
//                             precision: 2
//                         }
//                     }
//                 },
//                 argumentAxis: {
//                     workdaysOnly: true,
//                     label: {
//                         format: "shortDate"
//                     }
//                 },
//                 "export": {
//                     enabled: true
//                 },
//                 tooltip: {
//                     enabled: true,
//                     location: "edge",
//                     customizeTooltip: function (arg) {
//                         console.log(arg)
//                         return {
//                             text: "Open: $" + arg.openValue.toPrecision(5) + "<br/>" +
//                                     "Close: $" + arg.closeValue.toPrecision(5) + "<br/>" +
//                                     "High: $" + arg.highValue.toPrecision(5) + "<br/>" +
//                                     "Low: $" + arg.lowValue.toPrecision(5) + "<br/>"
//                         };
//                     }
//                 }
//             });


//         })

        
//     });
// })