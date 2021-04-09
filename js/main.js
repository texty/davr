
/*Змінні для великої квітки*/
var halfRadius = 2;
var bigradius = 30;

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius]);

var pie = d3.pie()
    .sort(null)
    .value(function (d) {  return 5;  });

var chartMargin = {top: 20, right: 20, bottom: 20, left: 35},
    chartWidth = 600,
    chartHeight = 300 - chartMargin.top - chartMargin.bottom;

var flowerSvg = d3.select("#big-flower").append("svg")
    .attr("id", "#bigFlower")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 "+ 300 + " "  + 200 );

var flowerG = flowerSvg.append("g")
    .attr('transform', 'translate(' + 150 + "," + 100 + ')');

d3.select("#myModal")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var bluRedWhite = ['#12335a', '#143d67', '#154675', '#165183', '#165b92', '#1765a0', '#1671af', '#167bbf', '#1486ce', '#1292dd', '#0e9ded', '#3aa8f5', '#64b2f4', '#9dc3f9'];

var BlWhScale = d3.scaleQuantile() //синя шкала для річок
    .range(bluRedWhite)
    .domain([0, 9]);


var reds = ["#570c49", "#84126e", "#DD1FB9", "#EC76D5", "#f094df"];
var green = "#199eb1";


var PointColorsRed = d3.scaleQuantile()
    .range(reds)
    .domain([0, 9]);


/* проекція для карти*/

var projection;
var zoom;


projection = d3.geoMercator()
    .scale(3000)
    .rotate([0, 0, 0])
    .center([30, 49]);

zoom = d3.zoom()
    .scaleExtent([5, 5])
    .on('zoom', function(){
        map.redraw(d3.event.transform, riverForDrawId);
        d3.event.transform.k === 1 ? d3.select('#labels')
            .style("display", "none") : d3.select('#labels').style("display", "block");
    });


var path2 = d3.geoPath()
    .projection(projection);


//tooltip for all flowers
var flowerhint = d3.select("body").append("div")
    .attr("class", "flower-hint")
    .style("opacity", 0);

var chartHint = d3.select("body").append("div")
    .attr("class", "chart-hint")
    .style("opacity", 0);


//підказка про кожний показник
var indicatorHint = d3.select("#modalKeysHeadings").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


/* контейнер для svg та canvas */
var map = {};

map.width = document.getElementById('body').clientWidth;
map.height = window.innerHeight * 0.7;

projection
    .translate(
        [map.width/2, map.height/2]
    );


function drawAllCanvases(mapCanvas, className, retrieveName, retrievePath){

    map[mapCanvas] = d3.select("#body").append("canvas")
        .attr('height', map.height)
        .attr('width', map.width)
        .attr("class", className);

    var ctx = map[mapCanvas].node().getContext('2d');

    var riverPath = d3.geoPath()
        .projection(projection)
        .context(ctx);


    map[mapCanvas].draw = function (transform) {
        retrieve(retrieveName, d3.json, retrievePath, function (data) {
            ctx.clearRect(0, 0, map.width, map.height);
            ctx.save();

            if (transform) {
                ctx.translate(transform.x, transform.y);
                ctx.scale(transform.k, transform.k);
            }
            ctx.fillStyle = "transparent";        
            data.forEach(function (d) {
                ctx.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);
                ctx.lineWidth = d.properties.a_WIDTH5 / 100;
                ctx.lineWidth = d.properties.a_WIDTH5 / 150;
                ctx.beginPath();
                riverPath(d);
                ctx.fill();
                ctx.stroke();
            });
            ctx.restore();
        });
    };

}

