var innerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = innerWidth - margin.left * 2 - margin.right * 2,
    height = width / 2 - margin.top - margin.bottom;


var parseTime = d3.timeParse("%d.%m.%Y");


//тимчасова шкала
var color = d3.scaleOrdinal(d3.schemeCategory10);


var projection = d3
    .geoMercator()
    .scale(6000)
    .rotate([0, 0, 0])
    .center([25.4, 47.5]);

var path = d3.geoPath().projection(projection);

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var map = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var g = map.append("g");

map
    .call(zoom);


d3.json("data/danube_basin.geojson", drawMaps);

function drawMaps(geojson) {

    g.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "green")
        .attr("fill-opacity", 0.5)
        .attr("stroke-width", function (d) {
            // console.log(+d.properties.a_WIDTH5+"px");
            return +d.properties.a_WIDTH5 / 50 + "px";
        });
}

d3.csv("data/danube_gather.csv", drawPoints);

function drawPoints(data) {

    //створюємо перелік усіх індикаторів, по яких збираються дані
    var indicators = {};
    data.forEach(function (d) {
        indicators[d.key] = true
    });

    //групуємо дані по місцю забору і даті
    var nested = d3.nest()
        .key(function (d) {
            return d.id
        })
        .key(function (d) {
            return d.date
        })
        .entries(data);


    //беремо дані за останню можливу дату по кожному місцю
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
                dev_amount: +k.dev_amount
            });
        });
    });

    //та сгруповуємо дані по індикаторам
    var nested2 = d3.nest()
        .key(function (d) {
            return d.key
        })
        .entries(unnest);

    /*додаємо мітки на карту по категоріям індикаторів, кожній групі індикаторів тепер можна задати окремі
    параметри а також transform
    */
    g.selectAll("circle")
        .data(nested2)
        .enter().append('g')
        .each(function (d, i) {
            d3.select(this).selectAll('circle')
                .data(d.values)
                .enter()
                .append("circle")
                .attr("cx", function (k) {
                    return projection([k.lon, k.lat])[0] + i;
                })
                .attr("cy", function (k) {
                    return projection([k.lon, k.lat])[1] + i;
                })
                .attr("r", "2px")

                //поки що привʼязала колір до назви індикатора, треба привʼязати до значення
                .attr("fill", function(d){ return color(d.key)});


        });

}

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }


// nested_data.map(function(m) {
//     //for each group do the filter on each value
//     m.values = m.values.filter(function(d) {
//         //return true for those having starting point as island.
//         return d['starting point'] == 'Island';
//     })
// })