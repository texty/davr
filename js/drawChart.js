/**
 * Created by yevheniia on 11.06.18.
 */
function drawChart() {
    d3.select("#chartToRemove").remove();
    d3.select("#modalKeysHeadings").remove();


    var dataId = d3.selectAll(".messageCheckbox").attr("name");
    var keyIndicator = checkInput();


    var margin = {top: 10, right: 30, bottom: 30, left: 30};

    var width = document.getElementById("myModal").offsetWidth/1.5,
        height = document.getElementById("myModal").offsetHeight/1.5 ;


    var parseTime = d3.timeParse("%d.%m.%Y");

    var x = d3.scaleTime()
        .rangeRound([30, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    d3.csv("data/total_data_gather.csv", function (error, chart) {

        var idData = chart.filter(function (d) {
            return d.id === dataId
        });

        


        var dataData = idData.filter(function (d) {
            return d.key === keyIndicator;
        });

        var norm = dataData[0].norm;

        d3.select('#petalsData')
            .html(dataData[0].name);

        var svg = d3.select("#chart")
            .append("svg")
            .attr("id", "chartToRemove")
            .attr("width", width)
            .attr("height", height);
            // .attr("preserveAspectRatio", "xMinYMin meet")
            // .attr("viewBox", "0 0 960 500");

        var gg = svg.append("g");

        dataData.forEach(function (d) {
            d.date = parseTime(d.date);
            d.value = +d.value;
        });

        var valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.value);
            });


        var dates = dataData.map(function (d) {
            return d.date
        });

        var xMin = d3.min(d3.values(dates));
        var xMax = new Date();


        x.domain([xMin, xMax]);
        y.domain([0, d3.max(dataData, function (d) {
            return d.value;
        })]);

        gg.append("path")
            .data([dataData])
            .attr("class", "line")
            .attr("d", valueline)
            .attr("stroke", BlWhScale);


        var lines = gg.append("line")
            .attr("x1", x(xMin))
            .attr("y1", y(norm))
            .attr("x2", x(xMax))
            .attr("y2", y(norm))
            .style("stroke", "red");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(30,0)")//magic number, change it at will
            .call(d3.axisLeft(y));


        d3.select('#petalsData').append("p")
            .attr("id", "modalKeysHeadings")
            .text(keyIndicator).style("font-weight", "bold");
    });


}


//     function updateLineChart(IdForChart) {
//
//         // Get the data again
//         d3.csv("data/total_data_gather.csv", function (error, chart) {
//
//             var IdForChart = d3.select('#option').attr('value');
//             var idData = chart.filter(function (d) {
//                 return d.id === IdForChart;
//             });
//
//             // var filteredIndicators = indicatorNames.filter(function(obj){
//             //     return obj.value == chartIndex;
//             // });
//
//             // var newIndicator  =  filteredIndicators[0].key;
//
//             var dataData = idData.filter(function (d) {
//                 return d.key === "Амоній.іони..мг.дм3";
//             });
//
//
//             dataData.forEach(function (d) {
//                 d.date = parseTime(d.date);
//                 d.value = +d.value;
//             });
//             var norm = dataData[0].norm;
//
//
//
//             // Select the section we want to apply our changes to
//
//
//
//
//             var dates = dataData.map(function (d) {
//                 return d.date
//             });
//
//             var xMin = d3.min(d3.values(dates));
//             var xMax = new Date();
//
//
//             var svg = d3.select("body").transition();
//             // Make the changes
//             svg.select(".line")   // change the line
//                 .duration(750)
//                 .attr("d", valueline(dataData));
//
//             var lines = gg.append("line")
//                 .attr("x1", x(xMin))
//                 .attr("y1", y(norm))
//                 .attr("x2", x(xMax))
//                 .attr("y2", y(norm))
//                 .style("stroke", "red");
//
//             svg.select(".x.axis") // change the x axis
//                 .duration(750)
//                 .call(d3.axisBottom(x));
//             svg.select(".y.axis") // change the y axis
//                 .duration(750)
//                 .call(d3.axisLeft(y));
//
//
//         });
//
// }


