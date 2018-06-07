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
    .center([25.4, 47.5]);

var path = d3.geoPath().projection(projection);

var zoom = d3.zoom()
    .scaleExtent([0, 20])
    .on("zoom", zoomed);

var map = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var g = map.append("g");
map.call(zoom);


//###################-- Ukraine --##########################
d3.json("data/ukr_shape.geojson", drawUkraine);

function drawUkraine(ukraine) {
    g.selectAll("path")
        .data(ukraine.features)
        .enter()
        .append("path")
        .attr("d", path)
        // .attr("fill", "green")
        .attr("stroke", "white")
        .attr("fill-opacity", 1)
        .attr("fill", "black")
        .attr("stroke-width", "0.2px");
}


// ###################-- Дунай --############################
d3.json("data/danube_basin.geojson", Danube);

function Danube(danubeGeojson) {
    g.selectAll("path")
        .data(danubeGeojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        // .attr("fill", "green")
        // .attr("stroke", function(d){
        //     return colorScale(+d.properties.a_DEPTH5 * 5);
        // })
        .attr("stroke", "white")
        .attr("fill-opacity", 0.5)
        .attr("stroke-width", function (d) {
            return +d.properties.a_WIDTH5 / 50 + "px";
        }) ;
}
//#####################################################




d3.csv("data/danube_gather_temp.csv", drawPoints);

function drawPoints(data) {

    //створюємо перелік усіх індикаторів, по яких збираються дані
    // var indicators = {};
    // data.forEach(function (d) {
    //     indicators[d.key] = true
    // });

    //групуємо дані по місцю забору і даті
    var nested = d3.nest()
        .key(function (d) {
            return d.id
        })
        .key(function (d) {
            return d.date
        })
        .entries(data);


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
                        .style("fill", function(d) {
                            if(d.data.size > 0.9) {
                                return PointColorsRed(d.data.size);
                            }
                            else {
                                return "#66bd63"
                            }
                        })
                        // .style("fill", "pink")
                        // .on("click", function() {
                        //     var modal = document.getElementById('myModal');
                        //     var span = document.getElementsByClassName("close")[0];
                        //     modal.style.display = "block";
                        //
                        //
                        //     span.onclick = function() {
                        //         modal.style.display = "none";
                        //     };
                        //     window.onclick = function(event) {
                        //         if (event.target == modal) {
                        //             modal.style.display = "none";
                        //         }
                        //     }
                        // });
                        .on('click', datum => {
                        var modal = document.getElementById('myModal');
                        var span = document.getElementsByClassName("close")[0];
                        modal.style.display = "block";


                        span.onclick = function() {
                        modal.style.display = "none";
                        };
                         window.onclick = function(event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                            }
                        };
                    $('#petalsData'). html(datum.data.name + "\n"+ datum.data.key + ' - ' +  datum.data.value + "\n" + "Норму перевищено у " + datum.data.size.toFixed(2) + " раз(ів)")               ;
                })
                });


//     g.selectAll("circle")
//         .data(nested2)
//         .enter().append('g')
//         .each(function (d, i) {
//             d3.select(this).selectAll('circle')
//                 .data(d.values)
//                 .enter()
//                 .append("circle")
//                 .attr("cx", function (k) {
//                     if (k.value > 0) {
//                         return k.size !== k.size ? 0 : projection([k.lon, k.lat])[0] ;
//                     }
//                 })
//                 .attr("cy", function (k) {
//                     if (k.value > 0) {
//                         return k.size !== k.size ? 0 : projection([k.lon, k.lat])[1];
//                     }
//                 })
//                 .attr("r", "0.5px")
//
//                 //поки що привʼязала колір до назви індикатора, треба привʼязати до значення
//                 .attr("fill", "white");
//
//
//         });
}

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    //не зрозуміло, як це працює. Джерело: http://bl.ocks.org/herrstucki/6199768/23f51b97bd942f6b1b7cf0b9ba76ada4cb6d1cc7

function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
        // r = size(d.data.size),
        r = size(3),

        m = {x: halfRadius + r, y: 0},
        c1 = {x: halfRadius + r / 2, y: s.y},
        c2 = {x: halfRadius + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 4) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 4) + " " + Math.round(0) + "," + Math.round(0) + "Z";
};




// function petalFill(d, i) {
//     return d3.hcl(i / d.values.length * 360, 60, 70);
// };

// function petalStroke(d, i) {
//     return d3.hcl(i / d.values.length * 360, 60, 40);
// };

    function r(angle) {
        return "rotate(" + (angle / Math.PI * 180) + ")";
    }

    function polarToCartesian(angle, radius) {
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    }



// nested_data.map(function(m) {
//     //for each group do the filter on each value
//     m.values = m.values.filter(function(d) {
//         //return true for those having starting point as island.
//         return d['starting point'] == 'Island';
//     })
// })


// var data = [{name: 'dan', value: 40}, {name: 'ryan', value: 50}];
// var getKeys = _.pluck(data, 'name');
// => ["dan", "ryan"]