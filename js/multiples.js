

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

var plasma = ['#0d0887','#310a86','#450e85','#551384','#641982','#711f81','#7e257f','#8a2c7d','#94347b','#9f3b79','#a84376','#b14b74','#ba5371','#c25c6d','#ca666a','#d16e67','#d77963','#dd8260','#e28c5c','#e69757','#eaa053','#edac4e','#efb749','#f1c144','#f2cc3f','#f3d839','#f2e232','#f2ed2b','#f0f921'];


var spectral = ['#120021','#1b0929','#250f31','#301438','#3b1840','#461d47','#51224f','#5d2755','#682d5c','#743263','#7f3969','#8a3f6f','#954675','#a04e7a','#ab557f','#b55d84','#bf6688','#c9708c','#d2788f','#db8293','#e38c95','#eb9897','#f1a299','#f6ad9a','#fbba9a','#fec699','#ffd398','#ffe195'];

var bluRedWhite = ['#12335a', '#143d67', '#154675', '#165183', '#165b92', '#1765a0', '#1671af', '#167bbf', '#1486ce', '#1292dd', '#0e9ded', '#3aa8f5', '#64b2f4', '#82bcf4'];

var greens = ['#2f4050','#324953','#345257','#375b5b','#38645e','#3a6e61','#3b7765','#3c8168','#3d8b6b','#3d946f','#489d76','#57a480','#68ad8c','#77b497','#86bba3','#94c3ae','#a3cbb9','#b2d2c5','#c0d9d1','#cfe1dd','#dde8e9','#ecf0f5'];

var viridisScale = d3.scaleQuantile() //синя шкала для річок
    .range(virids)
    .domain([0,9]);

var infernoScale = d3.scaleQuantile() //синя шкала для річок
    .range(inferno)
    .domain([0,9]);

var plasmaScale = d3.scaleQuantile() //синя шкала для річок
    .range(plasma)
    .domain([0,9]);

var spectralScale = d3.scaleQuantile() //синя шкала для річок
    .range(spectral)
    .domain([0,9]);

var BlWhScale = d3.scaleQuantile() //синя шкала для річок
    .range(bluRedWhite)
    .domain([0,9]);

var greenScale = d3.scaleQuantile() //синя шкала для річок
    .range(greens)
    .domain([0,9]);



var colorScale = d3.scaleQuantile() //синя шкала для річок
        .range(colorbrewer.Blues[4])
        .domain([0,4]);

var PointColorsRed = d3.scaleQuantile()
    .range(colorbrewer.Reds[9])
    .domain([0, 9]);

//
// var riversNames = [
//         // {key:"Дунай", value:"danube", lat: "24.53", lon:"48.45", scale:"10000"},
//         {key:"Дунай", value:"danube", lat: "20.00", lon:"48.30", scale:"2700", color: "viridisScale"},
//         {key:"Дністер", value:"dnister", lat: "25.53",  lon:"49.00", scale:"4000", color: "viridisScale"},
//         {key:"Дніпро", value:"dnipro", lat: "30.53", lon:"52.45", scale:"3000", color: "viridisScale"},
//         {key:"Дон", value:"don", lat: "41.53", lon:"51.55", scale:"3000", color: "infernoScale"},
//         {key:"Південний Буг", value:"southernbug", lat: "30.53", lon:"49.00", scale:"4000", color: "infernoScale"},
//         {key:"Вісла", value:"wisla", lat: "25.53", lon:"54.00", scale:"4000", color: "infernoScale"}
// ];
//
// var indicatorNames = [
//     {key: "БСК5..МгО.дм3", cont: "one"},
//     {key: "Завислі..суспендовані..речовини..мг.дм3", cont: "two"},
//     {key: "Кисень.розчинений.МгО2.дм3", cont: "three"},
//     {key: "Сульфат.іони..мг.дм3", cont: "four"},
//     {key: "Хлорид.іони..мг.дм3", cont: "five"},
//     {key: "Амоній.іони..мг.дм3", cont: "siz"},
//     {key: "Нітрат.іони..мг.дм3", cont: "seven"},
//     {key: "Нітрит.іони..мг.дм3", cont: "eight"},
//     {key: "Фосфат.іони..поліфосфати...мг.дм3", cont: "nine"},
//     {key: "Хімічне.споживання.кисню..мгО.дм3", cont: "ten"},
//     {key: "Синтетичні.поверхнево.активні.речовини..аніонні...мг.дм3", cont: "eleven"}
// ];
//
// /* Глобальні змінні для квіточок*/





