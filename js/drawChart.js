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

       /*------- gradient ------*/
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

        var step1 = greenpart+"%";
        var step2= (100/(yMax / norm)) * 2+"%";
        var step3= (100/(yMax / norm)) * 4+"%";
        var step4= (100/(yMax / norm)) * 6+"%";
        var step5= (100/(yMax / norm)) * 8+"%";
        var step6= (100/(yMax / norm)) * 10+"%";
        var step7= (100/(yMax / norm)) * 13+"%";
        var step8= (100/(yMax / norm)) * 16+"%";
        var step9= (100/(yMax / norm)) * 19+"%";
        var step10 = (100/(yMax / norm)) *25+"%";




        
        
        
        chartSvg.select('#line-gradient > stop:nth-child(1)')
            .attr("offset", "0%");
        chartSvg.select('#line-gradient > stop:nth-child(2)')
            .attr("offset", step1);
        chartSvg.select('#line-gradient > stop:nth-child(3)')
            .attr("offset", step1);
        chartSvg.select('#line-gradient > stop:nth-child(4)')
            .attr("offset", step2);
        chartSvg.select('#line-gradient > stop:nth-child(5)')
            .attr("offset", step2);
        chartSvg.select('#line-gradient > stop:nth-child(6)')
            .attr("offset", step3);
        chartSvg.select('#line-gradient > stop:nth-child(7)')
            .attr("offset", step3);
        chartSvg.select('#line-gradient > stop:nth-child(8)')
            .attr("offset", step4);
        chartSvg.select('#line-gradient > stop:nth-child(9)')
            .attr("offset", step4);
        chartSvg.select('#line-gradient > stop:nth-child(10)')
            .attr("offset", step5);
        chartSvg.select('#line-gradient > stop:nth-child(11)')
            .attr("offset", step5);
        chartSvg.select('#line-gradient > stop:nth-child(12)')
            .attr("offset", step6);
        chartSvg.select('#line-gradient > stop:nth-child(13)')
            .attr("offset", step6);
        chartSvg.select('#line-gradient > stop:nth-child(14)')
            .attr("offset", step7);
        chartSvg.select('#line-gradient > stop:nth-child(15)')
            .attr("offset", step7);
        chartSvg.select('#line-gradient > stop:nth-child(16)')
            .attr("offset", step8);
        chartSvg.select('#line-gradient > stop:nth-child(17)')
            .attr("offset", step8);
        chartSvg.select('#line-gradient > stop:nth-child(18)')
            .attr("offset", step9);
        chartSvg.select('#line-gradient > stop:nth-child(19)')
            .attr("offset", step9);
        chartSvg.select('#line-gradient > stop:nth-child(20)')
            .attr("offset", step10);


      

        /*end of the gradient*/


    });


}