drawAllCanvases("canvasDanube", "river danube", "DANUBE", "data/DANUBE.json");
drawAllCanvases("canvasDnipro", "river dnipro", "DNIEPR", "data/DNIPRO.json");
drawAllCanvases("canvasDon", "river don", "DON", "data/DON.json");
drawAllCanvases("canvasWisla", "river wisla", "WISLA", "data/WISLA.json");
drawAllCanvases("canvasBug", "river southernbug", "SOUTHERNBUG", "data/SOUTHERNBUG.json");
drawAllCanvases("canvasDniestr", "river dnister", "DNIESTR", "data/DNIESTR.json");


/*------------ Draw rivers ----------------------------*/

    map.canvasDanube.draw();
    map.canvasDnipro.draw();
    map.canvasDon.draw();
    map.canvasBug.draw();
    map.canvasDniestr.draw();
    map.canvasWisla.draw();
    drawPoints();


/*------------ Redraw rivers on zoom ------------------*/

    map.redraw = function (transform, riverForDrawId) {

        if (riverForDrawId == "danube") {
            map.canvasDanube.draw(transform);
        }
        if (riverForDrawId == "dnipro") {
            map.canvasDnipro.draw(transform);
        }
        if (riverForDrawId == "don") {
            map.canvasDon.draw(transform);
        }
        if (riverForDrawId == "southernbug") {
            map.canvasBug.draw(transform);
        }

        if (riverForDrawId == "dnister") {
            map.canvasDniestr.draw(transform);
        }
        if (riverForDrawId == "wisla") {
            map.canvasWisla.draw(transform);
        }

        //map.canvasPoints.draw(transform);

        if (typeof riverForDrawId === 'undefined') {
            map.canvasDanube.draw(transform);
            map.canvasDnipro.draw(transform);
            map.canvasDon.draw(transform);
            map.canvasBug.draw(transform);
            map.canvasDniestr.draw(transform);
            map.canvasWisla.draw(transform);
        }


        map.svg.attr("transform", d3.event.transform);
        map.svgShape.attr("transform", d3.event.transform);
        map.svgLabels.attr("transform", d3.event.transform);
        map.svgShape.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        map.svg.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        map.svgLabels.style("stroke-width", 1.5 / d3.event.transform.k + "px");        
    };




/* -------------------- append svg  -------------------- */
var mista = [
    { name: "Вінниця", location: { latitude:28.2802,  longitude: 49.1414  }  },
    { name: "Дніпро", location: { latitude:35.0131, longitude: 48.2758 } },
    { name: "Донецьк", location: { latitude:37.4815, longitude: 48.0032 } },
    { name: "Житомир", location: { latitude: 28.3928, longitude: 50.1516 } },
    { name: "Запоріжжя", location: { latitude: 35.0818, longitude: 47.5016 } },
    { name: "Івано-Франківськ", location: { latitude: 24.4238, longitude: 48.5522 } },
    { name: "Київ", location: { latitude: 30.5238000, longitude: 50.4546600 } },
    { name: "Кропивницький", location: { latitude:32.1600, longitude: 48.3036 } },
    { name: "Луганськ", location: { latitude: 39.1831, longitude: 48.3406 } },
    { name: "Луцьк", location: { latitude: 25.1928, longitude: 50.4452 } },
    { name: "Львів", location: { latitude:24.0051, longitude: 49.4948 } },
    { name: "Миколаїв", location: { latitude:31.5937, longitude: 46.5831 } },
    { name: "Одеса", location: { latitude:30.4436, longitude: 46.2908 } },
    { name: "Полтава", location: { latitude: 34.3304 , longitude: 49.3522 } },
    { name: "Рівне", location: { latitude:26.1505, longitude: 50.3711 } },
    { name: "Сімферополь", location: { latitude: 34.06, longitude: 44.57 } },
    { name: "Суми", location: { latitude: 34.4812, longitude: 50.5443 } },
    { name: "Тернопіль", location: { latitude: 25.3541, longitude: 49.3312 } },
    { name: "Ужгород", location: { latitude: 22.1742, longitude:  48.4726} },
    { name: "Харків", location: { latitude:36.1345, longitude: 50.0021 } },
    { name: "Херсон", location: { latitude: 32.3652, longitude:  46.3824} },
    { name: "Хмельницький‎", location: { latitude: 26.5846, longitude: 49.2510 } },
    { name: "Черкаси", location: { latitude:  32.0335, longitude: 49.2640 } },
    { name: "Чернігів", location: { latitude: 31.1755, longitude: 51.2928 } },
    { name: "Чернівці", location: { latitude:25.5518, longitude: 48.1919 } }
];


