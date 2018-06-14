/**
 * Created by yevheniia on 11.06.18.
 */
function drawChart() {

    var dataId = d3.selectAll(".messageCheckbox").attr("name");
    var keyIndicator = checkInput();

    var parseTime = d3.timeParse("%d.%m.%Y");

    d3.csv("data/total_data_gather.csv", function (error, chart) {

        var chartSvg = d3.select("#chart").transition();
        var chartG = chartSvg.select('g').transition();
        var idData = chart.filter(function (d) {
            return d.id === dataId
        });

        var dataData = idData.filter(function (d) {
            return d.key === keyIndicator;
        });

        

        d3.select('#petalsData')
            .html(dataData[0].name);


        dataData.forEach(function (d) {
            d.date = parseTime(d.date);
            d.value = +d.value;
        });

        dataData.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.date) - new Date(b.date);
        });

        var valueline = d3.line()
            .x(function (d) {
                return chartX(d.date);
            })
            .y(function (d) {
                return chartY(d.value);
            });

        var dates = dataData.map(function (d) {
            return d.date
        });       
        
        var xMin = d3.min(d3.values(dates));
        var xMax = new Date();
        
        chartX.domain([xMin, xMax]);



        var values = dataData.map(function (d) {
            return d.value
        });
        var norm = dataData[0].norm;
        var yMax = d3.max(d3.values(values));

        if(norm > 0) {
            if (norm > yMax) {
                chartY.domain([0, norm]);
            }

            if (norm < yMax) {
                chartY.domain([0, yMax]);
            }
        }

        else{
            chartY.domain([0, yMax]);
        }
        chartSvg.select(".line")   // change the line
            .duration(500)
            .attr("d", valueline(dataData));
        chartSvg.select(".x.axis") // change the x axis
            .duration(500)
            .call(d3.axisBottom(chartX).ticks(numTicks(chartWidth)).tickSize(-chartHeight).tickFormat(d3.timeFormat("%b-%y")));

        chartSvg.select(".y.axis") // change the y axis
            .duration(500)
            .call(d3.axisLeft(chartY).ticks(6).tickSize(-chartWidth));


        chartG.select(".redline")
            .attr("x1", chartX(xMin))
            .attr("y1", chartY(norm))
            .attr("x2", chartX(xMax))
            .attr("y2", chartY(norm));


        d3.select('#petalsData').append("p")
            .attr("id", "modalKeysHeadings")
            .text(keyIndicator).style("font-weight", "bold");
    });


}




