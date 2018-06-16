function drawPoints() {

    d3.csv("data/flowers.csv", function (error, points) {
    // d3.csv("data/total_data_gather.csv", function (error, points) {
        //групуємо дані по місцю забору і даті
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
             .key(function (d) {
                return d.date
            })
            .entries(points);

/*----------------------- roll up try ---------------------------------------*/




/*-------------------------------------------------------------------------- -*/




        //беремо дані за останню можливу дату по кожному місцю водозабору
        x = nested.map(function (d) {
            arrayLength = d.values.length - 1;
            return d.values[arrayLength];
        });

        //розгруповуємо дані за останню дату у звичайний array
        var unnest = [];
        x.forEach(function (d) {
            d.values.forEach(function (k) {
                unnest.push({
                    id: k.id,
                    date: k.date,
                    name: k.name,
                    lon: +k.lon,
                    lat: +k.lat,
                    key: k.key,
                    river: k.river,
                    value: k.value,
                    norm: +k.norm,
                    dev: +k.dev,
                    size: +k.size
                });
            });
        });

        //та сгруповуємо дані по індикаторам
        var nested2 = d3.nest()
            .key(function (d) {
                // return d.key;
                return d.id
            })
            .entries(unnest);

        /*додаємо мітки на карту по категоріям індикаторів, кожній групі індикаторів тепер можна задати окремі
         параметри а також transform
         */


        group.selectAll(".petal")
            .data(nested2)
            .enter().append('g')
            .attr("transform", function (d) {
                return "translate(" + projection([d.values[0].lon, d.values[0].lat]) + ")";
            })
            .each(function (d, i) {
                d3.select(this).selectAll('.petal')
                    .data(pie(d.values
                        .filter(function (d) {
                                return d.size > 0;
                            }
                        )))
                    .enter()
                    .append("path")
                    .attr("class", function (d) {
                        var basin  = d.data.river;
                        var filteredArray = riversNames.filter(function( obj ) {
                            return obj.key === basin;
                        });
                        if(filteredArray.length > 0) {
                            return filteredArray[0].value + " petal myBtn"
                        } else {
                            return "petal myBtn"
                        }

                    })
                    .attr("transform", function (d) {
                        return r((d.startAngle + d.endAngle) / 2);
                    })

                    .attr("d", petalPath)
                    .style("stroke", "#fff0f7")
                    .style("stroke-width", "0.1px")
                    .style("fill", function (d) {
                        if (d.data.size > 0.9) {
                            return PointColorsRed(d.data.size);
                        }
                        else {
                            return "#49E858"
                        }
                    })



                    /*чому тут d повертає не той датасет? , що треба, а гемометрію?????*/
                    .on('click', function (d)  {
                        var modal = document.getElementById('myModal');
                        var span = document.getElementsByClassName("close")[0];
                        
                        modal.style.display = "block";
                        span.onclick = function () {
                            modal.style.display = "none";
                        };
                        window.onclick = function (event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        };
                        
                        var IdForChart = d.data.id;
                        var keyindicator = d.data.key;
                        var norm = d.data.norm;
                        
                        // drawChart(IdForChart, indicator);
                        // updateLineChart(IdForChart)
                        // d3.selectAll(".messageCheckbox").attr("name", IdForChart);
                        // FindByAttributeValue("value", keyindicator).checked = true;
                        
                        
                        drawBigFlower(IdForChart);
                        drawChart(IdForChart, keyindicator);
                        



                    })


            });


    })
}



