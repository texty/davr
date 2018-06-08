var inferno = ["#000004","#02020c", "#050417", "#0a0722", "#10092d", "#160b39",  "#1e0c45",
    "#260c51", "#2f0a5b", "#380962", "#400a67", "#490b6a", "#510e6c", "#59106e", "#61136e",
    "#69166e", "#71196e", "#781c6d", "#801f6c", "#88226a", "#902568", "#982766", "#a02a63",
    "#a82e5f", "#b0315b", "#b73557", "#bf3952", "#c63d4d", "#cc4248",  "#d34743", "#d94d3d",
    "#df5337", "#e45a31", "#e9612b", "#ed6925", "#f1711f", "#f47918", "#f78212", "#f98b0b",
    "#fa9407", "#fb9d07", "#fca60c", "#fcb014", "#fbba1f", "#fac42a", "#f8cd37", "#f6d746",
    "#f4e156", "#f2ea69", "#f2f27d", "#f5f992", "#fcffa4"
];

var virids = ['#440154','#451059','#461b5d','#462461','#472b65','#473369','#483c6c','#49426f',
    '#4a4972','#4b5074','#4c5776','#4e5e78','#506679','#536d7a','#55737b','#59797b','#5d817b',
    '#61867a','#678e79','#6c9378','#739b76','#7aa073','#81a771','#89ad6d','#92b369','#9ab965',
    '#a3bf60','#acc55b','#b7ca55','#c2d04d','#cdd646','#d8db3c','#e4e02f','#f1e51d'];

var colorScale = d3.scaleQuantile() //синя шкала для річок
        .range(colorbrewer.Blues[4])
        .domain([0,4]);

var PointColorsRed = d3.scaleQuantile()
    .range(colorbrewer.Reds[9])
    .domain([0, 9]);


var riversNames = [
        // {key:"Дунай", value:"danube", lat: "24.53", lon:"48.45", scale:"10000"},
        {key:"Дунай", value:"danube", lat: "20.00", lon:"48.30", scale:"2700"},
        {key:"Дністер", value:"dnister", lat: "25.53",  lon:"49.00", scale:"4000"},
        {key:"Дніпро", value:"dnipro", lat: "30.53", lon:"52.45", scale:"3000"},
        {key:"Дон", value:"don", lat: "41.53", lon:"51.55", scale:"3000"},
        {key:"Південний Буг", value:"southernbug", lat: "30.53", lon:"49.00", scale:"4000"},
        {key:"Вісла", value:"wisla", lat: "30.53", lon:"49.00", scale:"4000"}
];


var infernoScale = d3.scaleQuantile() //синя шкала для річок
        .range(virids)
        .domain([0,9]);

    /* create bigMap*/

var halfRadius = 2;

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius]);


var pie = d3.pie()
    .sort(null)
    // .value(function(d) { return d.size; });
    .value(function(d) { return 5; });


var parseTime = d3.timeParse("%d.%m.%Y");

var projection = d3.geoMercator()
    .scale(1500)
    .rotate([0, 0, 0])
    .center([27.53, 47.00]);

var path = d3.geoPath()
    .projection(projection);


var zoom = d3.zoom()
    .scaleExtent([0, 6])
    .on("zoom", zoomed);


var bigMap = d3.select("body")
    .append("svg")
    .attr("id", "bigsvg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 960 350");

var group = bigMap.append("g");

bigMap.call(zoom);
d3.json("data/all_total_basins.geojson", drawRivers);

    function drawRivers(myData) {

        group.selectAll("path")
            .data(myData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", function (d) {
                var keyriver = d.properties.river;
                var filter = riversNames.filter(function (obj) {
                    return obj.key == keyriver;
                });

                return filter[0].value + " river"
            })
            // .attr("class", "river")
            .attr("fill", "none")
            .attr("stroke", function (d) {
                    d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                    d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
                    return infernoScale(d.properties.a_DEPTH5 * 5);
                }
            )
            .attr("fill-opacity", 0.5)
            .attr("stroke-width", function (d) {
                return +d.properties.a_WIDTH5 / 50 + "px";
            });
    }