/*Змінні для карт (проекція, зум)*/

var projection = d3.geoMercator()
    .scale(1500)
    .rotate([0, 0, 0])
    .center([27.53, 47.00]);

var path = d3.geoPath()
    .projection(projection);



var bigMap = d3.select("body")
    .append("svg")
    .attr("id", "bigsvg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 960 350");

var group = bigMap.append("g");






/*----------------------
 Малюємо шейп України
 -----------------------*/
//
// d3.json("data/ukr_shape.geojson", drawUkraine);
// function drawUkraine(ukraine){
//     group.selectAll("path")
//         .data(ukraine.features)
//         .enter()
//         .append("path")
//         .attr("d", path)
//         .attr("id", "ukraine")
//
// };


/* -----------------------------------------------------------------------
Малюємо маленькі карти  (у фінальній версії не потрібно, карти картинками)
-------------------------------------------------------------------------*/
// drawSmallMaps("data/all_total_basins.json", "#dnister");
// drawSmallMaps("data/all_total_basins.json", "#danube");
// drawSmallMaps("data/all_total_basins.json", "#dnipro");
// drawSmallMaps("data/all_total_basins.json", "#don");
// drawSmallMaps("data/all_total_basins.json", "#southernbug");
// drawSmallMaps("data/all_total_basins.json", "#wisla");




/*-------------------------------------
 Малюємо велику карту з басейнами рік
 -------------------------------------*/
d3.json("data/all_total_basins.json", drawRivers);





/*-----------------------------------------------------------------------------------
Малюємо лінійний графік with general update (оновлюється скриптом 'drawChart.js')
------------------------------------------------------------------------------------*/

