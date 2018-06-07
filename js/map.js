var innerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    innerHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = innerWidth,
    height = innerHeight;


var halfRadius = 2;

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius]);

var pie = d3.pie()
    .sort(null)
    // .value(function(d) { return d.size; });
    .value(function(d) { return 5; });

var parseTime = d3.timeParse("%d.%m.%Y");


//тимчасова шкала
var color = d3.scaleOrdinal(d3.schemeCategory10);

//синя шкала для річок
var colorScale = d3.scaleQuantile()
    .range(colorbrewer.Blues[4])
    .domain([0,4]);



//Червона для перевищених значень
var GnYlRd = ["#006837","#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf",  "#fee08b",  "#fdae61", "#f46d43", "#d73027", "#a50026"];

var PointColorsRed = d3.scaleQuantile()
    .range(colorbrewer.Reds[9])
    .domain([0, 9]);

var projection = d3.geoMercator()
    .scale(6000)
    .rotate([0, 0, 0])
    // .center([30.53, 50.45])
    .center([25.53, 48.45]);


var path = d3.geoPath().projection(projection);


var zoom = d3.zoom()
    .scaleExtent([0, 6])
    .on("zoom", zoomed);


var map = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var g = map.append("g");
map.call(zoom);



/* --------- Ukraine --------------*/
d3.json("data/ukr_shape.geojson", drawUkraine);

function drawUkraine(ukraine) {
    g.selectAll("path")
        .data(ukraine.features)
        .enter()
        .append("path")
        .attr("class", "ukraine")
        .attr("d", path)
        // .attr("fill", "green")
        // .attr("stroke", "white")
        .attr("fill-opacity", 1)
        .attr("fill", "rgba(255, 255, 255, 0.05)")
        .attr("stroke-width", "0.2px");
}/*  end of Ukraine*/

// /* --------- Rivers --------------*/
// let Globalvar = {}; // Global access variables
// Globalvar.toggleBasin = "data/DNIESTR_basin.geojson"; // CSV init
// update();
// Globalvar.durations = 5;
//
// function update() {
//     map.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
//     d3.selectAll('path').transition().duration(750);
//     d3.selectAll('path').remove();
//     file = Globalvar.toggleBasin;
//     d3.json(file, function (error, allData) {
//         g.selectAll("path")
//             .data(allData.features)
//             .enter()
//             .append("path")
//             .attr("d", path)
//             .attr("class", 'enter')
//             .attr("fill", "green")
//             .attr("stroke", function (d) {
//                     d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
//                     d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
//                     return colorScale(d.properties.a_DEPTH5 * 5);
//                 }
//             )
//             .attr("opacity", function (d) {
//                     d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
//                     d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
//                     return d.properties.a_WIDTH5 > 4 ? 1 : 0;
//                 }
//             )
//
//             .attr("fill-opacity", 0.5)
//             .attr("stroke-width", function (d) {
//                 return +d.properties.a_WIDTH5 / 50 + "px";
//             });
//     });

// }
/*  end of Rivers*/

/*---------------- DRAW rivers from a file  -------------------*/
function drawRivers() {
    var river = document.getElementById('selectBasin').value;

    d3.json("data/ALL_rivers ukr basins SIMPLE.geojson", function (error, allData) {

        g.selectAll("path")
            .data(allData.features.filter(function (d) {
                return d.properties.river === river
            }))
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", 'enter')
            .attr("fill", "green")
            .attr("stroke", function (d) {
                    d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                    d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
                    return colorScale(d.properties.a_DEPTH5 * 5);
                }
            )
            .attr("opacity", function (d) {
                    d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                    d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
                    return d.properties.a_WIDTH5 > 4 ? 1 : 0;
                }
            )

            .attr("fill-opacity", 0.5)
            .attr("stroke-width", function (d) {
                return +d.properties.a_WIDTH5 / 50 + "px";
            });
    });


    }






/*---------------- Draw flowers  -------------------*/
d3.csv("data/flowers.csv", function (error, data) {
    var river = document.getElementById('selectBasin').value;
    //групуємо дані по місцю забору і даті
    var nested = d3.nest()
        .key(function (d) {
            return d.id
        })
        .key(function (d) {
            return d.date
        })
        .entries(data.filter(function (d) {
            return d.river === river
        })
        );


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


    g.selectAll(".petal")
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
                .enter().append("path")
                .attr("class", "petal myBtn")
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
                        return "#66bd63"
                    }
                })
                .on('click', datum => {
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
            $('#petalsData').html(datum.data.name + "\n" + datum.data.key + ' - ' + datum.data.value + "\n" + "Норму перевищено у " + datum.data.size.toFixed(2) + " раз(ів)");
        })
        });


});
function drawPoints() {
    var river = document.getElementById('selectBasin').value;

    d3.csv("data/flowers.csv", function (error, data) {
        //групуємо дані по місцю забору і даті
        var nested = d3.nest()
            .key(function (d) {
                return d.id
            })
            .key(function (d) {
                return d.date
            })
            .entries(data.filter(function (d) {
                return d.river === river
            }));


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


        g.selectAll(".petal")
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
                    .enter().append("path")
                    .attr("class", "petal myBtn")
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
                            return "#66bd63"
                        }
                    })
                    .on('click', datum => {
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
                $('#petalsData').html(datum.data.name + "\n" + datum.data.key + ' - ' + datum.data.value + "\n" + "Норму перевищено у " + datum.data.size.toFixed(2) + " раз(ів)");
            })
            });


    })
}




function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
    // r = size(d.data.size),
        r = size(1),

        m = {x: halfRadius + r, y: 0},
        c1 = {x: halfRadius + r / 2, y: s.y},
        c2 = {x: halfRadius + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 3) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 3) + " " + Math.round(0) + "," + Math.round(0) + "Z";
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


function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    g.attr("transform", d3.event.transform); // updated for d3 v4
}

function toggle() {
    if (document.getElementById('selectBasin').value == 'Дунай') {
        projection.scale(6000).rotate([0, 0, 0]).center([25.53, 47.45]);
    } else if
    (document.getElementById('selectBasin').value == 'Дністер') {
        projection.scale(6000).rotate([0, 0, 0]).center([25.53, 48.45]);
    }
    else if
    (document.getElementById('selectBasin').value == 'Південний Буг') {
        projection.scale(6000).rotate([0, 0, 0]).center([26.53, 48.45]);
    }
    else if
    (document.getElementById('selectBasin').value == 'Дніпро') {
        projection.scale(3500).rotate([0, 0, 0]).center([30.53, 50.45]);
    }
    else if
    (document.getElementById('selectBasin').value == 'Дон') {
        projection.scale(6000).rotate([0, 0, 0]).center([34.53, 50.55]);
    }
    // d3.json("data/ukr_shape.geojson", drawUkraine);
    // d3.selectAll('.petal').remove();
    drawPoints();
    drawRivers();
    // update();

}

