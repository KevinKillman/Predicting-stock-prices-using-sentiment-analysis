function buildMostActive(){
    var container = d3.select(".mostActive")
    d3.json('./buildActive', function(response){
        response.forEach(answer => {
            var stockDiv = container.append('div')
            var buttonDiv = stockDiv.append('div')
            let button = buttonDiv.append('button')
                    .attr('type', 'button')
                    .classed('btn btn-primary btn-sm addDataClass', true)
                    .attr('value', answer.Symbol)
                    .text('Add to Chart')
            stockDiv.append('h7').text(answer.Symbol)


            button.on('click', function(){
                console.log(this)
            })
        })
    })
}