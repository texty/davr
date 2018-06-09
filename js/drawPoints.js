function drawPoints() {

    d3.csv("data/flowers.csv", function (error, points) {
        //групуємо дані по місцю забору і даті
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .key(function (d) {
                return d.date
            })
            .entries(points);


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
                            return "#95ddff"
                        }
                    })



                    /*чому тут d повертає не той датасет? , що треба, а гемометрію?????*/
                    .on('click', function (d)  {
                        var modal = document.getElementById('myModal');
                        var span = document.getElementsByClassName("close")[0];
                        d3.select('#petalsData')
                            .html(d.data.name + "\n" + d.data.key + ' - ' + d.data.value + "\n" + "Норму перевищено у " + d.data.size.toFixed(2) + " раз(ів)");
                        modal.style.display = "block";
                        span.onclick = function () {
                            modal.style.display = "none";
                        };
                        window.onclick = function (event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        };


                        // d3.selectAll("path.petal").style("display", "none").each(function () {
                        //     var currentflower = this;
                        //     if(!currentflower.classList.contains(filter[0].value)){
                        //         d3.select(currentflower).style("display", "block")
                        //     }
                        // });

                        // console.log(myClass)
                    })


            });


    })
}




function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
    // r = size(d.data.size),
        r = size(0.05),

        m = {x: halfRadius + r, y: 0},
        c1 = {x: halfRadius + r / 2, y: s.y},
        c2 = {x: halfRadius + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 2) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 2) + " " + Math.round(0) + "," + Math.round(0) + "Z";
};



function r(angle) {
    return "rotate(" + (angle / Math.PI * 180) + ")";
}

function polarToCartesian(angle, radius) {
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
    };
}  /* end of flowers */
