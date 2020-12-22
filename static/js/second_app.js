function buildMostActive(){
    var container = d3.select(".mostActive")
    d3.json('./buildActive', function(response){
        response.forEach(answer => {
            // var buttonDiv = container.append('div').classed('containedButtonKevin', true)
            let button = container.append('button')
                    .attr('type', 'button')
                    .classed('btn btn-primary btn-sm containedButtonKevin', true)
                    .attr('value', answer.Symbol)
                    .text('Add to Chart')
            container.append('h7').text(answer.Symbol).style('display', 'inline-block')
            container.append('br')
            container.append('br')
            


            button.on('click', function addChartData(){
                let ticker = this.value;
                d3.json(`./ticker=${ticker}/period=${globalPeriod}/interval=${globalInterval}`, function(response) {
                    cleanData(response)
                    let exists = false;
                    globalChart.data.datasets.forEach((dataset) =>{
                        if (dataset.label === `${ticker} Open Price`) {
                            exists = true;
                        }
                        if (dataset.label === `${chosenTicker} Close Price`){
                            console.log(chosenTicker)
                            dataset.data.pop()
                            globalChart.update()
                        }
                    })
                    if (!exists){
                        globalChart.data.datasets.push({
                            label: `${ticker} Open Price`,
                            data: response.map(el=>el.Open),
                            fill: false,
                            pointRadius: .9,
                            pointHoverRadius: 3,
                            borderColor: randomHsl(),
                            borderWidth: 1,
                            lineTension:0
                        })
                    }
                    globalChart.update()
                    console.log(randomHsl())
                })
            })
        })
    })
}


function randomHsl() {
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}