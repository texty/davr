
var innerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    innerHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = innerWidth - margin.right - margin.left,
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



//###################-- Ukraine --##########################
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
}


//####################################
let Globalvar = {}; // Global access variables
Globalvar.toggleBasin = "data/DNIESTR_basin.geojson"; // CSV init
Globalvar.toggleMarkers = "data/DNIESTR_flower.csv"; // CSV init

update();
Globalvar.durations = 5;
// let afterLoad = () => Globalvar.durations = 750;
//####################################

function update() {
    map.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    d3.selectAll('path').remove();
    file = Globalvar.toggleBasin;
    flower = Globalvar.toggleMarkers;
    d3.json("data/ukr_shape.geojson", drawUkraine);
    d3.csv(flower, drawPoints);
    d3.json(file, function (error, allData) {
        g.selectAll("path")
            .data(allData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", 'enter')
            .attr("fill", "green")
            .attr("stroke", function(d){
                d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
                return colorScale(d.properties.a_DEPTH5 * 5); }
            )
            .attr("opacity", function(d){
                d.properties.a_DEPTH5 = +d.properties.a_DEPTH5;
                d.properties.a_WIDTH5 = +d.properties.a_WIDTH5;
                return d.properties.a_WIDTH5 > 4 ? 1 : 0; }
            )

            .attr("fill-opacity", 0.5)
            .attr("stroke-width", function (d) {
                return +d.properties.a_WIDTH5 / 50 + "px";
            });
    });

//#####################################################

}


//############################################
d3.csv("data/danube_gather_temp.csv", drawPoints);

function drawPoints(data) {
    
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
        });

        });



}

/*---------------- Draw flowers  -------------------*/


function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
    // r = size(d.data.size),
        r = size(halfRadius*3),

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
    if (document.getElementById('selectBasin').value == 'Дунай' &&
        document.getElementById('selectBasin').options[document.getElementById('selectBasin').selectedIndex].innerHTML == 'Дунай (Одеська обл.)') {
        Globalvar.toggleMarkers = "data/danube_gather_temp.csv";
        Globalvar.toggleBasin = "data/danube_basin.geojson";
        projection.scale(14000).rotate([0, 0, 0]).center([28.53, 46]);
    } else if(document.getElementById('selectBasin').value == 'Дунай' &&
        document.getElementById('selectBasin').options[document.getElementById('selectBasin').selectedIndex].innerHTML == 'Дунай (Закарпат. Ів.-Франк., Чернів. обл.)') {
        Globalvar.toggleMarkers = "data/danube_gather_temp.csv";
        Globalvar.toggleBasin = "data/danube_basin.geojson";
        projection.scale(10000).rotate([0, 0, 0]).center([24.00, 48.45]);
    }

    else if
    (document.getElementById('selectBasin').value == 'Дністер') {
        Globalvar.toggleMarkers = "data/DNIESTR_flower.csv";
        Globalvar.toggleBasin = "data/DNIESTR_basin.geojson";
        projection.scale(7000).rotate([0, 0, 0]).center([25.53, 48.45]);
    }
    else if
    (document.getElementById('selectBasin').value == 'Південний Буг') {
        Globalvar.toggleBasin = "data/BUG_basin.geojson";
        Globalvar.toggleMarkers = "data/BUG_flower.csv";
        projection.scale(7000).rotate([0, 0, 0]).center([27.53, 48.45]);
    }
    else if
    (document.getElementById('selectBasin').value == 'Дніпро') {
        Globalvar.toggleBasin = "data/DNIPRO_basin.geojson";
        Globalvar.toggleMarkers = "data/DNIPRO_flower.csv";
        projection.scale(5000).rotate([0, 0, 0]).center([30.53, 49.45]);
    }
    else if
    (document.getElementById('selectBasin').value == 'Дон') {
        Globalvar.toggleBasin = "data/DON_basin.geojson";
        Globalvar.toggleMarkers = "data/DON_flower.csv";
        projection.scale(7000).rotate([0, 0, 0]).center([34.53, 49.55]);
    }
    update();
}


