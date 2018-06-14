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
        var endLine = d3.max(d3.values(dates));
        var xMax = new Date();
        
        chartX.domain([xMin, xMax]);



        var values = dataData.map(function (d) {
            return d.value
        });
        var norm = dataData[0].norm;
        var yMax = d3.max(d3.values(values));
        var yMin = d3.min(d3.values(values));

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
        var yticks;
        if(norm > 0) {
            yticks = [yMin, +norm, yMax];
        }
        else {
            yticks = [yMin, yMax];
        }
        yticks.sort(function(a,b) {
            return a - b
        });






        chartSvg.select(".line")   // change the line
            .duration(500)
            .attr("d", valueline(dataData));
        chartSvg.select(".x.axis") // change the x axis
            .duration(500)
            .call(d3.axisBottom(chartX).ticks(numTicks(chartWidth)).tickSize(-chartHeight).tickFormat(d3.timeFormat("%b-%Y")));

        chartSvg.select(".y.axis") // change the y axis
            .duration(500)
            .call(d3.axisLeft(chartY).tickValues(yticks).tickSize(-chartWidth));

        d3.select('#petalsData').append("p")
            .attr("id", "modalKeysHeadings")
            .text(keyIndicator).style("font-weight", "bold");

        // if(norm > 0) {
        //     chartG.select(".redline")
        //         .attr("x1", chartX(xMin))
        //         .attr("y1", chartY(norm))
        //         .attr("x2", chartX(endLine))
        //         .attr("y2", chartY(norm))
        //         .style("opacity", 1);
        //
        //
        // }
        // if (norm === "NA"){
        //     console.log("немає норми");
        //     chartG.select(".redline")
        //         .style("opacity", 0);
        //
        //
        // }
        norm = +norm;
        var greenpart;

        if(yMax < norm) {
            greenpart = 100 / (norm / yMax);
        }
        else if(yMax > norm) {
            greenpart = 100 / (yMax / norm);
        }

        else if(norm === "NA"){
            greenpart = 100
        }

        var offset = greenpart+"%";
        chartSvg.select('#line-gradient > stop:nth-child(1)')
            .attr("offset", "0%");
        chartSvg.select('#line-gradient > stop:nth-child(2)')
            .attr("offset", offset);
        chartSvg.select('#line-gradient > stop:nth-child(3)')
            .attr("offset", offset);
        chartSvg.select('#line-gradient > stop:nth-child(4)')
            .attr("offset", "100%");


        /*end of the gradient*/


    });


}