d3.json("data/ukr_shape.geojson", drawUkraine);

function drawUkraine(ukraine){
    group.selectAll("path")
        .data(ukraine.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "ukraine")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px");
};



function drawPoints() {

    d3.csv("data/flowers.csv", function (error, data) {
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
                    });
            //         .on('click', datum => {
            //         var modal = document.getElementById('myModal');
            //     var span = document.getElementsByClassName("close")[0];
            //     modal.style.display = "block";
            //
            //
            //     span.onclick = function () {
            //         modal.style.display = "none";
            //     };
            //     window.onclick = function (event) {
            //         if (event.target == modal) {
            //             modal.style.display = "none";
            //         }
            //     };
            //     $('#petalsData').html(datum.data.name + "\n" + datum.data.key + ' - ' + datum.data.value + "\n" + "Норму перевищено у " + datum.data.size.toFixed(2) + " раз(ів)");
            // })
            });


    })
}




function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
    // r = size(d.data.size),
        r = size(0.4),

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



drawPoints();


function drawSmallMaps(file, id) {
    d3.json(file, function (error, data) {

        var riversNames = [
            // {key:"Дунай", value:"danube", lat: "24.53", lon:"48.45", scale:"10000"},
            {key:"Дунай", value:"danube", lat: "20.00", lon:"48.30", scale:"2700"},
            {key:"Дністер", value:"dnister", lat: "25.53",  lon:"49.00", scale:"4000"},
            {key:"Дніпро", value:"dnipro", lat: "30.53", lon:"52.45", scale:"3000"},
            {key:"Дон", value:"don", lat: "41.53", lon:"51.55", scale:"3000"},
            {key:"Південний Буг", value:"southernbug", lat: "30.53", lon:"49.00", scale:"4000"}
        ];



        var filteredArray = riversNames.filter(function( obj ) {
            // console.log(obj);
            // console.log("#"+obj.value == id);
            return "#"+obj.value === id;
        });

        var river = filteredArray[0].key;
        var lat = Number(filteredArray[0].lat);
        var lon = Number(filteredArray[0].lon);
        var scale = Number(filteredArray[0].scale);

        var projection = d3.geoMercator()
            .scale(scale)
            .rotate([0, 0, 0])
            // .center([30.53, 50.45])
            .center([lat, lon]);

        var colorScale = d3.scaleQuantile() //синя шкала для річок
            .range(colorbrewer.Blues[4])
            .domain([0,4]);


        var path = d3.geoPath()
            .projection(projection);

        var map = d3.select(id)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 960 800");

        var g = map.append("g");

        // var zoom = d3.zoom()
        //     .scaleExtent([0, 6])
        //     .on("zoom", zoomed)
        //     });
        //
        // map.call(zoom);



        g.selectAll("path")
            .data(data.features
                .filter(function (d) {
                    return d.properties.river === river
                }))
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", filteredArray[0].value)
            .attr("class", "river")
            .attr("fill", "none")
            .attr("stroke", function (d) {
                    d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                    d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
                    return infernoScale(d.properties.a_DEPTH5 * 5);
                }
            )
            // .attr("stroke", "white")
            // .attr("opacity", function (d) {
            //         d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
            //         d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
            //         return d.properties.a_WIDTH5 > 4 ? 1 : 0;
            //     }
            // )

            .attr("fill-opacity", 0.5)
            .attr("stroke-width", function (d) {
                return +d.properties.a_WIDTH5 / 10 + "px";
            });

        map.on("click", function(d) {

            d3.selectAll("bigMap path."+filteredArray[0].value)
                .style("display", "block")

        })

    })
};

function zoomed() {
    group.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    group.attr("transform", d3.event.transform); // updated for d3 v4
}



drawSmallMaps("data/all_total_basins.geojson", "#dnister");
drawSmallMaps("data/all_total_basins.geojson", "#danube");
drawSmallMaps("data/all_total_basins.geojson", "#dnipro");
drawSmallMaps("data/all_total_basins.geojson", "#don");
drawSmallMaps("data/all_total_basins.geojson", "#southernbug");