map.svg =
    d3.select('#body')
        .append('svg')
        .attr("id", "flowers")
        .attr('width', map.width)
        .attr('height', map.height)
        .append('g');

map.svgShape =
    d3.select('#body')
        .append('svg')
        .attr("id", "svgukraine")
        .attr('width', map.width)
        .attr('height', map.height)
        .append("g");

map.svgLabels =
    d3.select('#body')
        .append('svg')
        .attr("id", "labels")
        .attr('width', map.width)
        .attr('height', map.height)
        .append("g");




/* -------------------- Ukraine -------------------------------- */
d3.json("data/ukr_shape.geojson", drawUkraine);

function drawUkraine(ukraine) {
    map.svgShape.selectAll("path")
        .data(ukraine.features)
        .enter()
        .append("path")
        .attr("d", path2)
        .attr("id", "ukraine")
}


var cities = map.svgLabels
    .append("g");

cities.selectAll("text")
    .data(mista)
    .enter()
    .append("text")
    .attr("transform", function(d) {
        return "translate(" + projection([
                d.location.latitude + 0.05,
                d.location.longitude
            ]) + ")"
    })
    .text(function (d) { return d.name; } )
    .attr("class", "map-cities-labels")
    .attr("font-size", "5px");


/* спроба відмалювати квіточки на canvas, працює, клік-евенти не додавала і трішки невдалий rotate, можна пізніше погратись з цим ще */
// map.canvasPoints = d3.select("#body").append("canvas")
//     .attr("class", "layer")
//     .attr('width', map.width)
//     .attr('height', map.height);
//
// var context = map.canvasPoints.node().getContext('2d');
//
// retrieve_points_data(function (points) {
//     map.canvasPoints.draw = function(transform) {
//
//         let targetRiver = riversNames
//             .filter(function (obj) {
//                 return obj.value === riverForDrawId;
//             })[0].key;
//
//         context.clearRect(0, 0, map.width, map.height);
//
//         var nested = d3.nest()
//             .key(function (d) {
//                 return d.id
//             })
//             .entries(points.filter(function(d){return d.river === targetRiver}));
//
//
//         nested.forEach(function (flower) {
//             let piedata = pie(flower.values
//                 .filter(function (k) { return k.size > 0; } ));
//
//             piedata.forEach(function (d) {
//                 let angle = (d.startAngle + d.endAngle) / 2;
//                 let rotate_degree = angle / Math.PI * 180;
//                 var coords = projection([flower.values[0].lon, flower.values[0].lat]);
//                 var p;
//                 context.save();
//
//                 if (transform) {
//                     context.translate(0, 0);
//                     context.translate(coords[0] * transform.k + transform.x, coords[1] * transform.k + transform.y);
//                     context.scale(transform.k, transform.k);
//                 } else {
//                     context.translate(coords[0], coords[1]);
//                 }
//
//                 p = new Path2D(petalPath(d));
//                 context.rotate(rotate_degree);
//                 context.fillStyle = petalFill(d);
//                 context.fill(p);
//                 context.restore();
//
//             });
//         });
//
//         };
//
//     map.canvasPoints.draw();
//
// });


d3.select('#body')
    .call(zoom).on("wheel.zoom", null);

