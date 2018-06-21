/**
 * Created by yevheniia on 11.06.18.
 */
function drawChart(IdForChart, keyIndicator) {
    var chartWidth = clonedivWidth - chartMargin.left - chartMargin.right;
    // var dataId = d3.selectAll(".messageCheckbox").attr("name");

    // var keyIndicator = checkInput();

    // var parseTime = d3.timeParse("%d.%m.%Y");
    var parseTime = d3.timeParse("%Y-%m-%d");

    // d3.csv("data/total_data_gather.csv", function (error, chart) {
        d3.csv("data/allFlowerData.csv", function (error, chart){

        var chartSvg = d3.select("#chart").transition();
        var chartG = chartSvg.select('g').transition();
        var idData = chart.filter(function (d) {
            return d.id === IdForChart
        });

        var dataData = idData.filter(function (d) {
            return d.key === keyIndicator;
        });



        d3.select('#placename')
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




            if (norm > 0) {
                if (norm > yMax) {
                    chartY.domain([0, norm]);
                }

                if (norm < yMax) {
                    chartY.domain([0, yMax]);
                }
            }

            else {
                chartY.domain([0, yMax]);
            }
            var yticks;
            if (norm > 0) {
                yticks = [yMin, +norm, yMax];
            }
            else {
                yticks = [yMin, yMax];
            }
            yticks.sort(function (a, b) {
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


            d3.select("#lineText")
                .attr("x", chartX(parseTime("2018-01-01")))
                .attr("y", chartY(norm)+10);


            d3.select('#keyHeading')
                .html(function (d) {
                    var label = indicatorNames.filter(function (obj) {
                        return obj.key === keyIndicator;
                    });

                    return label[0].printName;

                })
                .style("font-weight", "bold");


            d3.select("#keyimg").
                attr("title", function () {

                var label = indicatorNames.filter(function (obj) {
                    return obj.key === keyIndicator;
                });
                return label[0].description


            });

            norm = +norm;
            var greenpart;
            var redpart;
            var step1;
            var step2;
            var step3;
            var step4;
            var step5;
            var step6;


if(dataData[0].key != "Кисень.розчинений.МгО2.дм3") {


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
                .attr("stop-color", "#087D17");
            chartSvg.select('#line-gradient > stop:nth-child(2)')
                .attr("offset", step1)
                .attr("stop-color", "#087D17");
            chartSvg.select('#line-gradient > stop:nth-child(3)')
                .attr("offset", step1)
                .attr("stop-color", "#fb6a4a");
            chartSvg.select('#line-gradient > stop:nth-child(4)')
                .attr("offset", step2)
                .attr("stop-color", "#fb6a4a");
            chartSvg.select('#line-gradient > stop:nth-child(5)')
                .attr("offset", step2)
                .attr("stop-color", "#fb6a4a");
            chartSvg.select('#line-gradient > stop:nth-child(6)')
                .attr("offset", step3)
                .attr("stop-color", "#ef3b2c");
            chartSvg.select('#line-gradient > stop:nth-child(7)')
                .attr("offset", step3)
                .attr("stop-color", "#ef3b2c");
            chartSvg.select('#line-gradient > stop:nth-child(8)')
                .attr("offset", step4)
                .attr("stop-color", "#cb181d");
            chartSvg.select('#line-gradient > stop:nth-child(9)')
                .attr("offset", step4)
                .attr("stop-color", "#cb181d");
            chartSvg.select('#line-gradient > stop:nth-child(10)')
                .attr("offset", step5)
                .attr("stop-color", "#a50f15");
            chartSvg.select('#line-gradient > stop:nth-child(11)')
                .attr("offset", step5)
                .attr("stop-color", "#a50f15");
            chartSvg.select('#line-gradient > stop:nth-child(12)')
                .attr("offset", step6)
                .attr("stop-color", "#67000d");
            chartSvg.select('#line-gradient > stop:nth-child(13)')
                .attr("offset", step6)
                .attr("stop-color", "#67000d");
        }


            if(dataData[0].key === "Кисень.розчинений.МгО2.дм3") {

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
                    .attr("stop-color", "#a50f15");
                chartSvg.select('#line-gradient > stop:nth-child(2)')
                    .attr("offset", step1)
                    .attr("stop-color", "#a50f15");
                chartSvg.select('#line-gradient > stop:nth-child(3)')
                    .attr("offset", step1)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(4)')
                    .attr("offset", step2)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(5)')
                    .attr("offset", step2)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(6)')
                    .attr("offset", step3)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(7)')
                    .attr("offset", step3)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(8)')
                    .attr("offset", step4)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(9)')
                    .attr("offset", step4)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(10)')
                    .attr("offset", step5)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(11)')
                    .attr("offset", step5)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(12)')
                    .attr("offset", step6)
                    .attr("stop-color", "#087D17");
                chartSvg.select('#line-gradient > stop:nth-child(13)')
                    .attr("offset", step6)
                    .attr("stop-color", "#087D17");

            }


        /*end of the gradient*/


    });


}




