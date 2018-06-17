var PointColorsRed = d3.scaleQuantile()
    .range(colorbrewer.Reds[9])
    .domain([0, 9]);



var riversNames = [
    // {key:"Дунай", value:"danube", lat: "24.53", lon:"48.45", scale:"10000"},
    {key:"Дунай", value:"danube", lat: "20.00", lon:"48.30", scale:"2700", color: "viridisScale"},
    {key:"Дністер", value:"dnister", lat: "25.53",  lon:"49.00", scale:"4000", color: "viridisScale"},
    {key:"Дніпро", value:"dnipro", lat: "30.53", lon:"52.45", scale:"3000", color: "viridisScale"},
    {key:"Дон", value:"don", lat: "41.53", lon:"51.55", scale:"3000", color: "infernoScale"},
    {key:"Південний Буг", value:"southernbug", lat: "30.53", lon:"49.00", scale:"4000", color: "infernoScale"},
    {key:"Вісла", value:"wisla", lat: "25.53", lon:"54.00", scale:"4000", color: "infernoScale"}
    ];

var chartMargin = {top: 20, right: 20, bottom: 20, left: 35};

var chartWidth = clonedivWidth - chartMargin.left - chartMargin.right,
chartHeight = 300 - chartMargin.top - chartMargin.bottom;

var flowerMargin = {top: 20, right: 20, bottom: 20, left: 35};
var flowerWidth = clonedivWidth - chartMargin.left - chartMargin.right,
    flowerHeight = 300 - chartMargin.top - chartMargin.bottom;

var flowerSvg = d3.select("#big-flower").append("svg")
    .attr("id", "#bigFlower")
    .attr("width", flowerWidth + flowerMargin.left + flowerMargin.right)
    .attr("height", chartHeight + flowerMargin.top + flowerMargin.bottom);


var flowerG = flowerSvg.append("g")
    .attr('transform', 'translate(+' + flowerWidth/2 + "," + flowerHeight/2+ ')');


var div = d3.select("#myModal").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var halfRadius = 2; //радіус для квіточок
var bigradius =  clonedivWidth /10;

var arc = d3.arc()
    .outerRadius(bigradius)
    .innerRadius(0);




var bluRedWhite = ['#12335a','#143d67','#154675','#165183','#165b92','#1765a0','#1671af','#167bbf','#1486ce','#1292dd','#0e9ded','#3aa8f5','#64b2f4','#82bcf4','#9dc6f3','#b4d1f3','#c8daf2'];

var BlWhScale = d3.scaleQuantile() //синя шкала для річок
    .range(bluRedWhite)
    .domain([0,9]);


var projection = d3.geoMercator()
    .scale(1400)
    .rotate([0, 0, 0])
    .center([22, 48.00]);

var size = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, halfRadius]);



var pie = d3.pie()
    .sort(null)
    // .value(function(d) { return d.size; });
    .value(function(d) { return 5; });

var path2 = d3.geoPath()
    .projection(projection);


var map = {};
map.width = window.innerWidth;
map.height = window.innerWidth / 3;
alert(map.width);


// var ctx = canvas.node().getContext('2d');


map.svg =
    d3.select('body')
        .append('svg')
        .attr("id", "bigsvg")
        // .attr("preserveAspectRatio", "xMinYMin meet")
        // .attr("viewBox", "0 0 960 350")
        .attr('width', map.width)
        .attr('height', map.height)
        .append('g');



map.canvas = d3.select("body").append("canvas")
    .attr('height', map.height)
    .attr('width', map.width)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 350")
    .attr("class", "river danube")
    .node().getContext('2d');



var path = d3.geoPath()
    .projection(projection)
    // .context(ctx);
    .context(map.canvas);


// var zoom = d3.zoom()
//     .scaleExtent([0, 10])
//     .on("zoom", zoomed);



    d3.json("data/all_total_basins.json", function (error, rivers) {

        var data = topojson.feature(rivers, rivers.objects.all_total_basins)
            .features.filter(function (d) {
                return d.properties.a_WIDTH5 > 5;
            });
        map.canvas.fillStyle = "none";
        data.forEach(function (d) {
            map.canvas.strokeStyle = BlWhScale(d.properties.a_DEPTH5 * 5);
            map.canvas.lineWidth = d.properties.a_WIDTH5 / 50;
            map.canvas.beginPath();
            path(d);
            map.canvas.fill();
            map.canvas.stroke();
        });

    });

d3.json("data/ukr_shape.geojson", drawUkraine);
function drawUkraine(ukraine){
    map.svg.selectAll("path")
        .data(ukraine.features)
        .enter()
        .append("path")
        .attr("d", path2)
        .attr("id", "ukraine")

};






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


    map.svg.selectAll(".petal")
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


});