// var chartMargin = {top: 20, right: 20, bottom: 20, left: 35};
//
// // var W = (parseInt(d3.select('body').style('width'), 10) - chartMargin.left - chartMargin.right) * 0.8;
// var chartWidth = clonedivWidth - chartMargin.left - chartMargin.right;
// chartHeight = 300 - chartMargin.top - chartMargin.bottom;
//
// var parseTime = d3.timeParse("%d.%m.%Y");
//
// var chartX = d3.scaleTime()
//     .rangeRound([0, chartWidth]);
//
// var chartY = d3.scaleLinear()
//     .rangeRound([chartHeight, 0]);
//
//
// var valueline = d3.line()
//     .x(function (d) {
//         return chartX(d.date);
//     })
//     .y(function (d) {
//         return chartY(d.value);
//     });
//
// d3.csv("data/total_data_gather.csv", function (error, chart) {
//
//     var chartSvg = d3.select("#chart")
//         .append("svg")
//         .attr("id", "chartToRemove")
//         .attr("width", chartWidth + chartMargin.left + chartMargin.right)
//         .attr("height", chartHeight + chartMargin.top + chartMargin.bottom);
//         // .attr("preserveAspectRatio", "xMinYMin meet")
//         // .attr("viewBox", "0 0 960 300");
//
//     var chartG = chartSvg.append("g")
//         .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top +")");
//
//
//     var idData = chart.filter(function (d) {
//         return d.id === "27224"
//     });
//
//     idData.forEach(function (d) {
//         d.date = parseTime(d.date);
//         d.value = +d.value;
//     });
//
//
//     var dataData = idData.filter(function (d) {
//         return d.key === 'БСК5..МгО.дм3';
//     });
//
//
//     dataData.sort(function(a,b){
//         return new Date(b.date) - new Date(a.date);/* щоб не малюватись крокозяблики*/
//     });
//
//     var norm = dataData[0].norm;
//     norm = +norm;
//
//     d3.select('#petalsData')
//         .html(dataData[0].name);
//
//
//
//     //yAxis
//     var values = dataData.map(function (d) {  return d.value  });
//     var yMax = d3.max(d3.values(values));
//     var yMin = d3.min(d3.values(values));
//     var yticks = [yMin, +norm, yMax];
//     yticks.sort(function(a,b) {   return a - b  });
//
//
//
//     //xAxis
//     var dates = dataData.map(function (d) {
//         return d.date    });
//     var xMin = d3.min(d3.values(dates));
//     var xMax = d3.max(d3.values(dates));
//     // var xMax = new Date();
//     chartX.domain([xMin, xMax]);
//     chartY.domain([0, d3.max(dataData, function (d) {
//         return d.value;
//     })]);
//
//
//     //Градієнт для лінійного графіку
//     chartSvg.append("linearGradient")
//         .attr("id", "line-gradient")
//         .attr("gradientUnits", "userSpaceOnUse")
//         .attr("x1", 0).attr("y1", chartY(0))
//         .attr("x2", 0).attr("y2", chartY(yMax))
//         .selectAll("stop")
//         .data([
//             {offset: "0%", color: "#49E858"},
//             {offset: "10%", color: "#49E858"},
//             {offset: "10%", color: "#fff5f0"},
//             {offset: "20%", color: "#fff5f0"},
//             {offset: "20%", color: "#fee0d2"},
//             {offset: "30%", color: "#fee0d2"},
//             {offset: "30%", color: "#fcbba1"},
//             {offset: "40%", color: "#fcbba1"},
//             {offset: "40%", color: "#fc9272"},
//             {offset: "50%", color: "#fc9272"},
//             {offset: "50%", color: "#fb6a4a"},
//             {offset: "60%", color: "#fb6a4a"},
//             {offset: "60%", color: "#ef3b2c"},
//             {offset: "70%", color: "#ef3b2c"},
//             {offset: "70%", color: "#cb181d"},
//             {offset: "80%", color: "#cb181d"},
//             {offset: "80%", color: "#a50f15"},
//             {offset: "90%", color: "#a50f15"},
//             {offset: "90%", color: "#a50f15"},
//             {offset: "100%", color: "#67000d"}
//         ])
//         .enter().append("stop")
//         .attr("offset", function(d) { return d.offset; })
//         .attr("stop-color", function(d) { return d.color; });
//     /*end of the gradient*/
//
//
//
//
//     //Додaємо path and axis
//     chartG.append("path")
//         .data([dataData])
//         .attr("class", "line")
//         .attr("d", valueline)
//         .attr("stroke", "#49E858");
//
//     chartG.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + chartHeight + ")")
//         .call(d3.axisBottom(chartX).ticks(numTicks(chartWidth)).tickSize(-chartHeight).tickFormat(d3.timeFormat("%b-%Y")));
//
//
//     chartG.append("g")
//         .attr("class", "y axis")
//         // .attr("transform", "translate(30,0)")//magic number, change it at will
//         .call(d3.axisLeft(chartY).tickValues(yticks).tickSize(-chartWidth));
//
//
//     d3.select('#petalsData').append("p")
//         .attr("id", "modalKeysHeadings")
//         .text("триває завантаження").style("font-weight", "bold");
//
// });
//
// // function redraw() { /* невдала спроба зробити графік динамічно resizable*/
// //     console.log("resized");
// //     var W = (parseInt(d3.select('body').style('width'), 10) - chartMargin.left - chartMargin.right) * 0.8;
// //     var chartWidth = W - chartMargin.left - chartMargin.right;
// //
// //     var chartX = d3.scaleTime()
// //         .rangeRound([0, chartWidth]);
// //
// //     var chartY = d3.scaleLinear()
// //         .rangeRound([chartHeight, 0]);
// //
// //
// //
// //
// //     var valueline = d3.line()
// //         .x(function (d) {
// //             return chartX(d.date);
// //         })
// //         .y(function (d) {
// //             return chartY(d.value);
// //         });
// //
// //     var chartSvg = d3.select("#chartToRemove");
// //
// //     chartSvg
// //         .attr("width", chartWidth + chartMargin.left + chartMargin.right)
// //         .attr("height", chartHeight + chartMargin.top + chartMargin.bottom);
// //
// //     var chartG = chartSvg.select("g");
// //
// //     d3.selectAll('.line')
// //         .attr("d", valueline);
// //
// //
// //     d3.selectAll(".x.axis")
// //         .call(d3.axisBottom(chartX)
// //             .scale(chartX)
// //             .ticks(numTicks(chartWidth))
// //             .tickSize(-chartHeight)
// //             .tickFormat(d3.timeFormat("%Y-%m")));
// //
// //     d3.selectAll(".y.axis")
// //         .call(d3.axisLeft(chartY)
// //             .tickSize(-chartWidth)
// //             .ticks(6));
// //
// //
// //
// //
// // }
//
//
//
//
// /* кількість ticks для вісі Х*/
// function numTicks(widther) {
//     if (widther <= 900) {
//         return 4
//         console.log("return 4")
//     }
//     else {
//         return 8
//         console.log("return 5")
//     }
// }
//
// /* end of line chart*/
//
//
//
// /*-----------------------------------------------------------------------------------
//  Малюємо велику квітку (оновлюється скриптом 'drawChart.js')
//  ------------------------------------------------------------------------------------*/
//
//
// /* end of dig flower*/
//
//
//
// /* Малюємо квіточки із затримкою, аби вони були зверху річок*/
// setTimeout(drawPoints, 6000);
//
//
//
//
//
// // /*Функція зуму*/
// // function zoomed() {
// //     // group.style("stroke-width", 1.5 / d3.event.transform.k + "px");
// //     group.attr("transform", d3.event.transform); // updated for d3 v4
// // }
//
//
//
//
// /*Перевірка if array contains*/
// Array.prototype.contains = function (v) {
//     for (var i = 0; i < this.length; i++) {
//         if (this[i] === v) return true;
//     }
//     return false;
// };
//
//
//
//
// /*Пошук за атрибутом елементу*/
// // function FindByAttributeValue(attribute, value, element_type)    {
// //     element_type = element_type || "*";
// //     var All = document.getElementsByTagName(element_type);
// //     for (var i = 0; i < All.length; i++)       {
// //         if (All[i].getAttribute(attribute) == value) { return All[i]; }
// //     }
// // }
//
//
//
//
//
// function petalPath(d) {
//     var angle = (d.endAngle - d.startAngle) / 3,
//         s = polarToCartesian(-angle, halfRadius),
//         e = polarToCartesian(angle, halfRadius),
//     // r = size(d.data.size),
//         r = size(0.03),
//
//         m = {x: halfRadius + r, y: 0},
//         c1 = {x: halfRadius + r / 2, y: s.y},
//         c2 = {x: halfRadius + r / 2, y: e.y};
//     return "M0,0Q" + Math.round(c1.x) + "," + Math.round(c1.y * 2) + " " + Math.round(m.x + r) + "," + Math.round(m.y) + "Q" + Math.round(c2.x) + "," + Math.round(c2.y * 2) + " " + Math.round(0) + "," + Math.round(0) + "Z";
// };
//
//
//
// function r(angle) {
//     return "rotate(" + (angle / Math.PI * 180) + ")";
// }
//
// function polarToCartesian(angle, radius) {
//     return {
//         x: Math.cos(angle) * radius,
//         y: Math.sin(angle) * radius
//     };
// }  /* end of flowers */
//


