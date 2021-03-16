
$(document).ready(()=>{
    $('nav').after("<div id='hash'>")

})

$(function() {
    let chosenTicker = 'AMC'
    $.getJSON(`./VWAP/ticker=${chosenTicker}`, (data, status)=>{
        console.log(status)
        console.log(data)
        $("#hash").dxDataGrid({
            dataSource: data
        });
    })

    
});