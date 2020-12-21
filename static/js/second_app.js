function buildMostActive(){
    var container = d3.select(".mostActive")
    d3.json('./buildActive', function(response){
        response.forEach(answer => {
            var buttonDiv = container.append('div').classed('containedButtonKevin', true)
            let button = buttonDiv.append('button')
                    .attr('type', 'button')
                    .classed('btn btn-primary btn-sm addDataClass', true)
                    .attr('value', answer.Symbol)
                    .text('Add to Chart')
            buttonDiv.append('h7').text(answer.Symbol).style('display', 'inline-block')


            button.on('click', function addChartData(){
                let ticker = this.value;
                d3.json(`./ticker=${ticker}/period=${globalPeriod}/interval=${globalInterval}`, function(response) {
                    cleanData(response)
                    globalChart.data.datasets.push({
                        label: `${ticker} Open Price`,
                        data: response.map(el=>el.Open),
                        fill: false,
                        pointRadius: .9,
                        pointHoverRadius: 3,
                        borderColor: 'green',
                        borderWidth: 1,
                        lineTension:0
                    })
                    globalChart.update()
                })
            })
        })
    })
}