/* -------------------- Flowers -------------------------------- */
function drawPoints() {
    retrieve_points_data(function(points) {
        var nested = d3.nest()
            .key(function (d) { return d.id })
            .entries(points);


        map.svg.selectAll(".petal")
            .data(nested)
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
                        var filteredArray = riversNames.filter(function (obj) {
                            return obj.key === d.data.river;
                        });
                        return filteredArray.length > 0 ? filteredArray[0].value + " petal myBtn" :  "petal myBtn";
                    })
                    .attr("transform", function (d) { return r((d.startAngle + d.endAngle) / 2);  })
                    .attr("d", petalPath)
                    .style("fill", function (d) { return petalFill(d);  })
                    .on("mouseover", function (d) {
                       var targetFlower= d3.select(this.parentNode);
                        targetFlower.moveToFront();
                    })
                    /*чому тут d повертає не той датасет? , що треба, а гемометрію?????*/
                    .on('click touchstart', function (d) {
                        var modal = document.getElementById('myModal');
                        var span = document.getElementsByClassName("close")[0];

                        modal.style.display = "block";
                        span.onclick = function () { modal.style.display = "none"; };
                        window.onclick = function (event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        };
                        var IdForChart = d.data.id;
                        var keyindicator = d.data.key;
                        let dataName = d.data.name;

                        d3.selectAll("#texturePetals").attr("value", IdForChart);
                        d3.selectAll("#texturePetals").attr("name", keyindicator);
                        drawBigFlower(IdForChart);
                        drawChart(IdForChart, keyindicator, dataName);
                    });
                });

        d3.selectAll(".petal")
            .style("display", "none")
            .each(function () {
                var currentPath = this;
                if (currentPath.classList.contains("dnister")) {
                    d3.select(currentPath).style("display", "block")
                }
            });
    });




}

var flowefsize = 0.08;

function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
        r = size(flowefsize),

        m = {x: halfRadius + r, y: 0},
        c1 = {x: halfRadius + r / 2, y: s.y},
        c2 = {x: halfRadius + r / 2, y: e.y};
    return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 2) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 2) + " " + Math.round(0) + "," + Math.round(0) + "Z";
}



/* -------------------- Draw line charts -------------------------------- */


var chartX = d3.scaleTime()
    .rangeRound([0, 600]);

var chartY = d3.scaleLinear()
    .rangeRound([chartHeight, 0]);


var valueline = d3.line()
    .x(function (d) { return chartX(d.date); })
    .y(function (d) {  return chartY(d.value); });


