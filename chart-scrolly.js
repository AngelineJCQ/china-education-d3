;(function () {
    const margin = { top: 20, right: 50, bottom: 50, left: 50 }

    const width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let lines; // create a variable in the outermost scope where we can store the lines we draw
    let label;
    let mark;

    const svg = d3
        .select("#chart-line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const colorScale = d3.scaleOrdinal().range(["#dd383d","#efd046",  "#a0d0de"])
    const xPositionScale = d3.scaleTime().range([0, width])
    const yPositionScale = d3.scaleLinear().range([height, 0])
    const parseDate = d3.timeParse("%Y")

    const line = d3
        .line()
        .x(d => xPositionScale(d.CEEY))
        .y(d => yPositionScale(d.rate))

    d3.csv("./data/cleanData1.csv")
        .then(ready)
        .catch(function (error) {
            console.log("Failed with", error)
        })

    function ready(datapoints) {
        datapoints.forEach(function (d) {
            d.CEEY = parseDate(d.CEEY)
            d.rate = d.rate
        })

        // Update the scales
        const maxrate = d3.max(datapoints, d => d.rate)
        yPositionScale.domain([0, maxrate]).nice()
        xPositionScale.domain(d3.extent(datapoints, d => d.CEEY))


        const grouped = d3.groups(datapoints, d => d.category)

        lines = svg.selectAll("path") // I'm assigning my lines to the variable we created up top
            .data(grouped)
            .enter()
            .append("path")
            .attr('id', (d,i)=> 'line-'+ i)
            .attr("stroke", d => colorScale(d[0]))
            .attr("fill", "none")
            .attr("d", d => line(d[1]))
            .style('stroke-dasharray', 1000) // hiding the lines sneakily
            .style('stroke-dashoffset', 1000);

        const yAxis = d3.axisLeft(yPositionScale).tickFormat(function(d){return d+ "%"});
        svg.append("g").attr("class", "axis y-axis").call(yAxis)

        const xAxis = d3.axisBottom(xPositionScale)
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)


        label = svg.append('text') // assigning my label to the variable up top
            .text("University admission expansion policy")
            .attr('x', xPositionScale(parseDate(1999)))
            .attr('y', yPositionScale(83))
            .attr('class', 'label hidden');

            // console.log(label);
        
        mark = svg.append('line')
            .style("stroke", "#6595cb")
            .style("stroke-width", 3)
            .style("stroke-dasharray", 5)
            .attr("x1", xPositionScale(parseDate(1998)))
            .attr("y1", yPositionScale(0))
            .attr("x2", xPositionScale(parseDate(1998)))
            .attr("y2", yPositionScale(100))
            .attr('class', 'label hidden')
        
    }


    // do stuff to the chart here
    // depending on what step you are at
    const updateChart = (step_index, direction)=>{

        console.log('we are at step', step_index);

        if(step_index === 0){
            //animating my lines into view
            if(direction==='forward'){
                lines.transition()
                .duration(1500)
                .style('stroke-dashoffset', 0);
            } else{
                lines
                .style('opacity', 1).style('stroke-width', 1)
                .transition()
                .duration(1500)
                .style('stroke-dashoffset', 1000);
            }
            
        }

        if(step_index === 1){
            if(direction==='forward'){
                lines.style('opacity', 0.2).style('stroke-dashoffset', 0);
                d3.select('#line-0').raise().style('stroke-width', '2px').style('opacity', 1);
            } else{
                lines.style('opacity', 0.2);
                d3.select('#line-0').raise().style('stroke-width', '2px').style('opacity', 1);
                label.classed('hidden', true);
                mark.classed('hidden', true);
            }
        }

        if(step_index === 2){
            if(direction==='forward'){
                lines.style('opacity', 0.2).style('stroke-dashoffset', 0);
                d3.select('#line-1').raise().style('stroke-width', '2px').style('opacity', 1);
            } else{
                lines.style('opacity', 0.2);
                d3.select('#line-1').raise().style('stroke-width', '2px').style('opacity', 1);
                label.classed('hidden', true);
                mark.classed('hidden', true);
            }
        }

        if(step_index === 3){
            if(direction==='forward'){
                lines.style('opacity', 1).style('stroke-width', 1);
                label.classed('hidden', false);
                mark.classed('hidden', false);
            } else{
                
            }
        }

    };

    //select the steps
    let steps = d3.selectAll('.step');
    // add a listener to the steps that knows when it enters into view
    // using enter-view.js (https://github.com/russellgoldenberg/enter-view)
    // call the update function when we switch to a new step!

    enterView({
        selector: steps.nodes(), // which elements to pay attention to
        offset: 0.2, // the offset says when on the page should the trigger happen. 0.5 == when the top of the element reaches the middle of the page
        enter: el => { // when it enters, do this
            const index = +d3.select(el).attr('data-index'); //get the "data-index" attribute
            updateChart(index, 'forward'); // run the updateChart function, pass it the 'data-index"
        },
        exit: el => { // when it leaves view (aka scrolling backwards), do this
            let index = +d3.select(el).attr('data-index'); // get the index
            index = Math.max(0, index - 1); // subtract one but don't go lower than 0
            updateChart(index, 'back'); // update with the new index
        }
    });
})()
