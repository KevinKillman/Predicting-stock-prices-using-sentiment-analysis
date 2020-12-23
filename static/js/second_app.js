function buildMostActive(){
    var container = d3.select(".mostActive")
    d3.json('./buildActive', function(response){
        response.forEach(answer => {
            var buttonDiv = container.append('div').classed('container containedButtonKevin', true)
            let button = buttonDiv.append('button')
                    .attr('type', 'button')
                    .classed('btn btn-primary btn-sm containedButtonKevin', true)
                    .attr('value', answer.Symbol)
                    .text('Add to Chart')
                    buttonDiv.append('h7').text(answer.Symbol).style('display', 'inline-block').style('padding-top', '25px')
            


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
        
        d3.json(`./piechart=${response.map(answer=>{return answer.Symbol})}`, function(volume){
            let ctx = document.getElementById('mostActiveChart').getContext('2d');;
            globalPie = new Chart(ctx, {
                type:'pie',
                data: {
                    labels:volume.labels,
                    datasets:[{
                        data: volume.volumes,
                        backgroundColor:volume.volumes.map(x => {return randomHsl()}) 
                    }]
                }, options: {
                    title: {
                        display: true,
                        text: ['Average Stock Volume over the last Month', 'of most active stocks today']
                    },
                    responsive: true,
                    animation: {
                        animateRotate: false,
                        animateScale: true
                    }, 
                    'onClick': function(event, item){
                        let dataIndex = item[0]._index
                        let pieTicker = item[0]._chart.config.data.labels[dataIndex]
                        d3.select('.pickMe').classed('col-md-9', false).classed('col-md-6', true)
                        let infoContainer = d3.select('.mostActiveInfoPane').classed('col-md-3', true)
                        let newDiv = d3.select('.helpMe')
                        if (!(newDiv.empty())){
                            newDiv.remove()
                        }
                        newDiv = infoContainer.append('div').classed('helpMe', true)
                        d3.json(`./info/ticker=${pieTicker}`, recall => {
                            newDiv.html(`<img src="${recall.logo_url}" alt="oops" class="img-thumbnail imgKEVIN" >`)
                            newDiv.append('h4').text(`${recall.shortName}`).classed("titleLogo", true)
                        })
                    }
                } 
                
            }) 
        })
    })
}


function randomHsl() {
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}