d3.json("data/data_samples/27224.json", function(err, chart) {

        var chartSvg = d3.select("#chart")
            .append("svg")
            .attr("id", "chartToRemove")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", "0 0 " + 600 + " "  + 300 );

        var chartG = chartSvg.append("g")
            .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        
        var dataData = chart[0].data.filter(function (d) {
            return d.key === 'БСК5..МгО.дм3';
        });

        dataData.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        var norm = dataData[0].norm;
        norm = +norm;

        /* y axis */
        var values = dataData.map(function (d) {
            return d.value
        });
        var yMax = d3.max(d3.values(values));
        var yticks = [+norm];

        /* x axis */
        var dates = dataData.map(function (d) { return d.date });
        var xMin = d3.min(d3.values(dates));
        var xMax = d3.max(d3.values(dates));

        chartX.domain([xMin, xMax]);
        chartY.domain([0, d3.max(dataData, function (d) {
            return d.value;
        })]);


    //Градієнт для лінійного графіку
    chartSvg.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", chartY(0))
        .attr("x2", 0).attr("y2", chartY(yMax))
        .selectAll("stop")
        .data([
            {offset: "0%", color: "#199eb1"},
            {offset: "10%", color: "#199eb1"},
            {offset: "10%", color: reds[0]},
            {offset: "30%", color: reds[0]},
            {offset: "30%", color: reds[1]},
            {offset: "50%", color: reds[1]},
            {offset: "50%", color: reds[2]},
            {offset: "70%", color: reds[2]},
            {offset: "70%", color: reds[3]},
            {offset: "90%", color: reds[3]},
            {offset: "90%", color: reds[4]},
            {offset: "100%", color: reds[4]}

        ])
        .enter().append("stop")
        .attr("offset", function (d) { return d.offset; })
        .attr("stop-color", function (d) { return d.color; });
        /*end of the gradient*/


        //Додaємо path and axis
        chartG.append("path")
            .data([dataData])
            .attr("class", "line")
            .attr("d", valueline)
            .attr("stroke", "#49E858")
            .style("stroke-width", "2px");

        chartG.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(d3.axisBottom(chartX)
                .ticks(numTicks(chartWidth))
                .tickSize(-chartHeight)
                .tickFormat(multiFormat));


        chartG.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(chartY)
                .tickValues(yticks)
                .tickSize(-chartWidth));


        chartG.append("text")
            .attr("id", "lineText")
            .attr("x", chartX(parseTime("2018-01-01")) + 5)
            .attr("y", function() { return norm > 0 ? chartY(norm) + 15 : false; })
            .text(function() { return  norm > 0 ? "норма" : ""; });


        var modalKeysHeadings = d3.select('#petalsData')
            .append("div")
            .attr("id","modalKeysHeadings");


        var textTitle = chartSvg.append("g");

        textTitle.append("text")
            .attr("id", "keyHeading")
            .attr("x", 15)
            .attr("y", 0)
            .attr("fill", "white")
            .attr("font-size", "14px")
            .attr("text-anchor", "start")
            .style("font-weight", "bold")
            .style("letter-spacing", "1px")
            .style("cursor", "help");


        textTitle.append("svg:title")
            .attr("id", "keyimgtooltip")
            .attr("width", 100)
            .text("Триває завантаження даних, почекайте");

        $("body").on('DOMSubtreeModified', "#keyHeading", function() {
            textTitle.select("rect")
                .transition().duration(300)
                .attr("width", function() {
                    var textwidth = $("#keyHeading")[0].getBoundingClientRect();
                    return textwidth.width + 10
                })
        });


        d3.select("img#texturePetals")
            .attr("src", "img/eye-white.png")
            .attr("title", "Версія для користувачів з вадами зору. Пелюстки з діагональною полоскою - неналежна якість за обраним показником")
            .on("click", function () {
                $(this).toggleClass("eye-clicked");
                var id = $("#texturePetals").attr("value");
                var key = $("#texturePetals").attr("name");

                drawBigFlower(id);
            });
});





/* кнопка зума над картою. При переключенні змінюємо background-image у кнопки та зумимо карту*/
d3.select("#zoom-button").on("click", function(){
    d3.select(this)
        .classed("zoom-in", !d3.select(this).classed("zoom-in"));

    d3.select(this)
        .classed("zoom-out", !d3.select(this).classed("zoom-out"));

    zoom_scale = d3.select(this)
        .classed("zoom-in") === true ? 1 : 5;


    var lat, lon;
    if(window.innerWidth >= 812){
        lat = d3.select(this).classed("zoom-in") === true ? 30 : riverForZoomLat;
        lon = d3.select(this).classed("zoom-in") === true ? 49 : riverForZoomLon;
    } else {
        lat = d3.select(this).classed("zoom-in") === true ? riverForZoomLat : riverForZoomLat;
        lon = d3.select(this).classed("zoom-in") === true ? riverForZoomLon : riverForZoomLon;
    }

    var x = projection([lat,lon])[0],
        y = projection([lat,lon])[1],
        translate = [map.width / 2 - zoom_scale * x, map.height / 2 - zoom_scale * y];

    d3.select("#body")
        .transition().duration(750)
        .call(zoom.transform, d3.zoomIdentity
            .scale(zoom_scale)
            .translate(translate[0]/zoom_scale,translate[1]/zoom_scale)
        );
});


window.onload = function(){
    setTimeout(function(){
        document.getElementById('zoom-button').click();
    }, 1000)
};