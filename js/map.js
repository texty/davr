var map = {};
mapHeight = window.innerHeight - 50;
map.width = mapWidth;
map.height = mapHeight;

var bluRedWhite = ['#12335a', '#143d67', '#154675', '#165183', '#165b92', '#1765a0', '#1671af', '#167bbf', '#1486ce', '#1292dd', '#0e9ded', '#3aa8f5', '#64b2f4', '#9dc3f9'];

//, '#9dc6f3', '#b4d1f3', '#c8daf2'
var BlWhScale = d3.scaleQuantile() //синя шкала для річок
    .range(bluRedWhite)
    .domain([0, 9]);


var reds = ["#570c49", "#84126e", "#DD1FB9", "#EC76D5", "#f094df"];
var green = "#199eb1"; //black design

// var green = "#7bf491";
var PointColorsRed = d3.scaleQuantile()
// .range(colorbrewer.Reds[9])
    .range(reds)
    .domain([0, 9]);


/* проекція для карти*/

var projection = d3.geoMercator()
    .scale(2000)
    .rotate([0, 0, 0])
    .center([30, 50])
    .translate([map.width/2, map.height/2]);


var zoom = d3.zoom()
    .scaleExtent([6, 6])
    .on('zoom', function () {

         map.redraw(d3.event.transform, riverForDrawId);

    });

var halfRadius = 2;



var bigradius = clonedivWidth / 10;

var arc = d3.arc()
    .outerRadius(bigradius)
    .innerRadius(0);

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius]);

var pie = d3.pie()
    .sort(null)
    // .value(function(d) { return d.size; });
    .value(function (d) {
        return 5;
    });


var path2 = d3.geoPath()
    .projection(projection);



map.canvasDanube = d3.select("#body").append("canvas")
    .attr('height', map.height)
    .attr('width', map.width)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 350")
    .attr("class", "river danube");

var ctxDanube = map.canvasDanube.node().getContext('2d');

var pathDanube = d3.geoPath()
    .projection(projection)
    // .context(ctx);
    .context(ctxDanube);


map.canvasDanube.draw = function (transform) {
    retrieve("DANUBE", d3.json, "data/DANUBE.json", function (data) {
        ctxDanube.clearRect(0, 0, map.width, map.height);
        ctxDanube.save();

        if (transform) {
            ctxDanube.translate(transform.x, transform.y);
            ctxDanube.scale(transform.k, transform.k);
        }
        ctxDanube.fillStyle = "transparent";        data.forEach(function (d) {
            ctxDanube.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);

            ctxDanube.lineWidth = d.properties.a_WIDTH5 / 100;

            ctxDanube.lineWidth = d.properties.a_WIDTH5 / 150;

            // ctxDanube.globalAlpha = 0.8;
            ctxDanube.beginPath();
            pathDanube(d);
            ctxDanube.fill();
            ctxDanube.stroke();
        });

        ctxDanube.restore();

    });
};






/*--------------------- Дніпро ----------------------------- */

map.canvasDnipro = d3.select("#body").append("canvas")
    .attr('height', map.height)
    .attr('width', map.width)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 350")
    .attr("class", "river dnipro");

var ctxDnipro = map.canvasDnipro.node().getContext('2d');

var pathDnipro = d3.geoPath()
    .projection(projection)
    // .context(ctx);
    .context(ctxDnipro);

map.canvasDnipro.draw = function (transform) {
    retrieve("DNIEPR", d3.json, "data/DNIPRO.json", function (data) {
        ctxDnipro.clearRect(0, 0, map.width, map.height);
        ctxDnipro.save();

        if (transform) {
            ctxDnipro.translate(transform.x, transform.y);
            ctxDnipro.scale(transform.k, transform.k);
        }
        ctxDnipro.fillStyle = "transparent";
        data.forEach(function (d) {
            ctxDnipro.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);
            ctxDnipro.lineWidth = d.properties.a_WIDTH5 / 100;
            ctxDnipro.beginPath();
            pathDnipro(d);
            ctxDnipro.fill();
            ctxDnipro.stroke();
        });

        ctxDnipro.restore();
    });


};


map.canvasDanubeflowers = d3.select('#body').append("canvas")
    .attr("height", map.height)
    .attr("width", map.width)
    .attr("class", "canvasPetals");

var ctxDanubeflowers = map.map.canvasDanubeflowers.node().getContext('2d');

var pathDanubeflowers = d3.geoPath()
    .projection(projection)
    .context(ctxDanubeflowers);

d3.csv("data/lastDayMeanValueAllKey2.csv", function (error, flowers){
    ctxDanubeflowers.clearRect(0, 0, map.width, map.height);
    ctxDanubeflowers.save();

    var filteredData = flowers.filter(function (d) { return d.data.river = "Дунай"});
    var nested = d3.nest()
        .key(function (d) {
            return d.id
        })
        .entries(filteredData);

    data.forEach(function (d) {
        
    }
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
                .attr("transform", function (d) {
                    return r((d.startAngle + d.endAngle) / 2);
                })

                .attr("d", petalPath)
                .style("stroke", "#070707")
                .style("stroke-width", "0.1px")
                .style("fill", function (d) {

                    if (d.data.size > 0.9) {
                            return green;
                        }
                        else {
                        return reds[2]
                        }

                })
});


var flowefsize = 0.08;



function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
    // r = size(d.data.size),

        r = size(flowefsize),

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
}
/* end of flowers */

    data.forEach(function (d) {

    })


})
/*----------------- Дон ------------------------ */