function petalPath(d) {
    var angle = (d.endAngle - d.startAngle) / 3,
        s = polarToCartesian(-angle, halfRadius),
        e = polarToCartesian(angle, halfRadius),
    // r = size(d.data.size),
        r = size(0.03),

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



var chartMargin = {top: 20, right: 20, bottom: 20, left: 35};

// var W = (parseInt(d3.select('body').style('width'), 10) - chartMargin.left - chartMargin.right) * 0.8;
var chartWidth = clonedivWidth - chartMargin.left - chartMargin.right;
chartHeight = 300 - chartMargin.top - chartMargin.bottom;

var parseTime = d3.timeParse("%d.%m.%Y");

var chartX = d3.scaleTime()
    .rangeRound([0, chartWidth]);

var chartY = d3.scaleLinear()
    .rangeRound([chartHeight, 0]);


var valueline = d3.line()
    .x(function (d) {
        return chartX(d.date);
    })
    .y(function (d) {
        return chartY(d.value);
    });

d3.csv("data/total_data_gather.csv", function (error, chart) {

    var chartSvg = d3.select("#chart")
        .append("svg")
        .attr("id", "chartToRemove")
        .attr("width", chartWidth + chartMargin.left + chartMargin.right)
        .attr("height", chartHeight + chartMargin.top + chartMargin.bottom);
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 960 300");

    var chartG = chartSvg.append("g")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top +")");


    var idData = chart.filter(function (d) {
        return d.id === "27224"
    });

    idData.forEach(function (d) {
        d.date = parseTime(d.date);
        d.value = +d.value;
    });


    var dataData = idData.filter(function (d) {
        return d.key === 'БСК5..МгО.дм3';
    });


    dataData.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);/* щоб не малюватись крокозяблики*/
    });

    var norm = dataData[0].norm;
    norm = +norm;

    d3.select('#petalsData')
        .html(dataData[0].name);



    //yAxis
    var values = dataData.map(function (d) {  return d.value  });
    var yMax = d3.max(d3.values(values));
    var yMin = d3.min(d3.values(values));
    var yticks = [yMin, +norm, yMax];
    yticks.sort(function(a,b) {   return a - b  });



    //xAxis
    var dates = dataData.map(function (d) {
        return d.date    });
    var xMin = d3.min(d3.values(dates));
    var xMax = d3.max(d3.values(dates));
    // var xMax = new Date();
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
            {offset: "0%", color: "#49E858"},
            {offset: "10%", color: "#49E858"},
            {offset: "10%", color: "#fff5f0"},
            {offset: "20%", color: "#fff5f0"},
            {offset: "20%", color: "#fee0d2"},
            {offset: "30%", color: "#fee0d2"},
            {offset: "30%", color: "#fcbba1"},
            {offset: "40%", color: "#fcbba1"},
            {offset: "40%", color: "#fc9272"},
            {offset: "50%", color: "#fc9272"},
            {offset: "50%", color: "#fb6a4a"},
            {offset: "60%", color: "#fb6a4a"},
            {offset: "60%", color: "#ef3b2c"},
            {offset: "70%", color: "#ef3b2c"},
            {offset: "70%", color: "#cb181d"},
            {offset: "80%", color: "#cb181d"},
            {offset: "80%", color: "#a50f15"},
            {offset: "90%", color: "#a50f15"},
            {offset: "90%", color: "#a50f15"},
            {offset: "100%", color: "#67000d"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
    /*end of the gradient*/




    //Додaємо path and axis
    chartG.append("path")
        .data([dataData])
        .attr("class", "line")
        .attr("d", valueline)
        .attr("stroke", "#49E858");

    chartG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(chartX).ticks(numTicks(chartWidth)).tickSize(-chartHeight).tickFormat(d3.timeFormat("%b-%Y")));


    chartG.append("g")
        .attr("class", "y axis")
        // .attr("transform", "translate(30,0)")//magic number, change it at will
        .call(d3.axisLeft(chartY).tickValues(yticks).tickSize(-chartWidth));


    d3.select('#petalsData').append("p")
        .attr("id", "modalKeysHeadings")
        .text("триває завантаження").style("font-weight", "bold");

});

// function redraw() { /* невдала спроба зробити графік динамічно resizable*/
//     console.log("resized");
//     var W = (parseInt(d3.select('body').style('width'), 10) - chartMargin.left - chartMargin.right) * 0.8;
//     var chartWidth = W - chartMargin.left - chartMargin.right;
//
//     var chartX = d3.scaleTime()
//         .rangeRound([0, chartWidth]);
//
//     var chartY = d3.scaleLinear()
//         .rangeRound([chartHeight, 0]);
//
//
//
//
//     var valueline = d3.line()
//         .x(function (d) {
//             return chartX(d.date);
//         })
//         .y(function (d) {
//             return chartY(d.value);
//         });
//
//     var chartSvg = d3.select("#chartToRemove");
//
//     chartSvg
//         .attr("width", chartWidth + chartMargin.left + chartMargin.right)
//         .attr("height", chartHeight + chartMargin.top + chartMargin.bottom);
//
//     var chartG = chartSvg.select("g");
//
//     d3.selectAll('.line')
//         .attr("d", valueline);
//
//
//     d3.selectAll(".x.axis")
//         .call(d3.axisBottom(chartX)
//             .scale(chartX)
//             .ticks(numTicks(chartWidth))
//             .tickSize(-chartHeight)
//             .tickFormat(d3.timeFormat("%Y-%m")));
//
//     d3.selectAll(".y.axis")
//         .call(d3.axisLeft(chartY)
//             .tickSize(-chartWidth)
//             .ticks(6));
//
//
//
//
// }




/* кількість ticks для вісі Х*/
function numTicks(widther) {
    if (widther <= 900) {
        return 4
        console.log("return 4")
    }
    else {
        return 8
        console.log("return 5")
    }
}

/* end of line chart*/







