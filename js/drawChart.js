var parseTime = d3.timeParse("%Y-%m-%d");

function drawChart(IdForChart, keyIndicator, dataName) {

    d3.select('#petalsData').html(dataName);

    d3.json("data/data_samples/" + IdForChart + ".json", function(err, chart_data) {

        if (err) throw err;

        chart_data[0].data.forEach(function (d) {
                d.date = parseTime(d.date);
                d.value = +d.value;
        });

        const chartSvg = d3.select("#chart")
            .transition();

        const dataData = chart_data[0].data
            .filter(function (d) {  return d.key === keyIndicator; 
            });
      
        dataData
            .sort(function(a,b){  
                return new Date(a.date) - new Date(b.date); 
            });

        /* x domain */
        var dates = dataData.map(function (d) { return d.date });
        var xMin = d3.min(d3.values(dates));
        var xMax = new Date();
        chartX.domain([xMin, xMax]);


        /* y domain */
        var values = dataData.map(function (d) { return d.value });
        var norm = dataData[0].norm;
        var yMax = d3.max(d3.values(values));
        var yMin = d3.min(d3.values(values));

        norm > 0 && norm > yMax ?
            chartY.domain([0, norm]) :
            chartY.domain([0, yMax]);


        var yticks = norm > 0 ?
            [ +norm] :
            [+yMax];

        yticks
            .sort(function (a, b) {
                return a - b
            });


        chartSvg.select(".line")   // change the line
            .duration(500)
            .attr("d", valueline(dataData));

        chartSvg.select(".x.axis") // change the x axis
            .duration(500)
            .call(d3.axisBottom(chartX)
                .ticks(5)
                .tickSize(-chartHeight)
                .tickFormat(d3.timeFormat("%Y")));

        chartSvg.select(".y.axis") // change the y axis
            .duration(500)
            .call(d3.axisLeft(chartY)
                .tickValues(yticks)
                .tickSize(-chartWidth));


        d3.select("#lineText")
            .attr("x", chartX(parseTime("2019-01-01")) + 5)
            .attr("y", chartY(norm) + 15);


        d3.select('#keyHeading')
            .html(function (d) {
                let label = indicatorNames.filter(function (obj) {  return obj.key === keyIndicator; });
                return label[0].printName + " <tspan style='font-family: B612, serif; fill: rgb(221, 31, 185); font-weight:bold; font-size:14px'> i</tspan>";
            })
            .style("font-weight", "bold");
    
        norm = +norm;
        var greenpart;
        var redpart;
        var step1;
        var step2;
        var step3;
        var step4;
        var step5;
        var step6;



        if (dataData[0].key != "Кисень.розчинений.МгО2.дм3") {
            /*------- gradient ------*/

            if (norm === "NA" || norm != norm) {
                greenpart = 100
            }
            else if (yMax < norm) {
                greenpart = 100 / (norm / yMax);
            }
            else if (yMax > norm) {
                greenpart = 100 / (yMax / norm);
            }

            step1 = greenpart + "%";
            step2 = (100 / (yMax / norm)) * 2 + "%";
            step3 = (100 / (yMax / norm)) * 5 + "%";
            step4 = (100 / (yMax / norm)) * 10 + "%";
            step5 = (100 / (yMax / norm)) * 15 + "%";
            step6 = (100 / (yMax / norm)) * 25 + "%";


            chartSvg.select('#line-gradient > stop:nth-child(1)')
                .attr("offset", "0%")
                .attr("stop-color", "#199eb1");
            chartSvg.select('#line-gradient > stop:nth-child(2)')
                .attr("offset", step1)
                .attr("stop-color", "#199eb1");
            chartSvg.select('#line-gradient > stop:nth-child(3)')
                .attr("offset", step1)
                .attr("stop-color", reds[0]);
            chartSvg.select('#line-gradient > stop:nth-child(4)')
                .attr("offset", step2)
                .attr("stop-color", reds[0]);
            chartSvg.select('#line-gradient > stop:nth-child(5)')
                .attr("offset", step2)
                .attr("stop-color", reds[1]);
            chartSvg.select('#line-gradient > stop:nth-child(6)')
                .attr("offset", step3)
                .attr("stop-color", reds[1]);
            chartSvg.select('#line-gradient > stop:nth-child(7)')
                .attr("offset", step3)
                .attr("stop-color", reds[2]);
            chartSvg.select('#line-gradient > stop:nth-child(8)')
                .attr("offset", step4)
                .attr("stop-color", reds[2]);
            chartSvg.select('#line-gradient > stop:nth-child(9)')
                .attr("offset", step4)
                .attr("stop-color", reds[3]);
            chartSvg.select('#line-gradient > stop:nth-child(10)')
                .attr("offset", step5)
                .attr("stop-color", reds[3]);
            chartSvg.select('#line-gradient > stop:nth-child(11)')
                .attr("offset", step5)
                .attr("stop-color", reds[3]);
            chartSvg.select('#line-gradient > stop:nth-child(12)')
                .attr("offset", step6)
                .attr("stop-color", reds[4]);
        }


        if (dataData[0].key === "Кисень.розчинений.МгО2.дм3") {
            if (norm === "NA" || norm != norm) {
                greenpart = 100;
                redpart = 0;
            }
            else if (yMax < norm) {
                greenpart = 0;
                redpart = 100;
            }
            else if (yMax > norm) {
                redpart = 100 / (yMax / norm);
                greenpart = 100 - redpart;
            }

            step1 = redpart + "%";
            step2 = greenpart + "%";
            step3 = "100%";
            step4 = "100%";
            step5 = "100%";
            step6 = "100%";


            chartSvg.select('#line-gradient > stop:nth-child(1)')
                .attr("offset", "0%")
                .attr("stop-color", reds[2]);
            chartSvg.select('#line-gradient > stop:nth-child(2)')
                .attr("offset", step1)
                .attr("stop-color", reds[2]);
            chartSvg.select('#line-gradient > stop:nth-child(3)')
                .attr("offset", step1)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(4)')
                .attr("offset", step2)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(5)')
                .attr("offset", step2)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(6)')
                .attr("offset", step3)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(7)')
                .attr("offset", step3)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(8)')
                .attr("offset", step4)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(9)')
                .attr("offset", step4)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(10)')
                .attr("offset", step5)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(11)')
                .attr("offset", step5)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(12)')
                .attr("offset", step6)
                .attr("stop-color", green);
            chartSvg.select('#line-gradient > stop:nth-child(13)')
                .attr("offset", step6)
                .attr("stop-color", green);
        }
    });

}