map.canvasDon = d3.select("#body").append("canvas")
    .attr('height', map.height)
    .attr('width', map.width)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 350")
    .attr("class", "river don")
    .node().getContext('2d');

var pathDon = d3.geoPath()
    .projection(projection)
    // .context(ctx);
    .context(map.canvasDon);

map.canvasDon.draw = function (transform) {
    retrieve("DON", d3.json, "data/DON.json", function (data) {
        map.canvasDon.clearRect(0, 0, map.width, map.height);
        map.canvasDon.save();

        if (transform) {
            map.canvasDon.translate(transform.x, transform.y);
            map.canvasDon.scale(transform.k, transform.k);
        }
        map.canvasDon.fillStyle = "transparent";

        data.forEach(function (d) {
            map.canvasDon.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);
            map.canvasDon.lineWidth = d.properties.a_WIDTH5 / 100;
            map.canvasDon.beginPath();
            pathDon(d);
            map.canvasDon.fill();
            map.canvasDon.stroke();
        });

        map.canvasDon.restore();

    });
};


/*-------------------------------------------------- */

map.canvasWisla = d3.select("#body").append("canvas")
    .attr('height', map.height)
    .attr('width', map.width)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 350")
    .attr("class", "river wisla")
    .node().getContext('2d');

var pathWisla = d3.geoPath()
    .projection(projection)
    // .context(ctx);
    .context(map.canvasWisla);

map.canvasWisla.draw = function (transform) {
    retrieve("WISLA", d3.json, "data/WISLA.json", function (data) {

        map.canvasWisla.clearRect(0, 0, map.width, map.height);
        map.canvasWisla.save();

        if (transform) {
            map.canvasWisla.translate(transform.x, transform.y);
            map.canvasWisla.scale(transform.k, transform.k);
        }
        map.canvasWisla.fillStyle = "transparent";
        data.forEach(function (d) {
            map.canvasWisla.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);
            map.canvasWisla.lineWidth = d.properties.a_WIDTH5 / 100;
            map.canvasWisla.beginPath();
            pathWisla(d);
            map.canvasWisla.fill();
            map.canvasWisla.stroke();
        });

        map.canvasWisla.restore();

    });
};

/*-------------------------------------------------- */

map.canvasBug = d3.select("#body").append("canvas")
    .attr('height', map.height)
    .attr('width', map.width)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 350")
    .attr("class", "river southernbug")
    .node().getContext('2d');

var pathBug = d3.geoPath()
    .projection(projection)
    // .context(ctx);
    .context(map.canvasBug);

map.canvasBug.draw = function (transform) {
    retrieve("SOUTHERNBUG", d3.json, "data/SOUTHERNBUG.json", function (data) {

        map.canvasBug.clearRect(0, 0, map.width, map.height);
        map.canvasBug.save();

        if (transform) {
            map.canvasBug.translate(transform.x, transform.y);
            map.canvasBug.scale(transform.k, transform.k);
        }

        map.canvasBug.fillStyle = "transparent";
        data.forEach(function (d) {
            map.canvasBug.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);
            map.canvasBug.lineWidth = d.properties.a_WIDTH5 / 100;
            map.canvasBug.beginPath();
            pathBug(d);
            map.canvasBug.fill();
            map.canvasBug.stroke();
        });
        map.canvasBug.restore();
    });
};


/*--------------------Південний Буг ------------------------------ */

map.canvasDniestr = d3.select("#body").append("canvas")
    .attr('height', map.height)
    .attr('width', map.width)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 350")
    .attr("class", "river dnister")
    .node().getContext('2d');

var pathDniestr = d3.geoPath()
    .projection(projection)
    // .context(ctx);
    .context(map.canvasDniestr);

map.canvasDniestr.draw = function (transform) {
    retrieve("DNIESTR", d3.json, "data/DNIESTR.json", function (data) {
        map.canvasDniestr.clearRect(0, 0, map.width, map.height);
        map.canvasDniestr.save();

        if (transform) {
            map.canvasDniestr.translate(transform.x, transform.y);
            map.canvasDniestr.scale(transform.k, transform.k);
        }

        map.canvasDniestr.fillStyle = "transparent";
        data.forEach(function (d) {
            map.canvasDniestr.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);
            map.canvasDniestr.lineWidth = d.properties.a_WIDTH5 / 100;
            map.canvasDniestr.beginPath();
            pathDniestr(d);
            map.canvasDniestr.fill();
            map.canvasDniestr.stroke();
        });
        map.canvasDniestr.restore();
    });
};